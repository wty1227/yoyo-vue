import { createApp } from 'vue'
// import './style.css'
import '@/assets/styles/index.scss' // global css
import App from './App.vue'
import router from "./router";
import './permission' // permission control
// import { createPinia } from 'pinia'
import store from "@/store";


// @ts-ignore
import Cookies from 'js-cookie'


// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'
// @ts-ignore
import elementIcons from '@/components/SvgIcon/svgicon'
// import {ElementPlus} from "@element-plus/icons-vue";
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import ElementPlus from 'element-plus'  //引入element-plus库
import VForm3 from 'vform3-builds'  //引入VForm 3库+
import 'element-plus/dist/index.css'  //引入element-plus样式
import 'vform3-builds/dist/designer.style.css'  //引入VForm3样式



import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

const app = createApp(App)
// app.config.productionTip = false
// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels


app.use(store)
app.use(router)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)
// 使用element-plus 并且设置全局的大小
// @ts-ignore
// app.use(ElementPlus, {
//     locale: locale,
//     // 支持 large、default、small
//     size: Cookies.get('size') || 'default'
// })
app.use(ElementPlus)  //全局注册element-plus
app.use(VForm3)


app.mount('#app')
