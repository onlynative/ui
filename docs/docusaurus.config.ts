import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import path from 'path'

const config: Config = {
  title: 'OnlyNative UI',
  tagline: 'Design-system agnostic components for React Native',
  url: 'https://onlynative.github.io',
  baseUrl: '/ui/',
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

  clientModules: ['./src/clientModules/defaultPackageManager.js'],

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
          href: 'https://onlynative.github.io/ui/demo/',
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
      copyright: `Copyright © ${new Date().getFullYear()} OnlyNative`,
    },
    prism: {
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
}

export default config
