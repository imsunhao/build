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
     * BuildService 通用 启动参数
     */
    interface parsedArgs extends minimist.ParsedArgs {
      /**
       * 配置文件名称
       */
      'config-file': string

      /**
       * 当前运行版本
       */
      version: string

      /**
       * 是否使用 webpack dll
       */
      dll: boolean
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
      statics?: statics
      proxyTable?: proxyTable
    }

    /**
     * 服务器 Rander 中间件 Request
     */
    interface Request extends expressRequest {
      /**
       * 当前 rander 设备上下文
       */
      renderContext: any
    }

    namespace getRender {
      interface opts {}
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
       * 当前 站点信息
       */
      siteInfo?: any

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
  }
}
