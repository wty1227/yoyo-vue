<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监听类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择监听类型" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_listener_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
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
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:listener:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:listener:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:listener:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:listener:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="listenerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
<!--      <el-table-column label="主键" align="center" prop="id"/>-->
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="监听类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="sys_listener_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center" prop="eventType"/>
      <el-table-column label="值类型" align="center" prop="valueType" width="100">
        <template #default="scope">
          <dict-tag :options="sys_listener_value_type" :value="scope.row.valueType"/>
        </template>
      </el-table-column>
      <el-table-column label="执行内容" align="center" prop="value"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:notice:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:notice:remove']">删除
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

    <!-- 添加或修改流程监听对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="listenerRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="监听类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择监听类型">
            <el-option
                v-for="dict in sys_listener_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType" v-if="form.type === '1'">
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option
                v-for="dict in taskListenerEventList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType" v-else>
          <el-select v-model="form.eventType" placeholder="请选择事件类型">
            <el-option
                v-for="dict in executionListenerEventList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值类型" prop="valueType">
          <el-radio-group v-model="form.valueType">
            <el-radio
                v-for="dict in sys_listener_value_type"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="执行内容" prop="value">
          <el-input v-model="form.value" placeholder="请输入执行内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Listener">
import {getCurrentInstance, reactive} from "vue";

const {proxy} = getCurrentInstance();
import {listListener, getListener, delListener, addListener, updateListener} from "@/api/system/listener.ts";

const {
  sys_listener_value_type,
  sys_listener_type,
  common_status,
  sys_listener_event_type
} = proxy.useDict('sys_listener_value_type', 'sys_listener_type', 'common_status', 'sys_listener_event_type');

const listenerList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  // 遮罩层
  // loading: true,
  // 选中数组
  // ids: [],
  // 非单个禁用
  // single: true,
  // 非多个禁用
  // multiple: true,
  // 显示搜索条件
  // showSearch: true,
  // 总条数
  // total: 0,
  // 流程监听表格数据
  // listenerList: [],
  // 弹出层标题
  // title: "",
  // 是否显示弹出层
  // open: false,
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    type: null,
    eventType: null,
    valueType: null,
    value: null,
    status: null,
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {},
  taskListenerEventList: [
    {label: 'create', value: 'create'},
    {label: 'assignment', value: 'assignment'},
    {label: 'complete', value: 'complete'},
    {label: 'delete', value: 'delete'},
  ],
  executionListenerEventList: [
    {label: 'start', value: 'start'},
    {label: 'end', value: 'end'},
    {label: 'take', value: 'take'},
  ],
})
const {queryParams, form, rules, taskListenerEventList, executionListenerEventList} = toRefs(data);


/** 查询流程监听列表 */
function getList() {
  loading.value = true;
  listListener(queryParams.value).then(response => {
    console.log('listener:', response)
    console.log(response.rows)
    listenerList.value = response.rows;
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
    type: null,
    eventType: null,
    valueType: null,
    value: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    status: 0,
    remark: null
  };
  proxy.resetForm("listenerRef");
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
  // debugger
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  // debugger
  reset();
  open.value = true;
  title.value = "添加流程监听";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getListener(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改流程监听";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["form"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateListener(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addListener(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除流程监听编号为"' + ids + '"的数据项？').then(function () {
    return delListener(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  download('system/listener/export', {
    ...queryParams
  }, `listener_${new Date().getTime()}.xlsx`)
}

getList();
</script>
