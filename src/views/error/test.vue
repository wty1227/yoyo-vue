<template>

  <!--  <v-form-designer ref="vfdRef">  </v-form-designer>-->
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
</template>

<script setup>
import {getForm, addForm, updateForm} from "@/api/flowable/form";

import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();
const formTitle = ref("")
const formOpen = ref(false);

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
  //'sub-form',
  //'alert',
])
const designerConfig = reactive({
  languageMenu: true,
  externalLink: false,
  //formTemplates: false,
  //eventCollapse: false,
  //clearDesignerButton: false,
  //previewFormButton: false,
  generateSFCButton: false

  //presetCssCode: '.abc { font-size: 16px; }',
})
/** 表单基本信息 */
const handleForm = () => {
  let formJson = vfDesigner.value.getFormJson()
  //TODO: 将formJson提交给后端保存接口，需自行实现！！

  // this.formData = {
  //   fields: deepClone(this.drawingList),
  //   ...this.formConf
  // }
  form.value.formContent = formJson // JSON.stringify(this.formData);
  formOpen.value = true;
  formTitle.value = "添加表单";

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
  this.formOpen = false;
  this.reset();
}
/** 保存表单信息 */
function submitForm(){
  proxy.$refs["tabNameRef"].validate(valid => {
    if (valid) {
      if (this.form.formId != null) {
        updateForm(this.form).then(response => {
          this.$modal.msgSuccess("修改成功");
        });
      } else {
        addForm(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
        });
      }
      this.drawingList = []
      this.idGlobal = 100
      this.open = false;
      // 关闭当前标签页并返回上个页面
      const obj = { path: "/flowable/form", query: { t: Date.now()} };
      this.$tab.closeOpenPage(obj);
    }
  });
}
</script>

<!--<script setup>-->
<!--import 'vform3-builds/dist/designer.style.css'  //引入VForm3样式-->
<!--const vfdRef = ref(null)-->
<!--</script>-->

<!--<style lang="scss">-->
<!--body {-->
<!--  margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */-->
<!--}-->
<!--</style>-->