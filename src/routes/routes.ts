export const routes = {
  // mainPage: {
  //   path: '/',
  //   breadcrumb: 'Home',
  // },
  mainPage: {
    path: '/',
  },
  console: {
    path: '/console'
  },
  vault: {
    path: '/vault/:address',
    breadcrumb: (props: any) => {
      return 'Vault: ' + props.match.params.vault
    },
  },
  stats: {
    path: '/stats',
  },
  tetuqi: {
    path: '/tetuqi',
  },
  tetubal: {
    path: '/tetubal',
  },
  tetumesh: {
    path: '/tetumesh',
  },
  // faq: {
  //   path: '/faq',
  //   breadcrumb: 'FAQ',
  // },
}
