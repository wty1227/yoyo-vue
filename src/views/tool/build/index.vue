<template>
  <div class="app-container">
    <v-form-designer ref="vfDesigner" :field-list-api="fieldListApi" :banned-widgets="testBanned"
                     :designer-config="designerConfig">
      <!-- 自定义按钮插槽演示 -->
      <template #customToolButtons>
        <el-button
            type="primary"
            icon="Share"
            @click="handleForm"
        >保存</el-button>
      </template>
    </v-form-designer>

    <!--表单配置详情-->
    <el-dialog :title="formTitle" v-model="formOpen" width="500px" append-to-body>
      <el-form ref="tabNameRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script setup name="FormBuild">
import {getForm, addForm, updateForm} from "@/api/flowable/form";
import {
  getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'

import {ref, reactive, getCurrentInstance} from 'vue'
const { proxy } = getCurrentInstance();
const formTitle = ref("")
const formOpen = ref(false);


// const emptyActiveData = { style: {}, autosize: {} }
// let oldActiveId
// let tempActiveData
let idGlobal = getIdGlobal()


const data = reactive({
  form: {
    formId: null,
    formName: null,
    formContent: null,
    remark: null
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    noticeTitle: undefined,
    createBy: undefined,
    status: undefined
  },
  rules: { },
});
const { queryParams, form, rules } = toRefs(data);



const vfDesigner = ref(null)
const fieldListApi = reactive({
  URL: 'https://www.fastmock.site/mock/2de212e0dc4b8e0885fea44ab9f2e1d0/vform/listField',
  labelKey: 'fieldLabel',
  nameKey: 'fieldName'
})
const testBanned = ref([
  // 'sub-form',
  // 'alert',
])
const designerConfig = reactive({
  languageMenu: false,
  externalLink: false,
  //formTemplates: false,
  //eventCollapse: false,
  //clearDesignerButton: false,
  //previewFormButton: false,
  generateSFCButton: false,
  logoHeader: false,
  //presetCssCode: '.abc { font-size: 16px; }',
})


// watch(activeId, (val) => {
//   oldActiveId = val
// }, {immediate: true})

onMounted(() => {
  const formId =  proxy.$route.query && proxy.$route.query.formId;
  if (formId) {
    getForm(formId).then(res =>{
      // that.formConf = JSON.parse(res.data.formContent);
      // that.drawingList = that.formConf.fields;
      form.value = res.data;
    })
  }else {
    // 初始化表单设计器
    vfDesigner.value.clearDesigner();
  }
})
/** 表单基本信息 */
const handleForm = () => {
  let formJson = vfDesigner.value.getFormJson()
  //TODO: 将formJson提交给后端保存接口，需自行实现！！

  // this.formData = {
  //   fields: deepClone(this.drawingList),
  //   ...this.formConf
  // }
  form.value.formContent =  JSON.stringify(formJson);
  formOpen.value = true;
  formTitle.value = "添加表单";
  console.log('json:', formJson)
  console.log('form:', form)
  // ElMessage.success('表单已保存！')
}
// 表单重置
function reset() {
  this.form = {
    formId: null,
    formName: null,
    formContent: null,
    remark: null
  };
  this.resetForm("tabNameRef");
}
// 取消按钮
function cancel() {
  formOpen.value = false;
  reset();
}
/** 保存表单信息 */
function submitForm(){
  proxy.$refs["tabNameRef"].validate(valid => {
    if (valid) {
      if (form.value.formId != null) {
        updateForm(this.form).then(response => {
          proxy.$modal.msgSuccess("修改成功");
        });
      } else {
        addForm(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
        });
      }
      // this.drawingList = []
      idGlobal = 100
      // open.value = false;
      // 关闭当前标签页并返回上个页面
      const obj = { path: "/flowable/form", query: { t: Date.now()} };
      proxy.$tab.closeOpenPage(obj);
    }
  });
}
</script>

<style>
.el-header.main-header{
  display: none !important;
}
</style>
