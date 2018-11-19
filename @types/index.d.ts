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
        mode?: webpackMode
        base?: Configuration
        client?: Configuration
        server?: Configuration
      }

      /**
       * build 通用 webpack 配置 - sass 配置
       */
      interface sass {
        data?: string
        sourceMap?: boolean
      }
    }
  }
}
