import * as React from 'react'

/** Sizing/coloring information passed to icon resolvers and render functions. */
export interface IconRenderProps {
  size: number
  /**
   * Resolved icon color. May be `undefined` when the component inherits
   * color from a parent text style — handle that case by deferring to the
   * icon library's own default.
   */
  color?: string
}

/**
 * Maps a string icon name to a rendered icon node. Configured at the
 * provider level so consumers can plug in SF Symbols, Lucide, custom SVGs,
 * etc. without forking components.
 */
export type IconResolver = (
  name: string,
  props: IconRenderProps,
) => React.ReactNode

export const IconResolverContext = React.createContext<IconResolver | null>(
  null,
)
