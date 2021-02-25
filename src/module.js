const { join } = require('path')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

export default function (moduleOptions) {
  const { nuxt, options } = this
  const antDesignVueConfig = options.antDesignVue || {}
  const style = moduleOptions.style || antDesignVueConfig.style || 'css'
  const useDayJs =
    moduleOptions.useDayJs || antDesignVueConfig.useDayJs || false
  if (style === 'less') {
    options.build.loaders.less.javascriptEnabled = true
  }
  if (useDayJs || options.dayjs) {
    options.build.plugins.push(new AntdDayjsWebpackPlugin({ preset: 'antdv3' }))
  }

  nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: join(__dirname, 'components', style),
      prefix: 'a',
    })
  })
}

module.exports.meta = require('../package.json')
