/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: 徐庆凯
 * @Date: 2022-11-18 18:37:32
 * @LastEditTime: 2023-03-10 13:05:03
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-read-pages-vite\src\index.ts
 * 记得注释
 */
import { Config, PlatformRule } from './interfaces/index'
const path = require('path')
const rootPath = path.resolve(process.cwd(), 'node_modules')
/** 解析绝对路径
 * @param {Object} dir
 */
function resolvePath(dir: string) {
  return path.resolve(rootPath, dir)
}

class TransformPages {
  public CONFIG: Config = {
    includes: ['meta', 'path', 'aliasPath', 'name']
  }
  public pagesPath: string
  public uniPagesJSON: any
  public routes: string[]
  public platform: PlatformRule
  /**
   * 构造函数
   * @param config 保留字段配置
   * @param pagesPath pages.json 文件相对与项目根目录的位置
   */
  constructor(config: Config, pagesPath: string) {
    config = {
      ...this.CONFIG,
      ...config
    }
    this.CONFIG = config
    this.pagesPath = path.resolve(process.cwd(), pagesPath)
    this.uniPagesJSON = require(resolvePath('@dcloudio/uni-cli-shared/dist/json/pages.js'))
    this.platform = process.env['UNI_PLATFORM'] as PlatformRule
    this.routes = this.getPagesRoutes().concat(this.getNotMpRoutes())
  }
  /**
   * 获取所有pages.json下的内容 返回json
   */
  get pagesJson() {
    return this.uniPagesJSON.parsePagesJson(this.pagesPath, this.platform)
  }
  /**
   * 通过读取pages.json文件 生成直接可用的routes
   */
  getPagesRoutes(pages = this.pagesJson.pages, rootPath: String | null = null) {
    const routes: any[] = []
    let route: { [x: string]: any }, value
    pages.forEach((pItem: any, pIndex: number) => {
      route = {}
      value = ''
      this.CONFIG.includes.forEach((cItem, cIndex) => {
        value = pItem[cItem]
        if (cItem === 'path') {
          value = rootPath ? `/${rootPath}/${value}` : `/${value}`
        }
        if (cItem === 'aliasPath' && pIndex == 0 && rootPath == null) {
          route[cItem] = route[cItem] || '/'
        } else {
          route[cItem] = value ? value : {}
        }
      })
      routes.push(route)
    })
    return routes
  }
  /**
   * 解析小程序分包路径
   */
  getNotMpRoutes() {
    const { subPackages } = this.pagesJson
    let routes: any[] = [],
      subPages,
      root,
      subRoutes
    if (subPackages == null || subPackages.length == 0) {
      return []
    }
    subPackages.forEach((item: any) => {
      subPages = item.pages
      root = item.root
      subRoutes = this.getPagesRoutes(subPages, root)
      routes = routes.concat(subRoutes)
    })
    return routes
  }
}

export default TransformPages
