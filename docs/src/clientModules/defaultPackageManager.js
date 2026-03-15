const TAB_KEY = 'docusaurus.tab.package-manager'

if (typeof window !== 'undefined' && !localStorage.getItem(TAB_KEY)) {
  localStorage.setItem(TAB_KEY, 'yarn')
}
