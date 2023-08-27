export default defineAppConfig({
  docus: {
    title: "Nuxt Auth",
    description:
      "A fairly complete solution to handle authentication for your Nuxt 3 project",
    image:
      "https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png",
    socials: {
      //  twitter: "nuxt_js",
      github: "becem-gharbi/nuxt-auth",
      // nuxt: {
      //   label: "Nuxt",
      //   icon: "simple-icons:nuxtdotjs",
      //   href: "https://nuxt.com",
      // },
    },
    // github: {
    //   dir: "becem-gharbi/nuxt-auth",
    //   branch: "main",
    //   repo: "docus",
    //   owner: "nuxt-themes",
    //   edit: true,
    // },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  },
});
