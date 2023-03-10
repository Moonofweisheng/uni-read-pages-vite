# uni-read-pages-vite

基于 [uni-read-pages](https://github.com/SilurianYang/uni-read-pages) 开发，仅支持使用vite创建的uni-app项目，用于读取`pages.json`中的配置。

## 安装

您可以使用 `Yarn` 或 `npm` 安装该软件包（选择一个）：

##### Yarn

```sh
yarn add uni-read-pages-vite
```
##### npm

```sh
npm install uni-read-pages-vite
```
## 开始
配置 `vite.config.js` 通过 `defin` 注入全局变量 [查看文档](https://cn.vitejs.dev/config/shared-options.html#define)

#### 配置 `vite.config.js`
```js
//vite.config.js
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import TransformPages from 'uni-read-pages-vite'
const transformPages = new TransformPages()

export default defineConfig({
  plugins: [uni()],
  define: {
    ROUTES: transformPages.routes,
  }
});

