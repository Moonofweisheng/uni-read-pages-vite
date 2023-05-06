import { Config, PlatformRule } from './interfaces/index'
const path = require('path')

class TransformPages {
  private CONFIG: Config = {
    includes: ['meta', 'path', 'aliasPath', 'name']
  }
  // pages.json地址
  private pagesPath: string
  // Uni-app的pages.js导出的方法
  private uniPagesJSON: any
  // 路由表
  public routes: Record<string, any>[]
  // 平台
  private platform: PlatformRule

  /**
   * 构造函数
   * @param config 保留字段配置
   * @param pagesPath pages.json 文件相对与项目根目录的位置
   */
  constructor(pagesPath: string = './src', config?: Config) {
    if (config && config.includes) {
      this.CONFIG.includes = Array.from(new Set([...this.CONFIG.includes, ...config.includes]))
    }
    this.pagesPath = path.resolve(process.cwd(), pagesPath)
    this.uniPagesJSON = require('@dcloudio/uni-cli-shared/dist/json/pages.js')
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
  getPagesRoutes(pages = this.pagesJson.pages, rootPath: string | null = null) {
    const routes = []
    for (let i = 0; i < pages.length; i++) {
      const item = pages[i]
      const route: Record<string, any> = {}
      for (let j = 0; j < this.CONFIG.includes.length; j++) {
        const key = this.CONFIG.includes[j]
        let value = item[key]
        if (key === 'path') {
          value = rootPath ? `/${rootPath}/${value}` : `/${value}`
        }
        if (key === 'aliasPath' && i == 0 && rootPath == null) {
          route[key] = route[key] || '/'
        } else if (value !== undefined) {
          route[key] = value
        }
      }
      routes.push(route)
    }
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
