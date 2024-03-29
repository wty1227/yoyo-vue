<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入表达式名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_common_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search"  @click="handleQuery">搜索</el-button>
        <el-button icon="refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="plus"
            
            @click="handleAdd"
            v-hasPermi="['system:expression:add']"
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
            v-hasPermi="['system:expression:edit']"
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
            v-hasPermi="['system:expression:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="download"
            
            @click="handleExport"
            v-hasPermi="['system:expression:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="expressionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id"/>
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="表达式内容" align="center" prop="expression"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              
              type="text"
              icon="edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:expression:edit']"
          >修改
          </el-button>
          <el-button
              
              type="text"
              icon="delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:expression:remove']"
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

    <!-- 添加或修改流程达式对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="expressionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入表达式名称"/>
        </el-form-item>
        <el-form-item label="内容" prop="expression">
          <el-input v-model="form.expression" placeholder="请输入表达式内容"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in sys_common_status"
                :key="dict.value"
                :label="parseInt(dict.value)"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script setup name="FlowExp">
import {getCurrentInstance, reactive} from "vue";

const {proxy} = getCurrentInstance();
import {
  listExpression,
  getExpression,
  delExpression,
  addExpression,
  updateExpression
} from "@/api/system/expression.ts";

const {sys_common_status} = proxy.useDict('sys_common_status')


const expressionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    expression: null,
    status: null,
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {}
})
const {queryParams, form, rules} = toRefs(data);

/** 查询流程达式列表 */
function getList() {
  loading.value = true;
  listExpression(queryParams.value).then(response => {
    console.log('expression:', response)
    expressionList.value = response.rows;
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
    id: null,
    name: null,
    expression: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    status: 0,
    remark: null
  };
  proxy.resetForm("expressionRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryForm");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加流程达式";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getExpression(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改流程达式";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["form"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateExpression(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addExpression(form.value).then(response => {
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
  const ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除流程达式编号为"' + ids + '"的数据项？').then(function () {
    return delExpression(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  download('system/expression/export', {
    ...queryParams
  }, `expression_${new Date().getTime()}.xlsx`)
}

getList();
</script>
