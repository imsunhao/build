import {
  Response as expressResponse,
  Request as expressRequest,
  NextFunction
} from 'express'
import serveStatic from 'serve-static'
import proxy from 'http-proxy-middleware'
import minimist from 'minimist'
import { Configuration } from 'webpack'

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
     * render 配置
     */
    interface render {
      bundle: string
      options: renderOptions
    }
    interface renderOptions {
      templatePath: string
      clientManifestPath: string

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
      render?: render

      /**
       * sass 配置
       */
      sass?: sass

      /**
       * babele 配置
       */
      babelrc?: any

      /**
       * webpack 配置
       */
      webpack?: webpack
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
