import useTagsViewStore from '@/store/modules/tagsView'
import router from '@/router'

export default {
  // @ts-ignore 刷新当前tab页签
  refreshPage(obj) {
    const { path, query, matched } = router.currentRoute.value;
    if (obj === undefined) {
      matched.forEach((m) => {
        if (m.components && m.components.default && m.components.default.name) {
          if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
            obj = { name: m.components.default.name, path: path, query: query };
          }
        }
      });
    }
    return useTagsViewStore().delCachedView(obj).then(() => {
      const { path, query } = obj
      router.replace({
        path: '/redirect' + path,
        query: query
      })
    })
  },
  // @ts-ignore 关闭当前tab页签，打开新页签
  closeOpenPage(obj) {
    useTagsViewStore().delView(router.currentRoute.value);
    if (obj !== undefined) {
      return router.push(obj);
    }
  },
  // @ts-ignore 关闭指定tab页签
  closePage(obj) {
    if (obj === undefined) {
      // @ts-ignore
      return useTagsViewStore().delView(router.currentRoute.value).then(({ lastPath }) => {
        return router.push(lastPath || '/index');
      });
    }
    return useTagsViewStore().delView(obj);
  },
  // @ts-ignore 关闭所有tab页签
  closeAllPage() {
    return useTagsViewStore().delAllViews();
  },
  // @ts-ignore 关闭左侧tab页签
  closeLeftPage(obj) {
    return useTagsViewStore().delLeftTags(obj || router.currentRoute.value);
  },
  // @ts-ignore 关闭右侧tab页签
  closeRightPage(obj) {
    return useTagsViewStore().delRightTags(obj || router.currentRoute.value);
  },
  // @ts-ignore 关闭其他tab页签
  closeOtherPage(obj) {
    return useTagsViewStore().delOthersViews(obj || router.currentRoute.value);
  },
  // @ts-ignore 打开tab页签
  openPage(url) {
    return router.push(url);
  },
  // @ts-ignore 修改tab页签
  updatePage(obj) {
    return useTagsViewStore().updateVisitedView(obj);
  }
}
