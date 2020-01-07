const { resolve } = require('path')

export default function (moduleOptions) {
  this.options.css.push({ src: 'ant-design-vue/dist/antd.less', lang: 'less' })
  this.options.build.loaders.less.javascriptEnabled = true

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    moduleOptions
  })
}

module.exports.meta = require('../package.json')
