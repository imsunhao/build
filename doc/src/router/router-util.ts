import Vue, { VueConstructor } from 'vue'
import { Location } from 'vue-router'

type VueCtor = VueConstructor<any>

export function getHookFromComponent(compo: any, name: string) {
  return compo[name] || (compo.$options && compo.$options[name]) || (compo.options && compo.options[name]) || (compo.constructor && compo.constructor[name]) || (compo.super && compo.super[name])
}

export function callComponentsHookWith(compoList: VueCtor[], hookName: string, context: any) {
  return compoList.map((component, index) => {
    const hook = getHookFromComponent(component, hookName)
    if (hook) {
      return hook(context, index)
    }
  }).filter(_ => _)
}

type VueVmFirstFunction<T> = (this: any, vm: Vue, ...args: any[]) => T

type VueMethodCompatibleFn<T> = ((this: Vue, ...args: any[]) => T | void) & (VueVmFirstFunction<T | void>)

export function makeVueMethodCompatibleFn<T>(fn: VueVmFirstFunction<T>): VueMethodCompatibleFn<T> {
  const wrappedFn = function(this: any, maybeVm: any, ...args: any[]) {
    const finalArgs = args.slice()
    finalArgs.unshift(maybeVm)
    if (this instanceof Vue) {
      finalArgs.unshift(this)
    } else if (maybeVm && maybeVm instanceof Vue) {
      // 什么都不做
    } else {
      console.error('参数或 context 不正确')
      return
    }

    return fn.apply(null, finalArgs)
  }
  return wrappedFn
}

export const addRouteCallback = makeVueMethodCompatibleFn<Location>((vm, options: Location) => {
  const route = vm.$route
  if (!options.query) options.query = {}
  const {
    name,
    path,
    params,
    query,
  } = route
  const callback = {
    name,
    path,
    params,
    query,
  }
  options.query.callback = JSON.stringify(callback)
  return options
})


// export function guardEvent (e: MouseEvent) {
//   // don't redirect with control keys
//   if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
//   // don't redirect when preventDefault called
//   if (e.defaultPrevented) return
//   // don't redirect on right click
//   if (e.button !== undefined && e.button !== 0) return
//   // don't redirect if `target="_blank"`
//   if (e.currentTarget && e.currentTarget.getAttribute) {
//     const target = e.currentTarget.getAttribute('target')
//     if (/\b_blank\b/i.test(target)) return
//   }
//   // this may be a Weex event which doesn't have this method
//   if (e.preventDefault) {
//     e.preventDefault()
//   }
//   return true
// }