import { I18nManager } from 'react-native'
import { selectRTL, transformOrigin } from '../rtl'

function withRTL(isRTL: boolean, fn: () => void) {
  const original = I18nManager.isRTL
  Object.defineProperty(I18nManager, 'isRTL', {
    configurable: true,
    get: () => isRTL,
  })
  try {
    fn()
  } finally {
    Object.defineProperty(I18nManager, 'isRTL', {
      configurable: true,
      get: () => original,
    })
  }
}

describe('selectRTL', () => {
  it('returns the ltr value when layout direction is LTR', () => {
    withRTL(false, () => {
      expect(selectRTL('ltr-value', 'rtl-value')).toBe('ltr-value')
    })
  })

  it('returns the rtl value when layout direction is RTL', () => {
    withRTL(true, () => {
      expect(selectRTL('ltr-value', 'rtl-value')).toBe('rtl-value')
    })
  })

  it('works with non-string values', () => {
    withRTL(false, () => {
      expect(selectRTL(1, 2)).toBe(1)
    })
    withRTL(true, () => {
      expect(selectRTL(1, 2)).toBe(2)
    })
  })

  it('works with object values', () => {
    const ltr = { icon: 'chevron-right' }
    const rtl = { icon: 'chevron-left' }
    withRTL(false, () => {
      expect(selectRTL(ltr, rtl)).toBe(ltr)
    })
    withRTL(true, () => {
      expect(selectRTL(ltr, rtl)).toBe(rtl)
    })
  })
})

describe('transformOrigin', () => {
  it('returns left-anchored origin in LTR', () => {
    withRTL(false, () => {
      expect(transformOrigin()).toBe('left top')
      expect(transformOrigin('top')).toBe('left top')
      expect(transformOrigin('center')).toBe('left center')
      expect(transformOrigin('bottom')).toBe('left bottom')
    })
  })

  it('returns right-anchored origin in RTL', () => {
    withRTL(true, () => {
      expect(transformOrigin()).toBe('right top')
      expect(transformOrigin('top')).toBe('right top')
      expect(transformOrigin('center')).toBe('right center')
      expect(transformOrigin('bottom')).toBe('right bottom')
    })
  })
})
