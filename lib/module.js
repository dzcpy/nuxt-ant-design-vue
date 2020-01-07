const { resolve } = require('path')

module.exports = async function (moduleOptions) {
  const options = {
    ...this.options['nuxt-ant-design-vue'],
    ...moduleOptions
  }

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-ant-design-vue.js',
    options
  })
}

module.exports.meta = require('../package.json')
