import { StyleSheet } from 'react-native'
import { defaultTopAppBarTokens } from '@onlynative/core'
import type { MaterialTheme } from '@onlynative/core'

export function createStyles(theme: MaterialTheme) {
  const topAppBar = theme.topAppBar ?? defaultTopAppBarTokens

  return StyleSheet.create({
    root: {
      backgroundColor: theme.colors.surface,
    },
    safeArea: {
      backgroundColor: theme.colors.surface,
    },
    elevatedRoot: {
      backgroundColor: theme.colors.surfaceContainer,
    },
    elevatedSafeArea: {
      backgroundColor: theme.colors.surfaceContainer,
    },
    smallContainer: {
      height: topAppBar.smallContainerHeight,
      position: 'relative',
    },
    mediumContainer: {
      height: topAppBar.mediumContainerHeight,
    },
    largeContainer: {
      height: topAppBar.largeContainerHeight,
    },
    expandedContainer: {
      position: 'relative',
    },
    topRow: {
      height: topAppBar.topRowHeight,
      paddingHorizontal: topAppBar.horizontalPadding,
      flexDirection: 'row',
      alignItems: 'center',
    },
    expandedTitleContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      minWidth: 0,
      paddingEnd: theme.spacing.md,
      pointerEvents: 'none',
    },
    topRowSpacer: {
      flex: 1,
    },
    sideSlot: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: topAppBar.sideSlotMinHeight,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconFrame: {
      width: topAppBar.iconFrameSize,
      height: topAppBar.iconFrameSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayTitleContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      minWidth: 0,
      pointerEvents: 'none',
    },
    centeredTitle: {
      textAlign: 'center',
    },
    startAlignedTitle: {
      textAlign: 'auto',
    },
    mediumTitlePadding: {
      paddingBottom: topAppBar.mediumTitleBottomPadding,
    },
    largeTitlePadding: {
      paddingBottom: topAppBar.largeTitleBottomPadding,
    },
    title: {
      flexShrink: 1,
      maxWidth: '100%',
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
  })
}
