import {defineStore} from "pinia";

const useTagsViewStore = defineStore(
  'tags-view',
  {
    state: () => {
      return{
        visitedViews: [],
        cachedViews: [],
        iframeViews: []
      }
    },
    actions: {
      // @ts-ignore
      addView(view) {
        this.addVisitedView(view)
        this.addCachedView(view)
      },
      // @ts-ignore
      addIframeView(view) {
        // @ts-ignore
        if (this.iframeViews.some((v:any) => v.path === view.path)) return
        this.iframeViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          }) as never
        )
      },
      // @ts-ignore
      addVisitedView(view) {
        if (this.visitedViews.some((v:any) => v.path === view.path)) return
        this.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          }) as never
        )
      },
      // @ts-ignore
      addCachedView(view) {
        // @ts-ignore
        if (this.cachedViews.includes(view.name)) return
        if (!view.meta.noCache) {
          // @ts-ignore
          this.cachedViews.push(view.name)
        }
      },
      // @ts-ignore
      delView(view) {
        return new Promise(resolve => {
          this.delVisitedView(view)
          this.delCachedView(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews]
          })
        })
      },
      // @ts-ignore
      delVisitedView(view) {
        return new Promise(resolve => {
          for (const [i, v] of this.visitedViews.entries()) {
            // @ts-ignore
            if (v.path === view.path) {
              this.visitedViews.splice(i, 1)
              break
            }
          }
          // @ts-ignore
          this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
          resolve([...this.visitedViews])
        })
      },
      // @ts-ignore
      delIframeView(view) {
        return new Promise(resolve => {
          // @ts-ignore
          this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
          resolve([...this.iframeViews])
        })
      },
      // @ts-ignore
      delCachedView(view) {
        return new Promise(resolve => {
          // @ts-ignore
          const index = this.cachedViews.indexOf(view.name)
          index > -1 && this.cachedViews.splice(index, 1)
          resolve([...this.cachedViews])
        })
      },
      // @ts-ignore
      delOthersViews(view) {
        return new Promise(resolve => {
          this.delOthersVisitedViews(view)
          this.delOthersCachedViews(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews]
          })
        })
      },
      // @ts-ignore
      delOthersVisitedViews(view) {
        return new Promise(resolve => {
          this.visitedViews = this.visitedViews.filter((v:any) => {
            return v.meta.affix || v.path === view.path
          })
          this.iframeViews = this.iframeViews.filter((item:any) => item.path === view.path)
          resolve([...this.visitedViews])
        })
      },
      // @ts-ignore
      delOthersCachedViews(view) {
        return new Promise(resolve => {
          // @ts-ignore
          const index = this.cachedViews.indexOf(view.name)
          if (index > -1) {
            this.cachedViews = this.cachedViews.slice(index, index + 1)
          } else {
            this.cachedViews = []
          }
          resolve([...this.cachedViews])
        })
      },
      // @ts-ignore
      delAllViews(view) {
        return new Promise(resolve => {
          this.delAllVisitedViews(view)
          this.delAllCachedViews(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews]
          })
        })
      },
      // @ts-ignore
      delAllVisitedViews(view) {
        return new Promise(resolve => {
          const affixTags = this.visitedViews.filter((tag:any) => tag.meta.affix)
          this.visitedViews = affixTags
          this.iframeViews = []
          resolve([...this.visitedViews])
        })
      },
      // @ts-ignore
      delAllCachedViews(view) {
        return new Promise(resolve => {
          this.cachedViews = []
          resolve([...this.cachedViews])
        })
      },
      // @ts-ignore
      updateVisitedView(view) {
        for (let v of this.visitedViews) {
          // @ts-ignore
          if (v.path === view.path) {
            v = Object.assign(v, view)
            break
          }
        }
      },
      // @ts-ignore
      delRightTags(view) {
        return new Promise(resolve => {
          const index = this.visitedViews.findIndex((v:any) => v.path === view.path)
          if (index === -1) {
            return
          }
          this.visitedViews = this.visitedViews.filter((item, idx) => {
            // @ts-ignore
            if (idx <= index || (item.meta && item.meta.affix)) {
              return true
            }
            // @ts-ignore
            const i = this.cachedViews.indexOf(item.name)
            if (i > -1) {
              this.cachedViews.splice(i, 1)
            }
            // @ts-ignore
            if(item.meta.link) {
              // @ts-ignore
              const fi = this.iframeViews.findIndex((v:any) => v.path === item.path)
              this.iframeViews.splice(fi, 1)
            }
            return false
          })
          resolve([...this.visitedViews])
        })
      },
      // @ts-ignore
      delLeftTags(view) {
        return new Promise(resolve => {
          const index = this.visitedViews.findIndex((v:any) => v.path === view.path)
          if (index === -1) {
            return
          }
          this.visitedViews = this.visitedViews.filter((item, idx) => {
            // @ts-ignore
            if (idx >= index || (item.meta && item.meta.affix)) {
              return true
            }
            // @ts-ignore
            const i = this.cachedViews.indexOf(item.name)
            if (i > -1) {
              this.cachedViews.splice(i, 1)
            }
            // @ts-ignore
            if(item.meta.link) {
              // @ts-ignore
              const fi = this.iframeViews.findIndex((v:any) => v.path === item.path)
              this.iframeViews.splice(fi, 1)
            }
            return false
          })
          resolve([...this.visitedViews])
        })
      }
    }
  })

export default useTagsViewStore
