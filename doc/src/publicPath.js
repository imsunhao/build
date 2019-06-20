import { injectGlobal, isProduction } from 'src/envs'
__webpack_public_path__ =
  isProduction && injectGlobal.__INJECT_ENV__.SERVER_ENV !== 'local'
    ? injectGlobal.__INJECT_CONTEXT__.STATIC_HOST + injectGlobal.__INJECT_ENV__.PUBLIC_PATH
    : injectGlobal.__INJECT_ENV__.PUBLIC_PATH
