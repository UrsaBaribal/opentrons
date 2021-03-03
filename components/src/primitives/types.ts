// known style types

import type { StyledComponent } from 'styled-components'

export interface ColorProps {
  color?: string
  backgroundColor?: string
  opacity?: string | number
}

export interface TypographyProps {
  fontSize?: string | number
  fontWeight?: string | number
  fontStyle?: string
  lineHeight?: string | number
  textAlign?: string
  textTransform?: string
  textDecoration?: string
}

export interface SpacingProps {
  margin?: string | number
  marginX?: string | number
  marginY?: string | number
  marginTop?: string | number
  marginRight?: string | number
  marginBottom?: string | number
  marginLeft?: string | number
  padding?: string | number
  paddingX?: string | number
  paddingY?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
}

export interface BorderProps {
  border?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  borderRadius?: string | number
  borderWidth?: string | number
  borderColor?: string
}

export interface FlexboxProps {
  flex?: string | number
  alignItems?: string
  alignSelf?: string
  justifyContent?: string
  flexDirection?: string
  flexWrap?: string
}

export interface GridProps {
  gridGap?: string | number
  gridTemplateRows?: string
  gridTemplateColumns?: string
  gridRow?: string | number
  gridColumn?: string | number
}

export interface LayoutProps {
  display?: string
  size?: string | number
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  height?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  wordSpacing?: string | number
}

export interface PositionProps {
  position?: string
  zIndex?: string | number
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
}

export type StyleProps = ColorProps &
  TypographyProps &
  SpacingProps &
  BorderProps &
  FlexboxProps &
  GridProps &
  LayoutProps &
  PositionProps & {
    className?: string
  }

export type PrimitiveComponent<Instance> = StyledComponent<
  StyleProps,
  {},
  Instance
>