<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="表单名称" prop="formName">
        <el-input
            v-model="queryParams.formName"
            placeholder="请输入表单名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="plus"

            @click="handleAdd"
            v-hasPermi="['flowable:form:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="edit"

            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['flowable:form:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="delete"

            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['flowable:form:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="download"

            @click="handleExport"
            v-hasPermi="['flowable:form:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="表单主键" align="center" prop="formId"/>
      <el-table-column label="表单名称" align="center" prop="formName"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="view"
              @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button

              type="text"
              icon="edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['flowable:form:edit']"
          >修改
          </el-button>
          <el-button

              type="text"
              icon="delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['flowable:form:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改流程表单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sheetRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称"/>
        </el-form-item>
        <el-form-item label="表单内容">
          <editor v-model="form.formContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--表单配置详情-->
    <el-dialog :title="formTitle" v-model="formConfOpen" width="80%" append-to-body>
      <div class="test-form">
        <!--        <parser :key="new Date().getTime()"  :form-conf="formConf" />-->
        <v-form-render :form-json="formConf" ref="vFormRef">
        </v-form-render>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Form">
import {listForm, getForm, delForm, addForm, updateForm, exportForm} from "@/api/flowable/form.ts";
// import Editor from '@/components/Editor/index.vue';
// import Parser from '@/components/parser/Parser'
const {proxy} = getCurrentInstance();

const vFormRef = ref();
const formConf = ref({}) // 默认表单数据
const formConfOpen = ref(false)
const formTitle = ref("")
// const vfdRef = ref(null)

const formList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


const data = reactive({
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    formName: null,
    formContent: null,
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

onMounted(() => {
})
/** 查询流程表单列表 */
function getList() {
  loading.value = true;
  listForm(queryParams).then(response => {
    formList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    formId: null,
    formName: null,
    formContent: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  resetForm("sheetRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.formId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 表单配置信息 */
function handleDetail(row) {
  // debugger
  formConfOpen.value = true;
  formTitle.value = "流程表单配置详细";
  // formConf.value = null;
  formConf.value = JSON.parse(row.formContent)
  vFormRef.value.setFormJson(JSON.parse(row.formContent))
}

/** 新增按钮操作 */
function handleAdd() {
  // reset();
  // open.value = true;
  // title = "添加流程表单";
  proxy.$router.push({path: '/tool/build/index', query: {formId: null}})
}

/** 修改按钮操作 */
function handleUpdate(row) {
  // reset();
  // const formId = row.formId || ids.value
  // getForm(formId).then(response => {
  //   form = response.data;
  //   open.value = true;
  //   title = "修改流程表单";
  // });
  proxy.$router.push({path: '/tool/build/index', query: {formId: row.formId}})
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["form"].validate(valid => {
    if (valid) {
      if (form.value.formId != null) {
        updateForm(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addForm(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const formIds = row.formId || ids.value;
  proxy.$confirm('是否确认删除流程表单编号为"' + formIds + '"的数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return delForm(formIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  })
}

/** 导出按钮操作 */
function handleExport() {
  const queryParams = queryParams;
  proxy.$confirm('是否确认导出所有流程表单数据项?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return exportForm(queryParams);
  }).then(response => {
    download(response.msg);
  })
}

getList();
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>
