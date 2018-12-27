import {
  Response as expressResponse,
  Request as expressRequest,
  NextFunction,
  Express
} from 'express'
import serveStatic from 'serve-static'
import proxy from 'http-proxy-middleware'
import minimist from 'minimist'
import webpack, { Configuration } from 'webpack'
import { TransformOptions } from 'babel-core'
import MFS from 'memory-fs'

export = build

type DictOf<T> = { [key: string]: T }

declare namespace build {
  /**
   * build 服务
   */
  namespace BuildService {
    /**
     * BuildService extensions 插件
     */
    namespace extensions {
      /**
       * BuildService extensions 插件 opt 参数
       */
      interface options {
        /**
         * extensions 插件 是否不使用打包生成
         */
        noCompiler?: boolean
      }
    }
    /**
     * BuildService 通用 启动参数
     */
    interface parsedArgs extends minimist.ParsedArgs, parsedArgs.config, parsedArgs.serverStart {
      /**
       * 配置文件名称
       */
      'config-file'?: string

      /**
       * 当前运行版本
       */
      version: string

      /**
       * 是否显示 帮助
       */
      help: boolean

      /**
       * 是否使用 webpack dll 启动
       * * 仅仅打包dll
       */
      dll: boolean
    }

    namespace parsedArgs {
      /**
       * 配置文件 设置
       */
      interface config {
        /**
         * 项目 入口
         * * 默认值 ./build.config.ts
         */
        entry?: string

        /**
         * 项目 产出目录
         * * 默认值 ./dist/build
         */
        output?: string

        /**
         * 注入的上下文 配置文件目录
         */
        injectContext?: any
      }

      /**
       * 服务器启动 设置
       */
      interface serverStart {
        /**
         * 启动端口号
         */
        port?: number

        /**
         * 文件描述符
         */
        fileDescriptor?: string
      }
    }

    /**
     * BuildService 通用 启动参数 + build专用 启动参数
     */
    interface buildParsedArgs extends parsedArgs {}

    /**
     * BuildService 通用 启动参数 + dev专用 启动参数
     */
    interface devParsedArgs extends parsedArgs {}

    /**
     * nodeJS 转发列表
     */
    interface proxyTable {
      [key: string]: proxy.Config
    }

    /**
     * nodeJS 静态文件配置
     */
    interface statics {
      [key: string]: ServeStaticOptions
    }

    interface ServeStaticOptions extends serveStatic.ServeStaticOptions {
      path: string
    }

    /**
     * 初始化 服务器 参数集合
     */
    interface serverInitOptions {
      /**
       * 静态文件后缀
       */
      staticFileExts?: string[]

      /**
       * 静态文件转发目录
       */
      statics?: statics

      /**
       * 转发列表
       */
      proxyTable?: proxyTable

      /**
       * 注入环境变量
       */
      env?: string[]
    }

    /**
     * 服务器 Rander 中间件 Request
     */
    interface Request extends expressRequest {
      /**
       * 当前 注入的上下文
       */
      injectContext?: any

      /**
       * 当前 render Env环境 key
       */
      renderEnv?: string[]
    }

    namespace getRender {
      /**
       * 获取 render 配置参数
       */
      interface opts {
        /**
         * 注入的上下文
         */
        context: any

        /**
         * 发布文件地址 默认为本地
         */
        publicPath?: string
      }
      type renderFn = (
        req: BuildService.Request,
        res: expressResponse,
        next: NextFunction
      ) => void
      type updateType = 'bundle' | 'clientManifest' | 'template'
    }

    /**
     * compiler.webpack namespace
     */
    namespace compiler {
      /**
       * compiler 参数
       */
      type compilerOptions = prodCompilerOptions | devCompilerOptions

      /**
       * compiler 基础 参数
       */
      interface compilerBaseOptions {
        clientConfig: Configuration
        serverConfig: Configuration
        clientCompilerDone: any
        serverCompilerDone: any
      }

