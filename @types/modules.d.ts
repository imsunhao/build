declare module 'config/webpack.config' {
  import { Configuration } from 'webpack'
  const config : Configuration
  export = config
}

declare module 'vue-loader' {
  const VueLoaderPlugin: any
}

declare module 'eval' {
  function eval(content: string, filename?: string, scope?: any, includeGlobals?: any): any
  export = eval
}

declare module 'consola' {
  export interface LevelType {
    level: number
    color: string
    isError?: boolean
  }

  export interface Reporter {
    log(logObj: any): void
  }

  export interface Option {
    level?: number
    types?: LevelType
    reporters?: Reporter[]
  }

  export class Consola {
    constructor(option?: Option)

    add(reporter: Reporter): Consola
    remove(reporter: Reporter): Consola
    clear(): Consola
    withScope(scope: string): void
    start(...arguments: string[]): void
    success(...arguments: string[]): void
    info(...arguments: string[]): void
    error(...arguments: Array<string | Error>): void
  }

  export function start(...arguments: any[]): void
  export function ready(...arguments: any[]): void
  export function debug(...arguments: any[]): void
  export function success(...arguments: any[]): void
  export function info(...arguments: any[]): void
  export function fatal(...arguments: any[]): void
  export function log(...arguments: any[]): void
  export function silent(...arguments: any[]): void
  export function error(...arguments: Array<any | Error>): void
  export function warn(...arguments: Array<any | Error>): void
}
