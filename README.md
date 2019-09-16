# @bestminr/build

## Vue Typescript SSR Express 自动化构建 like Nuxt

### TODO LIST

- opt: 整理 stats
- feat: _doc_ 整理出一个欢迎界面

### api 文档 TODO

- 文档还没出 正在做了 现在做了一个 doc 例子
- 但是有类型 在@types 中

### 功能

- 自动化 开发-打包
- 开发项目 `service:dev`
- 打包项目 `service:build`
- 启动项目 `service:start`
- storybook webpack扩展支持 `build-storybook`

### 命令参数 帮助 -h

- H: 'hostname' 主机地址
- p: 'port' 端口号
- h: 'help' 帮助
- c: 'config-file' build配置文件路径
- v: 'version' 版本
- cl: 'clear' 清空config缓存
- d: 'dll' 清空dll缓存
- ic: 'injectContext' 依赖注入文件地址

### 技术栈

- vue 2.6
- vue-property-decorator
- vue-router
- vue-server-renderer
- vuex
- vuex-class
- vuex-router-sync
- webpack 4
- express 4
- babel 7
- storybook 5

### 特性

#### 内置支持 storybook

- 方便开发组件

#### 支持 SSR 使用 webpack4 打包 css 无法提取的问题

#### 支持 注入 Env

- 为了方便打包一遍, 多种环境公用一套代码. 比如: stage 环境 release 环境 线上环境
- 代码仅仅与 node 环境一致, 而不是 webpack 打包时决定

#### 支持 webpack dll

- dev 模式下 配置 dll 后, 如果 dll 未初始化 那么自动初始化 dll, 如果已经初始化 而且修改过 dll, 那么 需要手动 `service:dev -d` 来进行 dll 的更新
- build 模式下 一定会重新打包 dll

#### 支持 服务器端 express 开发

- 提供 中间件 扩展
- 提供 路由 扩展
- 支持热部署开发
- 支持静态配置
- 支持转发配置

##### 提供 中间件 扩展

##### 提供 路由 扩展

### 程序设计思想

#### 配置优先级

- 命令行 (最高)
- 注入的配置 (修改需要重启)
- 静态配置
