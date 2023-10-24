export default defineAppConfig({
  docus: {
    title: 'cmd-bar',
    description: 'A Command Bar for Vue.js',
    image:
      'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
    socials: {
      github: 'fabkho/cmd-bar',
      vue: {
        label: 'Vue',
        icon: 'simple-icons:vuedotjs',
        href: 'https://vuejs.org'
      },
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com'
      }
    },
    github: {
      dir: '.starters/default/content',
      branch: 'main',
      repo: 'cmd-bar',
      owner: 'fabkho',
      edit: true
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },
    main: {
      padded: true,
      fluid: true
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true
    }
  }
})
