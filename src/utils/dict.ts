import useDictStore from '@/store/modules/dict'
import { getDicts } from '@/api/system/dict/data'
import {toRefs, ref} from "vue";

// @ts-ignore
/**
 * 获取字典数据
 */
export function useDict(...args:any) {
  const res = ref({});
  return (() => {
    // @ts-ignore
    args.forEach((dictType, index) => {
      // @ts-ignore
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        // @ts-ignore
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then((resp:any) => {
          // @ts-ignore
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          // @ts-ignore
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}