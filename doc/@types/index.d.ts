import { Store } from 'vuex'

declare namespace Doc {
  type DictOf<T> = { [key: string]: T }

  /**
   * vuex store
   *  * typescript namespace
   */
  namespace Tstore {
    /**
     * vuex 创建 工具函数
     * * typescript namespace
     */
    namespace createUtils {
      type ActionDescriptor = [any, any]

      /**
       * 用于声明 Actions Descriptors
       */
      type ActionsOfDescriptors<Context, Descriptor extends DictOf<ActionDescriptor>> = {
        [K in keyof Descriptor]: (ctx: Context, payload: Descriptor[K][0]) => Descriptor[K][1]
      }

      /**
       * 用于声明 Mutations
       */
      type ModuleMutations<State, PayloadTree> = {
        [K in keyof PayloadTree]: (state: State, payload: PayloadTree[K]) => any
      }
    }

    /**
     * vuex state
     */
    interface state {
      /**
       * 全局
       */
      global: {
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
      }

      /**
       * 编辑器
       */
      editor: {
        test: string
      }
    }

    /**
     * vuex Mutation-Payload-tree
     */
    interface MutationPayloads {
      /**
       * 全局
       */
      global: {
        SET_IS_MOBILE: boolean
        SET_HELLO: { hello: string }
        SET_testHotLoadingVuex: { number: number }
      }

      /**
       * 编辑器
       */
      editor: {
        SET_HELLO_EDITOR: string
        test: undefined
        test2?: string
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
