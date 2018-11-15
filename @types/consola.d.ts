declare module 'consola' {
  export interface LevelType {
      level: number;
      color: string;
      isError?: boolean;
  }

  export interface Reporter {
      log(logObj: any): void;
  }

  export interface Option {
      level?: number;
      types?: LevelType;
      reporters?: Reporter[];
  }

  export class Consola {
      constructor(option?: Option);

      add(reporter: Reporter): Consola;
      remove(reporter: Reporter): Consola;
      clear(): Consola;
      withScope(scope: string): void;
      start(...arguments: string[]): void;
      success(...arguments: string[]): void;
      info(...arguments: string[]): void;
      error(...arguments: Array<string | Error>): void;
  }

  export function start(...arguments: string[]): void;
  export function debug(...arguments: string[]): void;
  export function success(...arguments: string[]): void;
  export function info(...arguments: string[]): void;
  export function fatal(...arguments: string[]): void;
  export function error(...arguments: Array<string | Error>): void;
}
