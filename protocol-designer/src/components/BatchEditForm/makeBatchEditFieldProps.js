// @flow
import noop from 'lodash/noop'
import type {
  DisabledFields,
  MultiselectFieldValues,
} from '../../ui/steps/selectors'
import { getFieldDefaultTooltip } from '../StepEditForm/utils'
import type { FieldPropsByName } from '../StepEditForm/types'
import type { MultiSelectFieldName } from '../../form-types'

export const makeBatchEditFieldProps = (
  fieldValues: MultiselectFieldValues,
  disabledFields: DisabledFields,
  handleChangeFormInput: (name: string, value: mixed) => void
): FieldPropsByName => {
  const fieldNames: Array<MultiSelectFieldName> = Object.keys(fieldValues)
  return fieldNames.reduce<FieldPropsByName>((acc, name) => {
    const defaultTooltip = getFieldDefaultTooltip(name)
    acc[name] = {
      disabled: name in disabledFields,
      name,
      updateValue: value => handleChangeFormInput(name, value),
      value: fieldValues[name].value,
      errorToShow: null,
      onFieldBlur: noop,
      onFieldFocus: noop,
      isIndeterminate: fieldValues[name].isIndeterminate,
      tooltipContent:
        name in disabledFields ? disabledFields[name] : defaultTooltip,
    }
    return acc
  }, {})
}
