import React from 'react'
import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>ReactUse</span>,
  project: {
    link: 'https://github.com/reactuse/reactuse',
  },
  chat: {
    link: 'https://discord.gg/reactuse',
  },
  docsRepositoryBase: 'https://github.com/reactuse/reactuse/tree/main/docs',
  footer: {
    component: <p>ReactUse - Essential React Hooks for React 19+</p>,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    backToTop: true
  },
  search: {
    placeholder: 'Search documentation...'
  }
}

export default config