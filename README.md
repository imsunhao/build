# @bestminr/build

## Vue SSR Express 自动化构建 like Nuxt

### 功能

- 自动化 开发-打包
- 开发项目 `service:dev`
- 打包项目 `service:build`
- 启动项目 `service:start`

### 命令 -h

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
- vuex-router-sync
- webpack 4
- express 4
- babel 7

### 特性

#### 支持 webpack dll

- dev 模式下 配置 dll 后, 如果 dll 未初始化 那么自动初始化 dll, 如果已经初始化 而且修改过 dll, 那么 需要手动 `service:dev -d` 来进行 dll 的更新
- build 模式下 一定会重新打包 dll
