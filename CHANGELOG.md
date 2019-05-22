# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.6.16"></a>
## [1.6.16](https://github.com/imsunhao/build/compare/v1.6.14...v1.6.16) (2019-05-22)



<a name="1.6.14"></a>
## [1.6.14](https://github.com/imsunhao/build/compare/v1.6.13...v1.6.14) (2019-05-22)



<a name="1.6.13"></a>
## [1.6.13](https://github.com/imsunhao/build/compare/v1.6.12...v1.6.13) (2019-05-22)


### Bug Fixes

* 异常的 ForkTsCheckerWebpackPlugin ([adecaa3](https://github.com/imsunhao/build/commit/adecaa3))



<a name="1.6.12"></a>
## [1.6.12](https://github.com/imsunhao/build/compare/v1.6.11...v1.6.12) (2019-05-17)


### Features

* add isUseCSP 用来启动是否启动CSP ([437b73c](https://github.com/imsunhao/build/commit/437b73c))
* upgrade fork-ts-checker-webpack-plugin ([a6871b4](https://github.com/imsunhao/build/commit/a6871b4))
* 调整 tsconfig 结构 ([9c09a37](https://github.com/imsunhao/build/commit/9c09a37))



<a name="1.6.11"></a>
## [1.6.11](https://github.com/imsunhao/build/compare/v1.6.10...v1.6.11) (2019-03-20)


### Features

* 在 env中 提供 nonce 支持 ([701a37b](https://github.com/imsunhao/build/commit/701a37b))



<a name="1.6.10"></a>
## [1.6.10](https://github.com/imsunhao/build/compare/v1.6.9...v1.6.10) (2019-03-19)


### Features

* 完善 getRender中 renderToString 的 injectContext ([d3435e6](https://github.com/imsunhao/build/commit/d3435e6))



<a name="1.6.9"></a>
## [1.6.9](https://github.com/imsunhao/build/compare/v1.6.8...v1.6.9) (2019-03-18)


### Bug Fixes

* 打包出错时 为了保证工具链完整 需要 出错code为1 ([775dbfc](https://github.com/imsunhao/build/commit/775dbfc))


### Features

* add server nodeExternalsWhitelist ([3505775](https://github.com/imsunhao/build/commit/3505775))



<a name="1.6.8"></a>
## [1.6.8](https://github.com/imsunhao/build/compare/v1.6.7...v1.6.8) (2019-03-12)


### Features

* 打包出错返回出错code为1 ([071ebc3](https://github.com/imsunhao/build/commit/071ebc3))



<a name="1.6.7"></a>
## [1.6.7](https://github.com/imsunhao/build/compare/v1.6.6...v1.6.7) (2019-02-14)



<a name="1.6.6"></a>
## [1.6.6](https://github.com/imsunhao/build/compare/v1.6.5...v1.6.6) (2019-02-13)


### Features

* add nonce for CSP ([99fd56b](https://github.com/imsunhao/build/commit/99fd56b))



<a name="1.6.5"></a>
## [1.6.5](https://github.com/imsunhao/build/compare/v1.6.4...v1.6.5) (2019-01-16)


### Bug Fixes

* 修复 devCompilerExtensions 报错需要提示错误信息 ([bd28ef1](https://github.com/imsunhao/build/commit/bd28ef1))


### Features

* DLL 更新 dev模式下不应该重启 ([d35db44](https://github.com/imsunhao/build/commit/d35db44))
* 发生端口冲突 应该重试端口号而不是直接关闭 ([f6495a7](https://github.com/imsunhao/build/commit/f6495a7))



<a name="1.6.4"></a>
## [1.6.4](https://github.com/imsunhao/build/compare/v1.6.3...v1.6.4) (2019-01-02)


### Features

* 线上版本号应该以线上为准，而不是部署时 ([7e514f3](https://github.com/imsunhao/build/commit/7e514f3))



<a name="1.6.3"></a>
## [1.6.3](https://github.com/imsunhao/build/compare/v1.6.2...v1.6.3) (2018-12-27)


### Features

* 支持 ts导入 json ([17262f3](https://github.com/imsunhao/build/commit/17262f3))
* 添加 defaultEnv PACKAGE_VERSION  值为 build 通用 webpack 配置中设置的值 ([c31f863](https://github.com/imsunhao/build/commit/c31f863))
* 添加 get utils ([bc146aa](https://github.com/imsunhao/build/commit/bc146aa))
* 自动解析 RouterExtensionPath 默认为 private ([2461e89](https://github.com/imsunhao/build/commit/2461e89))



<a name="1.6.2"></a>
## [1.6.2](https://github.com/imsunhao/build/compare/v1.6.1...v1.6.2) (2018-12-15)


### Bug Fixes

* 修复 clientManifestAddDll 如果找不到正确的path 需要扔出错误原因 ([6936f23](https://github.com/imsunhao/build/commit/6936f23))


### Features

* 当存在有多个相同的配置项key的时候 value已最后一个为最终结果 ([7666792](https://github.com/imsunhao/build/commit/7666792))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/imsunhao/build/compare/v1.5.9...v1.6.1) (2018-12-14)


### Features

* 支持注入 injectContext ([b948f7e](https://github.com/imsunhao/build/commit/b948f7e))



<a name="1.5.9"></a>
## [1.5.9](https://github.com/imsunhao/build/compare/v1.5.8...v1.5.9) (2018-12-11)



<a name="1.5.8"></a>
## [1.5.8](https://github.com/imsunhao/build/compare/v1.5.7...v1.5.8) (2018-12-10)



<a name="1.5.7"></a>
## [1.5.7](https://github.com/imsunhao/build/compare/v1.5.5...v1.5.7) (2018-12-05)


### Features

* add Webpackbar ([705ac73](https://github.com/imsunhao/build/commit/705ac73))



<a name="1.5.5"></a>
## 1.5.5 (2018-12-04)


### Bug Fixes

* 修复 404 页面跳转的问题 ([4015bdd](https://github.com/imsunhao/build/commit/4015bdd))



<a name="1.5.3"></a>
## 1.5.3 (2018-12-03)


### Features

* production 模式下避免 ForkTsCheckerWebpackPlugin 的启动 ([eb3ffae](https://github.com/imsunhao/build/commit/eb3ffae))



<a name="1.5.0"></a>
# 1.5.0 (2018-11-28)



<a name="1.3.5"></a>
## 1.3.5 (2018-11-23)



<a name="1.2.0"></a>
# 1.2.0 (2018-11-20)



<a name="1.1.0"></a>
# 1.1.0 (2018-11-19)



<a name="1.5.2"></a>
## 1.5.2 (2018-12-03)


### Features

* production 模式下避免 ForkTsCheckerWebpackPlugin 的启动 ([eb3ffae](https://github.com/imsunhao/build/commit/eb3ffae))



<a name="1.2.0"></a>
# 1.2.0 (2018-11-20)



<a name="1.1.0"></a>
# 1.1.0 (2018-11-19)
