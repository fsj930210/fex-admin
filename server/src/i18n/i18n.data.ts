export const i18nBundles = {
  'zh-CN': {
    common: {
      actions: { cancel: '取消', confirm: '确认', switchLanguage: '切换语言' },
      demo: { greeting: '你好，{{name}}', title: '国际化演示' },
    },
    admin: {
      filter: { placeholder: '请输入关键词' },
      status: { ready: '资源已就绪' },
    },
    order: {
      owner: '管理员',
      title: '订单管理',
      count_one: '{{count}} 个订单',
      count_other: '{{count}} 个订单',
    },
  },
  'en-US': {
    common: {
      actions: { cancel: 'Cancel', confirm: 'Confirm', switchLanguage: 'Switch language' },
      demo: { greeting: 'Hello, {{name}}', title: 'Internationalization demo' },
    },
    admin: {
      filter: { placeholder: 'Search by keyword' },
      status: { ready: 'Resources are ready' },
    },
    order: {
      title: 'Order management',
      count_one: '{{count}} order',
      count_other: '{{count}} orders',
    },
  },
  'fr-FR': {
    common: {
      actions: { cancel: 'Annuler', confirm: 'Confirmer', switchLanguage: 'Changer de langue' },
      demo: { greeting: 'Bonjour, {{name}}', title: 'Demonstration internationalisee' },
    },
    admin: {
      filter: { placeholder: 'Rechercher par mot-cle' },
      status: { ready: 'Les ressources sont pretes' },
    },
    order: {
      title: 'Gestion des commandes',
      count_one: '{{count}} commande',
      count_other: '{{count}} commandes',
    },
  },
} as const

export type SupportedI18nLocale = keyof typeof i18nBundles
