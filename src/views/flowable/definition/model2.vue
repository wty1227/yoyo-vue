<template>
  <div>
    <bpmn-modeler
        ref="refNode"
        :xml="xml"
        :users="users"
        :groups="groups"
        :categorys="sys_process_category"
        :exps="exps"
        :is-view="false"
        @save="save"
        @showXML="showXML"
    />
    <!--在线查看xml-->
    <el-drawer :title="xmlTitle" :modal="false" direction="rtl" v-model="xmlOpen" size="60%">
      <!-- 设置对话框内容高度 -->
      <el-scrollbar>
        <pre v-highlight="xmlData"><code class="xml"></code></pre>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script setup name="Model">
import {readXml, roleList, saveXml, userList, expList} from "@/api/flowable/definition";
// import bpmnModeler from '@/components/Process/index'
// import vkBeautify from 'vkbeautify'
// import hljs from 'highlight.js'
// import 'highlight.js/styles/atelier-savanna-dark.css'
import {onMounted, toRefs} from "vue";

const {proxy} = getCurrentInstance();
const { sys_process_category } = proxy.useDict("sys_process_category");
// export default {
//   name: "Index",
//   components: {
//     bpmnModeler,
//     vkBeautify
//   },
// 自定义指令
const directives = reactive({
  deep: true,
  highlight: {
    deep: true,
    bind: function bind(el, binding) {
      const targets = el.querySelectorAll('code');
      let target;
      let i;
      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];
        if (typeof binding.value === 'string') {
          target.textContent = binding.value;
        }
        // hljs.highlightBlock(target);
      }
    },
    componentUpdated: function componentUpdated(el, binding) {
      const targets = el.querySelectorAll('code');
      let target;
      let i;
      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];
        if (typeof binding.value === 'string') {
          target.textContent = binding.value;
          // hljs.highlightBlock(target);
        }
      }
    },
  }
})
const data = reactive({
  xml: "", // 后端查询到的xml
  modeler: "",
  xmlOpen: false,
  xmlTitle: '',
  xmlData: '',
  users: [],
  groups: [],
  // categorys: [],
  exps: [],

})
const {xml, modeler, xmlOpen, xmlTitle, xmlData, users, groups, exps} = toRefs(data)
onMounted(() => {
  const deployId = proxy.$route.query && proxy.$route.query.deployId;
  //  查询流程xml
  if (deployId) {
    getXmlData(deployId);
  }
  // getDicts("sys_process_category").then(res => {
  //   categorys.value = res.data;
  // });

  getDataList()
})

/** xml 文件 */
function getXmlData(deployId) {
  // 发送请求，获取xml
  readXml(deployId).then(res => {
    this.xml = res.data;
    this.modeler = res.data
  })
}

/** 保存xml */
function save(data) {
  const params = {
    name: data.process.name,
    category: data.process.category,
    xml: data.xml
  }

  saveXml(params).then(res => {
    proxy.$modal.msgSuccess(res.msg)
    // 关闭当前标签页并返回上个页面
    const obj = {path: "/flowable/definition", query: {t: Date.now()}};
    proxy.$tab.closeOpenPage(obj);
  })
}

/** 指定流程办理人员列表 */
function getDataList() {
  userList().then(res => {
    res.data.forEach(val => {
      val.userId = val.userId.toString();
    })
    users.value = res.data;
    // let arr = {nickName: "流程发起人", userId: "${INITIATOR}"}
    // this.users.push(arr)
  });
  roleList().then(res => {
    res.data.forEach(val => {
      val.roleId = val.roleId.toString();
    })
    groups.value = res.data;
  });
  expList().then(res => {
    exps.value = res.data;
  });
}

/** 展示xml */
function showXML(xmlData) {
  xmlTitle.value = 'xml查看';
  xmlOpen.value = true;
  xmlData.value = vkBeautify.xml(xmlData);
}

</script>
<style lang="scss" scoped>
.content-box {
  line-height: 10px;
}

// 修改对话框高度
.showAll_dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  ::v-deep .el-dialog {
    margin: 0 auto !important;
    height: 80%;
    overflow: hidden;
    background-color: #ffffff;

    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
      // 下边设置字体，我的需求是黑底白字
      color: #ffffff;
      padding: 0 15px;
    }
  }
}
</style>
