import { isArray, isString } from '@vue/shared'
import path from 'path'

import { Plugin } from 'vite'

interface PluginConfig {
  id: string
  name: string
  apply?: UniApp.PLATFORM | UniApp.PLATFORM[]
  config: {
    name: string
    main?: string
  }
}

export function initExtraPlugins(cliRoot: string, platform: UniApp.PLATFORM) {
  return initPlugins(resolvePlugins(cliRoot, platform))
}

function initPlugin(plugin: PluginConfig): Plugin | void {
  const configFile = path.join(
    plugin.id,
    plugin.config.main || '/lib/uni.plugin.js'
  )
  try {
    const plugin = require(configFile)
    return plugin.default || plugin
  } catch (e) {
    console.warn(`${configFile} not found`)
  }
}

function initPlugins(plugins: PluginConfig[]): Plugin[] {
  return plugins
    .map((plugin) => initPlugin(plugin))
    .flat()
    .filter<Plugin>(Boolean as any)
}

function resolvePlugins(cliRoot: string, platform: UniApp.PLATFORM) {
  const pkg = require(path.join(cliRoot, 'package.json'))
  return Object.keys(pkg.devDependencies || {})
    .concat(Object.keys(pkg.dependencies || {}))
    .map<PluginConfig | void>((id) => {
      try {
        const pluginPkg = require(id + '/package.json')
        const config = pluginPkg['uni-app'] as PluginConfig
        if (!config || !config.name) {
          return
        }
        const { apply } = config
        if (isArray(apply)) {
          if (!apply.includes(platform)) {
            return
          }
        } else if (isString(apply)) {
          if (apply !== platform) {
            return
          }
        }
        return {
          id,
          name: config.name,
          config,
        }
      } catch (e) {}
    })
    .filter<PluginConfig>(Boolean as any)
}