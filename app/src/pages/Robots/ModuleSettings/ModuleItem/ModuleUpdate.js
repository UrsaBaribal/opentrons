// @flow
import * as React from 'react'
import last from 'lodash/last'
import { useSelector, useDispatch } from 'react-redux'
import {
  OutlineButton,
  HoverTooltip,
  Icon,
  AlertModal,
} from '@opentrons/components'
import { Portal } from '../../../../App/portal'
import { getConnectedRobotName } from '../../../../redux/robot/selectors'
import {
  useDispatchApiRequest,
  getRequestById,
  getErrorResponseMessage,
  PENDING,
  FAILURE,
  dismissRequest,
} from '../../../../redux/robot-api'
import { updateModule } from '../../../../redux/modules'
import type { UpdateModuleAction } from '../../../../redux/modules/types'
import type { State, Dispatch } from '../../../../redux/types'
import type { RequestState } from '../../../../redux/robot-api/types'
import styles from './styles.css'

const FW_IS_UP_TO_DATE = 'Module Firmware is up to date'
const OK_TEXT = 'Ok'

const UPDATE = 'update'
const UPDATE_TO_DATE = 'up to date'

const FAILED_UPDATE_HEADER = 'Failed to update Module Firmware'
const FAILED_UPDATE_BODY =
  'An error occurred while attempting to update your robot.'

type Props = {|
  hasAvailableUpdate: boolean,
  controlDisabledReason: string | null,
  moduleId: string,
|}

export function ModuleUpdate(props: Props): React.Node {
  const { hasAvailableUpdate, moduleId, controlDisabledReason } = props
  const dispatch = useDispatch<Dispatch>()
  const robotName = useSelector(getConnectedRobotName)
  const [
    dispatchApiRequest,
    requestIds,
  ] = useDispatchApiRequest<UpdateModuleAction>()

  const canControl = controlDisabledReason === null
  const handleClick = () => {
    canControl &&
      robotName &&
      dispatchApiRequest(updateModule(robotName, moduleId))
  }
  const latestRequestId = last(requestIds)
  const latestRequest = useSelector<State, RequestState | null>(state =>
    getRequestById(state, latestRequestId)
  )
  const isPending = latestRequest?.status === PENDING

  const buttonText = hasAvailableUpdate ? UPDATE : UPDATE_TO_DATE
  let tooltipText = null
  if (!hasAvailableUpdate) {
    tooltipText = FW_IS_UP_TO_DATE
  } else if (controlDisabledReason !== null) {
    tooltipText = controlDisabledReason
  }

  const handleCloseErrorModal = () => {
    dispatch(dismissRequest(latestRequestId))
  }
  return (
    <div className={styles.module_update_wrapper}>
      <HoverTooltip tooltipComponent={tooltipText}>
        {hoverTooltipHandlers => (
          <div {...hoverTooltipHandlers}>
            <OutlineButton
              className={styles.module_update_button}
              onClick={handleClick}
              disabled={!canControl || !hasAvailableUpdate || isPending}
            >
              {isPending ? (
                <Icon name="ot-spinner" height="1em" spin />
              ) : (
                buttonText
              )}
            </OutlineButton>
          </div>
        )}
      </HoverTooltip>
      {latestRequest && latestRequest.status === FAILURE && (
        <Portal>
          <AlertModal
            alertOverlay
            heading={FAILED_UPDATE_HEADER}
            buttons={[{ children: OK_TEXT, onClick: handleCloseErrorModal }]}
          >
            <p>{FAILED_UPDATE_BODY}</p>
            <p>{getErrorResponseMessage(latestRequest.error)}</p>
          </AlertModal>
        </Portal>
      )}
    </div>
  )
}
