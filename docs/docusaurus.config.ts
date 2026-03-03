import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import path from 'path'

const config: Config = {
  title: 'OnlyNative UI',
  tagline: 'Material Design 3 components for React Native',
  url: 'https://onlynative.github.io',
  baseUrl: '/ui/docs/',
  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/favicon.ico',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-react-docgen-typescript',
      {
        src: [
          path.resolve(__dirname, '../packages/components/src/**/*.{ts,tsx}'),
          path.resolve(__dirname, '../packages/core/src/**/*.{ts,tsx}'),
        ],
        global: true,
        parserOptions: {
          shouldExtractLiteralValuesFromEnum: true,
          shouldRemoveUndefinedFromOptional: true,
          propFilter: (prop: { parent?: { fileName: string } }) => {
            if (prop.parent) {
              return !prop.parent.fileName.includes('node_modules')
            }
            return true
          },
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'OnlyNative UI',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://onlynative.github.io/ui/',
          label: 'Demo',
          position: 'right',
        },
        {
          href: 'https://github.com/onlynative/ui',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'Components', to: '/components/button' },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Demo App',
              href: 'https://onlynative.github.io/ui/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/onlynative/ui',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OnlyNative. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config