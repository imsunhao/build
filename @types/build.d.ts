declare module 'types/build' {
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
    }

    /**
     * BuildService 通用 启动参数 + build专用 启动参数
     */
    interface buildParsedArgs extends parsedArgs {}

    /**
     * BuildService 通用 启动参数 + dev专用 启动参数
     */
    interface devParsedArgs extends parsedArgs {}
  }

  /**
   * build 配置
   */
  namespace ConfigOptions {
    /**
     * build 通用 webpack 配置
     */
    interface options {
      sass?: sass
      webpack?: {
        mode?: 'development' | 'production' | 'none'
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
