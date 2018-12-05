import Webpackbar from 'webpackbar'

export function getCommonConfig(mode: "development" | "production" | "none") {
  const isProd = mode !== 'development'
  return {
    plugins: isProd ? [
      new Webpackbar(),
    ]: []
  }
}
