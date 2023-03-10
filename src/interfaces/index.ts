/*
 * @Author: 徐庆凯
 * @Date: 2023-03-10 10:41:02
 * @LastEditTime: 2023-03-10 11:07:00
 * @LastEditors: 徐庆凯
 * @Description:
 * @FilePath: \uni-read-pages-vite\src\interfaces\index.ts
 * 记得注释
 */
export type Config = {
  includes: string[]
}

export type PlatformRule = 'h5' | 'app-plus' | 'app-lets' | 'mp-weixin' | 'mp-baidu' | 'mp-alipay' | 'mp-toutiao' | 'mp-qq' | 'mp-360'
