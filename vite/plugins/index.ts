import vue from '@vitejs/plugin-vue'
// @ts-ignore
import createAutoImport from "./auto-import"
// @ts-ignore
import createSvgIcon from './svg-icon'
// @ts-ignore
import createCompression from './compression'
// @ts-ignore
import createSetupExtend from './setup-extend'
// @ts-ignore
import createAutoImportComponents from "./auto-components";

export default function createVitePlugins(viteEnv:any, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push(createAutoImport())
    vitePlugins.push(createAutoImportComponents())
    vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
    isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
