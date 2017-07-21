#!/usr/bin/env python

import aiohttp
import functools
import json
import logging
import sys
import traceback

from aiohttp import web
from opentrons.server import serialize

# TODO(artyom): might as well use this: https://pypi.python.org/pypi/logging-color-formatter
from logging.config import dictConfig
logging_config = dict(
    version=1,
    formatters={
        'basic': {
            'format': '%(asctime)s %(name)s %(levelname)s [Line %(lineno)s]     %(message)s'  #NOQA
        }
    },
    handlers={
        'debug': {
            'class': 'logging.StreamHandler',
            'formatter': 'basic',
        }
    },
    root={
        'handlers': ['debug'],
        'level': logging.DEBUG,
    }
)
dictConfig(logging_config)

log = logging.getLogger(__name__)

# Keep these in sync with ES code
CALL_RESULT_MESSAGE = 0
CALL_ACK_MESSAGE = 1
NOTIFICATION_MESSAGE = 2
CONTROL_MESSAGE = 3

class Server(object):
    def __init__(self, root=None):
        self.objects = { id(self): self }
        self.root = root

    def update_refs(self, refs):
        self.objects.update(refs)

    def resolve_args(self, args):
        def resolve(a):
            if isinstance(a, dict) and a['$meta'] and a['$meta']['that']:
                return self.objects[a['$meta']['that']]
            return a

        return [resolve(a) for a in args]

    def get_root(self):
        return self.root

    async def dispatch(self, that, name, args):
        if not that in self.objects:
            raise ValueError('Object with id {0} not found'.format(that))

        obj = self.objects[that]
        function = getattr(type(obj), name)

        if not function:
            raise ValueError(
                'Function {0} not found in {1}'.format(name, type(obj)))

        if not callable(function):
            raise ValueError(
                'Property {0} of {1} is not a function'.format(name, type(obj)))

        res = function(obj, *self.resolve_args(args))
        self.objects[id(res)] = res

        return res

    def update_meta(self, obj, meta):
        if '$meta' not in obj:
            obj['$meta'] = {}
        obj['$meta'].update(meta)
        return obj

    # TODO: it looks like the exceptions being thrown in this method
    # are not escalated / reported
    async def handler(self, request):
        ws = web.WebSocketResponse()

        await ws.prepare(request)

        # Our first message is address of Server instance
        root, _ = serialize.get_object_tree(self, shallow=True)
        root = self.update_meta(root, {'type': CONTROL_MESSAGE})
        await ws.send_str(json.dumps(root))

        async for msg in ws:
            log.debug('Received: {0}'.format(msg))

            if msg.type == aiohttp.WSMsgType.TEXT:
                data = json.loads(msg.data)

                # Acknowledge the call
                await ws.send_str(
                    json.dumps(self.update_meta({}, {
                        'id': data['id'],
                        'type': CALL_ACK_MESSAGE 
                    })))

                meta = { 'id': data.pop('id'), 'type': CALL_RESULT_MESSAGE }
                try:
                    res = await self.dispatch(**data)
                    meta.update({'status': 'success'})
                    root, refs = serialize.get_object_tree(res)
                except Exception as e:
                    log.error('Exception while dispatching a method call: {0}'.format(traceback.format_exc()))
                    res = str(e)
                    meta.update({ 'status': 'error' })
                finally:
                    root, refs = serialize.get_object_tree(res)
                    self.update_refs(refs)
                    await ws.send_str(json.dumps(self.update_meta(root, meta)))

            elif msg.type == aiohttp.WSMsgType.ERROR:
                log.error(
                    'WebSocket connection closed with exception %s' % ws.exception())

        return ws


    def start(self, host='127.0.0.1', port=31950):
        app = web.Application()
        app.router.add_get('/', self.handler)
        web.run_app(app, host, port)


if __name__ == "__main__":
    kwargs = {}
    if (len(sys.args) == 2):
        try:
            address = sys.args[1].split(':')
            host, port, *_ = tuple(address + [])
            # Check that our IP address is 4 octets in 0..255 range each
            octets = filter([int(octet) for octet in host.split('.')], lambda v: 0 <= v <= 255)
            if len(octets) != 4:
                raise ValueError('Invalid address: {0}'.format())
            kwargs = {'host': host, 'port': int(port)}
        except e as Exception:
            log.debug('While parsing IP address: {0}'.format(e))
            print('Invalid address {0}. Correct format is IP:PORT'.format(address))
            exit(1)
    elif (len(sys.args) > 2):
        print('Too many arguments. Valid argument is IP:PORT')
        exit(1)

    start(**kwargs)
