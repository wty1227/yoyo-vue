import tab from './tab'
import auth from './auth.js'
import cache from './cache.js'
import modal from './modal'
import download from './download.js'

export default function installPlugins(app:any){
  // 页签操作
  app.config.globalProperties.$tab = tab
  // 认证对象
  app.config.globalProperties.$auth = auth
  // 缓存对象
  app.config.globalProperties.$cache = cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  app.config.globalProperties.$download = download
}
