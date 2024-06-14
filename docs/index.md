---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Nuxt Auth"
  tagline: Authentication made easy for Nuxt
  actions:
    - theme: brand
      text: Get Started
      link: /get-started/introduction
    - theme: alt
      text: Demo
      link: https://nuxt-starter.bg.tn

features:
  - title: Login with credentials
    icon: 🔑
    details: Supports login and registration with email and password.
  - title: Login with OAuth
    icon: 🌐
    details: Supports login via OAuth2 providers (Google, GitHub...).
  - title: Data layer agnostic
    icon: 💾
    details: Works with any data source (database, ORM, backend API).
  - title: Edge compatible
    icon: 🚀
    details: Runs on Edge workers (Cloudflare, Vercel Edge...).
  - title: Auto redirection
    icon: ↩️
    details: Built-in middleware to protect page routes with auto-redirection.
  - title: Extensible
    icon: 🔌
    details: Provides hooks to add custom logic and actions.
---

<style>
  .VPFeatures .item {
    width: calc(100%/3) !important;
  }
  @media only screen and (max-width: 768px) {
    .VPFeatures .item {
      width: 100% !important;
    }
  }
</style>
