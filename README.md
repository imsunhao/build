# @bestminr/build

## Vue Typescript SSR Express 自动化构建 like Nuxt

### api 文档 TODO

-  文档还没出
- 但是有类型 在@types 中

### 功能

- 自动化 开发-打包
- 开发项目 `service:dev`
- 打包项目 `service:build`
- 启动项目 `service:start`

### 命令参数 帮助 -h

- H: 'hostname' 主机地址
- p: 'port' 端口号
- h: 'help' 帮助
- d: 'dll' 打包对应 dll
- c: 'config-file' 配置文件路径
- v: 'version' 版本

### 技术栈

- vue 2.5
- vue-property-decorator
- vue-router
- vue-server-renderer
- vuex
- vuex-class
- vuex-router-sync
- webpack 4
- express 4
- babel 7

### 特性

#### 支持 SSR 使用webpack4 打包 css无法提取的问题

#### 支持 webpack dll

- dev 模式下 配置 dll 后, 如果 dll 未初始化 那么自动初始化 dll, 如果已经初始化 而且修改过 dll, 那么 需要手动 `service:dev -d` 来进行 dll 的更新
- build 模式下 一定会重新打包 dll

#### 支持 服务器端 express 开发

- 提供 中间件 扩展
- 提供 路由 扩展
- 支持热部署开发
- 支持静态配置
- 支持转发配置

##### 提供 中间件  扩展

##### 提供 路由  扩展
