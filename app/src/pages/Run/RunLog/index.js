// @flow
import * as React from 'react'
import { connect } from 'react-redux'

import {
  actions as robotActions,
  selectors as robotSelectors,
} from '../../../redux/robot'

import { CommandList } from './CommandList'

import type { State, Dispatch } from '../../../redux/types'
import type { SessionStatus, SessionStatusInfo } from '../../../redux/robot'
import type { CommandListProps } from './CommandList'

export { ConfirmCancelModal } from './ConfirmCancelModal'

type SP = {|
  commands: Array<any>,
  sessionStatus: SessionStatus,
  sessionStatusInfo: SessionStatusInfo,
  showSpinner: boolean,
|}

type DP = {|
  onResetClick: () => mixed,
|}

export const RunLog: React.AbstractComponent<{||}> = connect<
  CommandListProps,
  {||},
  _,
  _,
  _,
  _
>(
  mapStateToProps,
  mapDispatchToProps
)(CommandList)

function mapStateToProps(state: State): SP {
  return {
    commands: robotSelectors.getCommands(state),
    sessionStatus: robotSelectors.getSessionStatus(state),
    sessionStatusInfo: robotSelectors.getSessionStatusInfo(state),
    showSpinner:
      robotSelectors.getCancelInProgress(state) ||
      robotSelectors.getSessionLoadInProgress(state),
  }
}

function mapDispatchToProps(dispatch: Dispatch): DP {
  return {
    onResetClick: () => dispatch(robotActions.refreshSession()),
  }
}
