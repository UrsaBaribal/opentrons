import * as React from 'react'
import ReactSelect, { components as reactSelectComponents } from 'react-select'
import cx from 'classnames'

import { Icon } from '../icons'
import { POSITION_ABSOLUTE, POSITION_FIXED } from '../styles'
import styles from './Select.css'

export { reactSelectComponents }

export const PLACEMENT_AUTO: 'auto' = 'auto'
export const PLACEMENT_BOTTOM: 'bottom' = 'bottom'
export const PLACEMENT_TOP: 'top' = 'top'

export const CONTEXT_MENU: 'menu' = 'menu'
export const CONTEXT_VALUE: 'value' = 'value'

export const SELECT_CX_PREFIX = 'ot_select'

export type ChangeAction =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option'

export interface SelectOption {
  value: string
  label?: string
  isDisabled?: boolean
}

export type SelectOptionOrGroup =
  | SelectOption
  | { options: SelectOption[]; label?: string }

export type SelectPlacement =
  | typeof PLACEMENT_AUTO
  | typeof PLACEMENT_BOTTOM
  | typeof PLACEMENT_TOP

export type SelectPosition = typeof POSITION_ABSOLUTE | typeof POSITION_FIXED

export type SelectOptionContext = typeof CONTEXT_MENU | typeof CONTEXT_VALUE

// this object is not exhaustive because react-select's documentation is bad
interface SelectComponentProps {
  innerRef: any
  innerProps: any
  selectProps: { menuIsOpen: boolean }
}

export interface SelectProps {
  options: SelectOptionOrGroup[]
  value?: SelectOption | null
  defaultValue?: SelectOption | null
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  id?: string
  isDisabled?: boolean
  isSearchable?: boolean
  name?: string
  menuIsOpen?: boolean
  menuPlacement?: SelectPlacement
  menuPosition?: SelectPosition
  menuPortalTarget?: HTMLElement
  placeholder?: ?string
  tabIndex?: string | number
  formatOptionLabel?: (
    option: SelectOption,
    data: {
      context: SelectOptionContext
      inputValue: string
      selectValue: SelectOption[] | SelectOption | null | void
    }
  ) => JSX.Element
  onBlur?: (e: React.FocusEvent<HTMLElement>) => unknown
  onChange?: (value: SelectOption | null, action: ChangeAction) => unknown
  onFocus?: (e: React.FocusEvent<HTMLElement>) => unknown
}

const NO_STYLE = () => null

const CLEAR_STYLES = {
  clearIndicator: NO_STYLE,
  container: NO_STYLE,
  control: NO_STYLE,
  dropdownIndicator: NO_STYLE,
  group: NO_STYLE,
  groupHeading: NO_STYLE,
  indicatorsContainer: NO_STYLE,
  indicatorSeparator: NO_STYLE,
  input: NO_STYLE,
  loadingIndicator: NO_STYLE,
  loadingMessage: NO_STYLE,
  menu: NO_STYLE,
  menuList: NO_STYLE,
  multiValue: NO_STYLE,
  multiValueLabel: NO_STYLE,
  multiValueRemove: NO_STYLE,
  option: NO_STYLE,
  // the following should not be cleared to ensure proper positioning
  // included as comments so we can see what we're not touching
  // noOptionsMessage: NO_STYLE,
  // menuPortal: _ => _,
  // placeholder: _ => _,
  // singleValue: _ => _,
  // valueContainer: _ => _,
}

export function Select(props: SelectProps): JSX.Element {
  return (
    <ReactSelect
      {...props}
      styles={CLEAR_STYLES}
      classNamePrefix={SELECT_CX_PREFIX}
      className={cx(styles.select, props.className)}
      components={{ DropdownIndicator, Menu }}
    />
  )
}

const DropdownIndicator = (props: SelectComponentProps): JSX.Element => (
  <reactSelectComponents.DropdownIndicator {...props}>
    <div
      className={cx(styles.dropdown_indicator, {
        [styles.flipped]: props.selectProps.menuIsOpen,
      })}
    >
      <Icon name="menu-down" className={cx(styles.dropdown_indicator_icon)} />
    </div>
  </reactSelectComponents.DropdownIndicator>
)

const Menu = (
  props: React.PropsWithChildren<SelectComponentProps>
): JSX.Element => (
  <reactSelectComponents.Menu {...props}>
    <div className={styles.menu}>{props.children}</div>
    <div className={styles.menu_control_bridge} />
  </reactSelectComponents.Menu>
)