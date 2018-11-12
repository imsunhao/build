declare module 'types/build' {
  import minimist from 'minimist'
  import { Configuration } from 'webpack'
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
   * ConfigOptions 通用配置参数
   */
  namespace ConfigOptions {
    interface options {
      sass?: sass
      webpack?: {
        base?: Configuration
        client?: Configuration
        server?: Configuration
      }
    }
    interface sass {
      data?: string
      sourceMap?: boolean
    }
  }
}