      /**
       * dev compiler 参数
       */
      interface devCompilerOptions extends compilerBaseOptions {
        clientCompilerDone: (
          { devMiddleware, stats }: { devMiddleware: any; stats: webpack.Stats }
        ) => void
        serverCompilerDone: (
          { err, stats, mfs }: { err: any; stats: webpack.Stats; mfs: MFS }
        ) => void
        app: Express
      }

      /**
       * prod compiler 参数
       */
      interface prodCompilerOptions extends compilerBaseOptions {
        clientCompilerDone: ({ stats }: { stats: webpack.Stats }) => void
        serverCompilerDone: ({ stats }: { stats: webpack.Stats }) => void
      }
    }
  }

  /**
   * build 配置
   */
  namespace ConfigOptions {
    type webpackMode = 'development' | 'production' | 'none'

    /**
     * getStyle 额外参数
     */
    interface getStyleOptions {
      isServer?: boolean
    }

    /**
     * 获取 依赖注入的参数
     */
    interface getOptionsInject {
      argv: BuildService.parsedArgs
      mode: ConfigOptions.webpackMode

      /**
       * 注入的上下文
       * * 用户自行配置
       * * 详情 参见 --injectContext
       */
      injectContext: any

      /**
       * 获取 正确的路径
       * @param path 相对root路径
       */
      resolve: (path?: string) => string
    }

    /**
     * build 通用 webpack 配置
     */
    interface options extends BuildService.serverInitOptions {
      /**
       * 当前运行版本
       */
      version?: string

      /**
       * 根目录 地址
       */
      rootDir?: string

      /**
       * 注入的上下文
       */
      injectContext?: any

      /**
       * render 配置
       */
      render?: options.render

      /**
       * sass 配置
       */
      sass?: options.sass

      /**
       * babele 配置
       */
      babelrc?: TransformOptions

      /**
       * webpack 配置
       */
      webpack?: options.webpack

      /**
       * 服务器端 插件 配置
       * * 中间件
       * * 路由
       */
      extensions?: options.extensions
    }
    namespace options {
      /**
       * render 配置
       */
      interface render {
        bundle?: string
        options: renderOptions
      }
      interface renderOptions {
        templatePath: string
        clientManifestPath?: string

        /**
         * 根路径
         */
        basedir: string
      }

      /**
       * webpack 配置
       */
      interface webpack {
        /**
         * webpack构建 dll配置
         */
        dll?: webpackDll
        mode?: webpackMode
        base?: Configuration
        client?: Configuration
        server?: Configuration
      }

      /**
       * server 插件 配置
       */
      interface extensions {
        /**
         * server 插件 覆盖 webpack构建
         */
        webpack?: Configuration

        /**
         * server 插件 入口文件
         */
        entry: DictOf<string>

        /**
         * server 插件 打包output路径
         */
        path: string
      }

      /**
       * webpack dll 配置
       */
      interface webpackDll {
        /**
         * dll配置 覆盖 webpack构建
         */
        webpack?: Configuration
        entry: DictOf<string[]>
        template: string
        templateOutput: string
        path: string
        publicPath: string
        define: DictOf<string>
      }

      /**
       * build 通用 webpack 配置 - sass 配置
       */
      interface sass {
        data?: string
        sourceMap?: boolean
      }

      /**
       * build initConfig 可选配置
       */
      interface initConfigOptions {
        /**
         * initConfig 获取配置后 是否 清空dist
         */
        clear?: boolean
      }
    }
  }

  namespace utils {
    /**
     * Express 路由 栈管理中心
     */
    class RouterStackManagement {
      /**
       * 热更新 中间件
       * @param middlewares 中间件
       */
      unpdate: (middlewares: any[]) => void
    }

    namespace Get {
      interface BaseGetOptions {
        strict?: boolean
        defaultValue?: any
      }
    }
  }
}
