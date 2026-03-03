import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docs: [
    { type: 'doc', id: 'index', label: 'Introduction' },
    { type: 'doc', id: 'installation', label: 'Installation' },
    { type: 'doc', id: 'theming', label: 'Theming' },
    {
      type: 'category',
      label: 'Layout',
      collapsed: false,
      items: [
        'components/box',
        'components/row',
        'components/column',
        'components/grid',
        'components/layout',
      ],
    },
    {
      type: 'category',
      label: 'Inputs',
      collapsed: false,
      items: [
        'components/button',
        'components/checkbox',
        'components/chip',
        'components/icon-button',
        'components/radio',
        'components/switch',
        'components/text-field',
      ],
    },
    {
      type: 'category',
      label: 'Data Display',
      collapsed: false,
      items: ['components/card', 'components/list', 'components/typography'],
    },
    {
      type: 'category',
      label: 'Surfaces',
      collapsed: false,
      items: ['components/appbar'],
    },
  ],
}

export default sidebars
