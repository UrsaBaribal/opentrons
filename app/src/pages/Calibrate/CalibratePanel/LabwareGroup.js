// @flow
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { SidePanelGroup, TitledList } from '@opentrons/components'
import { fetchLabwareCalibrations } from '../../../redux/calibration'
import {
  selectors as robotSelectors,
  actions as robotActions,
} from '../../../redux/robot'
import { LabwareListItem } from './LabwareListItem'
import type { BaseProtocolLabware } from '../../../redux/calibration/types'
import type { Dispatch } from '../../../redux/types'

export type LabwareGroupProps = {|
  robotName: string | null,
  tipracks: Array<BaseProtocolLabware>,
  otherLabware: Array<BaseProtocolLabware>,
|}

export function LabwareGroup(props: LabwareGroupProps): React.Node {
  const { robotName, tipracks, otherLabware } = props

  const { t } = useTranslation('protocol_calibration')
  const dispatch = useDispatch<Dispatch>()

  const calibratorMount = useSelector(robotSelectors.getCalibratorMount)
  const deckPopulated = useSelector(robotSelectors.getDeckPopulated)
  const tipracksConfirmed = useSelector(robotSelectors.getTipracksConfirmed)

  const isRunning = useSelector(robotSelectors.getIsRunning)

  React.useEffect(() => {
    robotName && dispatch(fetchLabwareCalibrations(robotName))
  }, [dispatch, robotName])

  const setLabwareToCalibrate = (lw: BaseProtocolLabware) => {
    const calibrator = lw.calibratorMount || calibratorMount
    if (!!deckPopulated && calibrator) {
      dispatch(robotActions.moveTo(calibrator, lw.slot))
    }
  }

  return (
    <SidePanelGroup title={t('labware_cal_title')} disabled={isRunning}>
      <TitledList
        title={t('labware_cal_tipracks_title')}
        disabled={tipracksConfirmed}
      >
        {tipracks.map(tr => (
          <LabwareListItem
            {...tr}
            key={tr.slot}
            isDisabled={tr.confirmed}
            onClick={() => setLabwareToCalibrate(tr)}
          />
        ))}
      </TitledList>
      <TitledList title={t('labware_cal_labware_title')}>
        {otherLabware.map(lw => (
          <LabwareListItem
            {...lw}
            key={lw.slot}
            isDisabled={!tipracksConfirmed}
            onClick={() => setLabwareToCalibrate(lw)}
          />
        ))}
      </TitledList>
    </SidePanelGroup>
  )
}
