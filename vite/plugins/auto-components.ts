import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

export default function createAutoImportComponents() {
    return Components({
        dts: 'src/components.d.ts',
        deep: true,
        dirs: ['src/components'],
        extensions: ['vue', 'tsx'],
        resolvers: [
            // 自动导入element相关组件
            ElementPlusResolver(),

            // 自动注册图标组件
            IconsResolver({
                enabledCollections: ['ep'], //@iconify-json/ep 是 Element Plus 的图标库，所以 IconsResolver 配置了 enabledCollections: ['ep']
            }),
            // AntDesignVueResolver({
            //   importStyle: false,
            // }),
        ],
    })
}
