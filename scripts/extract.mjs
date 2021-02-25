import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, sep } from 'path'
import { fileURLToPath } from 'url'
import { find } from 'find-in-files'
import pMap from 'p-map'
import * as antd from 'ant-design-vue'
import kebabCase from 'lodash/kebabCase.js'
import get from 'lodash/get.js'
import escapeRegExp from 'lodash/escapeRegExp.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  mkdirSync(join(__dirname, '../src/components/css'), { recursive: true })
  mkdirSync(join(__dirname, '../src/components/less'), { recursive: true })
} catch {}

const moduleDir = join(__dirname, '../node_modules')

const files = await find(
  '\\.install',
  moduleDir + '/ant-design-vue/es',
  'jsx?$|vue$'
)

const getImportList = (file, extension) => {
  const files = new Set()
  const content = readFileSync(join(moduleDir, file), { encoding: 'utf-8' })
  const regex = /(?<=import\s*?').*?(?=')/g
  let match
  while ((match = regex.exec(content))) {
    const importedFile = join(dirname(file), match[0]).replace(
      new RegExp(escapeRegExp(sep), 'g'),
      '/'
    )
    if (RegExp(`\\.${extension}$`).test(importedFile)) {
      files.add(importedFile)
    } else {
      let realFile
      switch (true) {
        case existsSync(join(moduleDir, importedFile + '.js')): {
          const importedFilesArray = getImportList(
            importedFile + '.js',
            extension
          )
          importedFilesArray.forEach((item) => files.add(item))
          files.add(importedFile + '.' + extension)
          break
        }
        case existsSync(join(moduleDir, importedFile + '.' + extension)):
          files.add(importedFile + '.' + extension)
          break
        case existsSync(join(moduleDir, importedFile + '/index.js')): {
          const importedFilesArray = getImportList(
            importedFile + '/index.js',
            extension
          )
          importedFilesArray.forEach((item) => files.add(item))
          break
        }
        default:
          throw new Error('unsupported import: ' + importedFile)
      }
    }
  }
  return Array.from(files.values())
}

const writeComponent = ({
  importName,
  exportName,
  componentName,
  styleDir,
}) => {
  if (!importName) {
    throw new Error('importName is empty')
  }
  if (!antd[importName]) {
    throw new Error('importName does not exist: ' + importName)
  }
  if (typeof antd[importName].install !== 'function') {
    throw new Error('installl method does not exist: ' + importName)
  }
  if (!exportName) {
    throw new Error('exportName is empty')
  }
  if (!get(antd, exportName)) {
    throw new Error('exportName does not exist: ' + exportName)
  }
  if (!componentName) {
    throw new Error('componentName is empty')
  }
  if (!styleDir) {
    throw new Error('styleDir is empty')
  }
  if (
    !existsSync(
      `${moduleDir}/ant-design-vue/lib/${styleDir}/style/css.js` ||
        !existsSync(
          `${moduleDir}/ant-design-vue/lib/${styleDir}/style/index.js`
        )
    )
  ) {
    throw new Error('style files in styleDir do not exist: ' + styleDir)
  }
  const lessStyles = getImportList(
    `ant-design-vue/es/${styleDir}/style/index.js`,
    'less'
  )
    .map((file) => `<style lang="less" src="${file}"></style>`)
    .join('\n')
  const cssStyles = getImportList(
    `ant-design-vue/es/${styleDir}/style/css.js`,
    'css'
  )
    .map((file) => `<style src="${file}"></style>`)
    .join('\n')
  writeFileSync(
    join(__dirname, '../src/components/css/') + componentName + '.vue',
    `<script>\nimport Vue from 'vue'\nimport { ${importName} } from 'ant-design-vue'\n\n${importName}.install(Vue)\n\nexport default ${exportName}\n</script>\n${cssStyles}\n`,
    { encoding: 'utf-8' }
  )
  writeFileSync(
    join(__dirname, '../src/components/less/') + componentName + '.vue',
    `<script>\nimport Vue from 'vue'\nimport { ${importName} } from 'ant-design-vue'\n\n${importName}.install(Vue)\n\nexport default ${exportName}\n</script>\n${lessStyles}\n`,
    { encoding: 'utf-8' }
  )
}

