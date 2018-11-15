declare module 'types/build' {
  import serveStatic from 'serve-static'
  import proxy from 'http-proxy-middleware'
  import minimist from 'minimist'
  import { Configuration } from 'webpack'

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
      [key: string]: proxy.Config;
    }

    /**
     * nodeJS 静态文件配置
     */
    interface statics {
      [key: string]: ServeStaticOptions;
    }

    interface ServeStaticOptions extends serveStatic.ServeStaticOptions{
      path: string
    }

    /**
     * 初始化 服务器 参数集合
     */
    interface serverInitOptions {
      statics?: statics
      proxyTable?: proxyTable
    }
  }

  /**
   * build 配置
   */
  namespace ConfigOptions {

    type webpackMode = 'development' | 'production' | 'none'
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
       * HTML template 地址
       */
      template?: string
      sass?: sass
      webpack?: {
        mode?: webpackMode
        base?: Configuration
        client?: Configuration
        server?: Configuration
      }
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
