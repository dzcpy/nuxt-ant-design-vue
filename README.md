# @nuxtjs-extra/ant-design-vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> Nuxt module for Ant Design Vue

## Setup

1. Add dependencies to your project

```bash
yarn add @nuxtjs-extra/ant-design-vue @nuxt/components # or npm install @nuxtjs-extra/ant-design-vue
```

If you use useDayJs option, please also add `dayjs` to your project, or use `@nuxtjs/dayjs`

1. Add `@nuxtjs-extra/ant-design-vue` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    '@nuxtjs-extra/ant-design-vue',

    // With options
    [
      '@nuxtjs-extra/ant-design-vue',
      {
        style: 'css', // available options: 'css', 'less'
        useDayJs: false, // replace moment.js with day.js internally within 'ant-design-vue' for reducing package size
      },
    ],
  ]
}
```

Or using separate config:

```js
{
  antDesignVue: {
    style: 'css', // available options: 'css', 'less'
    useDayJs: false, // replace moment.js with day.js internally within 'ant-design-vue' for reducing package size
  }
}
```

## How to use

This module uses `@nuxtjs/components` internally. So there's no need to import any components in your `.vue` file. Just add an `A` prefix to any components and it will be automatically loaded:

```vue
<template>
  <AButton>Test</AButton>
</template>
<script></script>
```

Enjoy!

## License

[MIT License](./LICENSE)

Copyright (c) Anonymous <anonymous@test.com>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs-extra/ant-design-vue/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs-extra/ant-design-vue
[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs-extra/ant-design-vue.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs-extra/ant-design-vue
[license-src]: https://img.shields.io/npm/l/@nuxtjs-extra/ant-design-vue.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxtjs-extra/ant-design-vue

```

```