pMap(Object.keys(files), async (file) => {
  const content = readFileSync(file, { encoding: 'utf-8' })
  const install = (content.match(/\.install.*?\{\r?\n(.*?)\}/s) || ['', ''])[1]
    .trim()
    .replace(/^Vue\.use\(Base\);.*?\r?\n/g, '')
  const lines = install
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  await pMap(lines, async (line) => {
    if (/Vue\.component\(/.test(line)) {
      const component = line.match(/, ?(.*?)\);/)[1]
      let componentName
      let styleDir
      let importName
      let exportName
      if (/\./.test(component)) {
        switch (component) {
          case 'TreeSelect.TreeNode':
            importName = 'TreeSelect'
            exportName = component
            componentName = 'TreeSelectNode'
            styleDir = 'tree-select'
            break
          case 'Tree.TreeNode':
            importName = 'Tree'
            exportName = component
            componentName = 'TreeNode'
            styleDir = 'tree'
            break
          case 'Tag.CheckableTag':
            importName = 'Tag'
            exportName = component
            componentName = 'CheckableTag'
            styleDir = 'tag'
            break
          case 'Tabs.TabPane':
            importName = 'Tabs'
            exportName = component
            componentName = 'TabPane'
            styleDir = 'tabs'
            break
          case 'Tabs.TabContent':
            importName = 'Tabs'
            exportName = component
            componentName = 'TabContent'
            styleDir = 'tabs'
            break
          case 'Steps.Step':
            importName = 'Steps'
            exportName = component
            componentName = 'Step'
            styleDir = 'steps'
            break
          case 'Menu.SubMenu':
            importName = 'Menu'
            exportName = component
            componentName = 'SubMenu'
            styleDir = 'menu'
            break
          case 'Form.Item':
            if (/form-model/.test(file)) {
              importName = 'FormModel'
              exportName = 'FormModel.Item'
              componentName = 'FormModelItem'
              styleDir = 'form-model'
            } else {
              importName = 'Form'
              exportName = component
              componentName = 'FormItem'
              styleDir = 'form'
            }
            break
          case 'DatePicker.RangePicker':
            importName = 'DatePicker'
            exportName = component
            componentName = 'RangePicker'
            styleDir = 'date-picker'
            break
          case 'DatePicker.MonthPicker':
            importName = 'DatePicker'
            exportName = component
            componentName = 'MonthPicker'
            styleDir = 'date-picker'
            break
          case 'DatePicker.WeekPicker':
            importName = 'DatePicker'
            exportName = component
            componentName = 'WeekPicker'
            styleDir = 'date-picker'
            break
          default:
            importName = component.replace(/\..*$/, '')
            exportName = component
            componentName = component.replace(/\./g, '')
            styleDir = kebabCase(importName)
        }
        writeComponent({ importName, exportName, componentName, styleDir })
      } else {
        styleDir = kebabCase(component)
        componentName = component
        if (
          existsSync(
            `${moduleDir}/ant-design-vue/lib/${styleDir}/style/css.js`
          ) &&
          existsSync(
            `${moduleDir}/ant-design-vue/lib/${styleDir}/style/index.js`
          ) &&
          antd[componentName]
        ) {
          importName = componentName
          exportName = componentName
          writeComponent({ importName, exportName, componentName, styleDir })
        } else {
          styleDir = undefined
          switch (component) {
            case 'Dragger':
              importName = 'Upload'
              exportName = 'Upload.Dragger'
              componentName = 'UploadDragger'
              styleDir = 'upload'
              break
            case 'DirectoryTree':
              importName = 'Tree'
              exportName = 'Tree.DirectoryTree'
              componentName = 'DirectoryTree'
              styleDir = 'tree'
              break
            case 'ToolTip':
              importName = 'Tooltip'
              exportName = 'Tooltip'
              componentName = 'Tooltip'
              styleDir = 'tooltip'
              break
            case 'TimelineItem':
              importName = 'Timeline'
              exportName = 'Timeline.Item'
              componentName = 'TimelineItem'
              styleDir = 'timeline'
              break
            case 'Row':
              importName = 'Row'
              exportName = 'Row'
              componentName = 'Row'
              styleDir = 'grid'
              break
            case 'DropdownButton':
              importName = 'Dropdown'
              exportName = 'Dropdown.Button'
              componentName = 'DropdownButton'
              styleDir = 'dropdown'
              break
            case 'CollapsePanel':
              importName = 'Collapse'
              exportName = 'Collapse.Panel'
              componentName = 'CollapsePanel'
              styleDir = 'collapse'
              break
            case 'CheckboxGroup':
              importName = 'Checkbox'
              exportName = 'Checkbox.Group'
              componentName = 'CheckboxGroup'
              styleDir = 'checkbox'
              break
            case 'Meta':
              importName = 'Card'
              exportName = 'Card.Meta'
              componentName = 'CardMeta'
              styleDir = 'card'
              break
            case 'Grid':
              importName = 'Card'
              exportName = 'Card.Grid'
              componentName = 'CardGrid'
              styleDir = 'card'
              break
            case 'ButtonGroup':
              importName = 'Button'
              exportName = 'Button.Group'
              componentName = 'ButtonGroup'
              styleDir = 'button'
              break
            case 'BreadcrumbItem':
              importName = 'Breadcrumb'
              exportName = 'Breadcrumb.Item'
              componentName = 'BreadcrumbItem'
              styleDir = 'breadcrumb'
              break
            case 'BreadcrumbSeparator':
              importName = 'Breadcrumb'
              exportName = 'Breadcrumb.Separator'
              componentName = 'BreadcrumbSeparator'
              styleDir = 'breadcrumb'
              break
            default:
              console.error('style not found for component:', component, file)
              return
          }
          if (antd[importName]) {
            writeComponent({ importName, exportName, componentName, styleDir })
          } else {
            console.error(
              'component does not exist in ant-design-vue:',
              componentName,
              file
            )
          }
        }
      }
    } else {
      console.warn('special line: ', line)
    }
  })
})
