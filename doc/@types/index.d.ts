import { Store } from 'vuex'
import { TMutations as GlobalMutations } from 'src/store/mutations'
import { TActions as GlobalActions } from 'src/store/actions'

/**
 * Doc 全局类型
 * * typescript namespace
 */
declare namespace Doc {

  type DictOf<T> = { [key: string]: T }

  /**
   * vuex store
   *  * typescript namespace
   */
  namespace Tstore {
    /**
     * vuex state
     */
    interface state {
      /**
       * 是否 使用 移动设备 访问
       * * 来自服务器端
       * * 这是一个例子
       */
      isMobile: boolean

      /**
       * 是否 使用 移动设备 访问
       * * 来自 中间件-服务器端
       * * 这是一个例子
       */
      hello: string

      /**
       * 测试 热加载 vuex
       * * 来自 客户端
       * * 这是一个例子
       */
      testHotLoadingVuex: number

      /**
       * 初始化 跳转访问 URL
       * * 来自服务器端
       * * 这是一个例子
       */
      initialReplaceStateUrl: string

      /**
       * 编辑器
       */
      editor?: {
        test: string
        deepTest: {
          test1: string
          test2: number
        }
      }

      /**
       * 单元测试使用
       */
      test?: {
        test: string
        deepTest: {
          test1: string
          test2: number
        }
      }
    }
    /**
     * vuex getters
     */
    interface getters {
      /**
       * 是否 使用 移动设备 访问
       * * 来自服务器端
       * * 这是一个例子
       */
      isMobile: boolean

      /**
       * 是否 使用 移动设备 访问
       * * 来自 中间件-服务器端
       * * 这是一个例子
       */
      hello: string

      /**
       * 测试 热加载 vuex
       * * 来自 客户端
       * * 这是一个例子
       */
      testHotLoadingVuex: number

      /**
       * 初始化 跳转访问 URL
       * * 来自服务器端
       * * 这是一个例子
       */
      initialReplaceStateUrl: string

      /**
       * 编辑器
       */
      editor?: {
        test: string
        deepTest: {
          test1: string
          test2: number
        }
      }

      /**
       * 单元测试使用
       */
      test?: {
        test: string
        deepTest: {
          test1: string
          test2: number
        }
      }
    }

    /**
     * vuex Mutation-tree
     */
    type Mutations = GlobalMutations & {
      /**
       * 编辑器
       */
      editor: GlobalMutations & {
        /**
         * 编辑器
         */
        editor2: GlobalMutations & {
          /**
           * 编辑器
           */
          editor3: GlobalMutations
        }
      }
    }

    /**
     * vuex Action-tree
     */
    type Actions = GlobalActions & {
      /**
       * 编辑器
       */
      editor: GlobalActions & {
        /**
         * 编辑器
         */
        editor2: GlobalActions & {
          /**
           * 编辑器
           */
          editor3: GlobalActions
        }
      }
    }
  }

  /**
   * vue router
   */
  namespace Trouter {
    /**
     * 客户端 获取服务端 异步数据
     */
    interface asyncData {
      store: Store<Tstore.state>
    }

    /**
     * 页面级别 中间件
     *  * 根据 server-middlewares path
     */
    namespace asyncData {
      /**
       * path
       *  * /
       */
      interface index extends asyncData {
        serverStore: {
          hello: string
        }
      }
    }
  }
}

export = Doc