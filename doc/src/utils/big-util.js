export default `
    <template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
  },
]

export default {
  name: 'Editor',
  props: {},
  asyncData({ store }) {
    console.log('已经接受到请求,正在等待数据请求中...请等待1s...')
    /**
     * 切记 别忘了 return 否则是不会等待请求完的!
     */
    return registerModules(VUEX_NS_LIST, { store })
  },
  setup(props, context) {
    const store = hostGlobal.store
    const version = computed(() => getState(store, 'test'))

    onMounted(() => {
      console.log('init vuex-editor模块')
    })

    return {
      version,
    }
  },
}
</script><template>
<div>
  <h1>访问这个页面的时候 vuex-editor模块 才被加载</h1>
  <h1>vuex-editor state.editor.test = {{ version }}</h1>
  <router-link :to="{ name: 'home' }"> 跳转到 home页面 </router-link>
</div>
</template>

<script lang="ts">
import { value, computed, watch, onMounted } from 'vue-function-api'

import { Trouter } from '@types'

import { isServer, hostGlobal } from 'src/envs'

import editorModule, { VUEX_NS, dispatch, getState } from 'src/store/editor'
import { registerModules } from '@bestminr/vuex-utils'

const VUEX_NS_LIST = [
  {
    namespace: VUEX_NS,
    module: editorModule,
    callback({ store }) {
      console.log('开始注册vuex模块')
      return Promise.all([
        dispatch(store, 'TEST_ACTION', { id: 1, version: 'hello' })
      ])
    }
    `