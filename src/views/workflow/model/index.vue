<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模型标识" prop="modelKey">
        <el-input
            v-model="queryParams.modelKey"
            placeholder="请输入模型标识"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="modelName">
        <el-input
            v-model="queryParams.modelName"
            placeholder="请输入模型名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select v-model="queryParams.category" clearable placeholder="请选择" size="small">
          <el-option
              v-for="item in categoryOptions"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          plain-->
      <!--          icon="el-icon-upload"-->
      <!--          size="mini"-->
      <!--          @click="handleImport"-->
      <!--          v-hasPermi="['workflow:model:import']"-->
      <!--        >导入</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['workflow:model:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['workflow:model:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['workflow:model:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" fit :data="modelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="模型标识" align="center" prop="modelKey" :show-overflow-tooltip="true"/>
      <el-table-column label="模型名称" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" @click="handleProcessView(scope.row)">
            <span>{{ scope.row.modelName }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="流程分类" align="center" prop="categoryName" :formatter="categoryFormat"/>
      <el-table-column label="模型版本" align="center">
        <template slot-scope="scope">
          <el-tag size="medium">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="description" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:model:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              size="mini"
              icon="el-icon-brush"
              @click="handleDesigner(scope.row)"
              v-hasPermi="['workflow:model:designer']"
          >设计
          </el-button>
          <el-button
              type="text"
              size="mini"
              icon="el-icon-video-play"
              v-hasPermi="['workflow:model:deploy']"
              @click.native="handleDeploy(scope.row)"
          >部署
          </el-button>
          <el-dropdown size="mini"
                       v-hasPermi="['workflow:model:query', 'workflow:model:list', 'workflow:model:remove']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                  icon="el-icon-view"
                  @click.native="handleProcessView(scope.row)"
                  v-hasPermi="['workflow:model:query']"
              >流程图
              </el-dropdown-item>
              <el-dropdown-item
                  icon="el-icon-price-tag"
                  @click.native="handleHistory(scope.row)"
                  v-hasPermi="['workflow:model:list']"
              >历史
              </el-dropdown-item>
              <el-dropdown-item
                  icon="el-icon-delete"
                  @click.native="handleDelete(scope.row)"
                  v-hasPermi="['workflow:model:remove']"
              >删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!--  添加或修改模型信息对话框  -->
    <el-dialog :title="title" :visible.sync="open" width="30%" append-to-body @close="cancel()">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模型标识" prop="modelKey">
          <el-input v-model="form.modelKey" clearable disabled/>
        </el-form-item>
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="form.modelName" clearable :disabled="form.modelId !== undefined"/>
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="item in categoryOptions" :key="item.categoryId" :label="item.categoryName"
                       :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" maxlength="200"
                    show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>


    <!--  &lt;!&ndash; bpmn20.xml导入对话框 &ndash;&gt;-->
    <!--  <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body @close="cancel('uploadForm')">-->
    <!--    <el-upload-->
    <!--      ref="upload"-->
    <!--      :limit="1"-->
    <!--      accept=".xml"-->
    <!--      :headers="upload.headers"-->
    <!--      :action="upload.url + '?name=' + upload.name+'&category='+ upload.category"-->
    <!--      :disabled="upload.isUploading"-->
    <!--      :on-progress="handleFileUploadProgress"-->
    <!--      :on-success="handleFileSuccess"-->
    <!--      :auto-upload="false"-->
    <!--      drag-->
    <!--    >-->
    <!--      <i class="el-icon-upload"></i>-->
    <!--      <div class="el-upload__text">-->
    <!--        将文件拖到此处，或-->
    <!--        <em>点击上传</em>-->
    <!--      </div>-->
    <!--      <div class="el-upload__tip" slot="tip">-->
    <!--        <el-form ref="uploadForm" :model="upload" size="mini" :rules="rules" label-width="80px">-->
    <!--          <el-form-item label="流程名称" prop="name">-->
    <!--            <el-input v-model="upload.name" clearable/>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="流程分类" prop="category">-->
    <!--            <el-select v-model="upload.category" placeholder="请选择" clearable style="width:100%">-->
    <!--              <el-option v-for="item in categoryOptions" :key="item.categoryId" :label="item.categoryName"-->
    <!--                         :value="item.code"/>-->
    <!--            </el-select>-->
    <!--          </el-form-item>-->
    <!--        </el-form>-->
    <!--      </div>-->
    <!--      <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“bpmn20.xml”格式文件！</div>-->
    <!--    </el-upload>-->
    <!--    <div slot="footer" class="dialog-footer">-->
    <!--      <el-button type="primary" @click="submitFileForm">确 定</el-button>-->
    <!--      <el-button @click="cancel('uploadForm')">取 消</el-button>-->
    <!--    </div>-->
    <!--  </el-dialog>-->

    <!-- 流程图 -->
    <el-dialog :title="processView.title" v-model="processView.open" width="70%" append-to-body>
      <process-viewer :key="`designer-${processView.index}`" :xml="processView.xmlData" :style="{height: '400px'}"/>
    </el-dialog>

    <el-dialog title="模型历史" v-model="history.open" width="70%">
      <el-table v-loading="history.loading" fit :data="historyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="模型标识" align="center" prop="modelKey" :show-overflow-tooltip="true"/>
        <el-table-column label="模型名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="handleProcessView(scope.row)">
              <span>{{ scope.row.modelName }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="流程分类" align="center" prop="categoryName" :formatter="categoryFormat"/>
        <el-table-column label="模型版本" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description" :show-overflow-tooltip="true"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                type="text"
                size="mini"
                icon="el-icon-video-play"
                v-hasPermi="['workflow:model:deploy']"
                @click.native="handleDeploy(scope.row)"
            >部署
            </el-button>
            <el-button
                type="text"
                size="mini"
                icon="el-icon-star-off"
                v-hasPermi="['workflow:model:save']"
                @click.native="handleLatest(scope.row)"
            >设为最新
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="historyTotal > 0"
          :total="historyTotal"
          :page.sync="queryHistoryParams.pageNum"
          :limit.sync="queryHistoryParams.pageSize"
          @pagination="getHistoryList"
      />
    </el-dialog>

    <el-dialog :title="designerData.title" v-model="designerOpen" append-to-body fullscreen>
      <process-designer
          :key="designerOpen"
          style="border:1px solid rgba(0, 0, 0, 0.1);"
          ref="modelDesigner"
          v-loading="designerData.loading"
          :bpmnXml="designerData.bpmnXml"
          :designerForm="designerData.form"
          @save="onSaveDesigner"
      />
    </el-dialog>
  </div>

</template>

<script setup name="Model">
import {
  getBpmnXml,
  listModel,
  historyModel,
  latestModel,
  addModel,
  updateModel,
  saveModel,
  delModel,
  deployModel
} from "@/api/workflow/model";
import {listCategory} from '@/api/workflow/category'
import ProcessDesigner from '@/components/ProcessDesigner/index.vue';
import ProcessViewer from '@/components/ProcessViewer/index.vue'
import {getToken} from "@/utils/auth";

const {proxy} = getCurrentInstance();

// export default {
//   name: "Model",
//   components: {
//     ProcessDesigner,
//     ProcessViewer,
//   },
// 流程模型表格数据
const modelList = ref([]);
const categoryOptions = ref([]);

const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  // 表单校验
  rules: {
    modelKey: [
      {required: true, message: "模型标识不能为空", trigger: "blur"}
    ],
    modelName: [
      {required: true, message: "模型名称不能为空", trigger: "blur"}
    ],
    category: [
      {required: true, message: "请选择类型", trigger: "change"}
    ],
  },
  designerOpen: false,
  designerData: {
    loading: false,
    bpmnXml: '',
    modelId: null,
    form: {
      processName: null,
      processKey: null
    }
  },
  designerModelId: null,
  processView: {
    title: '',
    open: false,
    index: undefined,
    xmlData: "",
  },
  // bpmn.xml 导入
  upload: {
    // 是否显示弹出层（xml导入）
    open: false,
    // 弹出层标题（xml导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    name: null,
    category: null,
    // 设置上传的请求头部
    headers: {Authorization: "Bearer " + getToken()},
    // 上传的地址
    url: process.env.VUE_APP_BASE_API + "/workflow/definition/import"
  },
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    modelKey: null,
    modelName: null,
    category: null
  },
  currentRow: null,
  history: {
    open: false,
    loading: false
  },
  historyList: [],
  historyTotal: 0,
  queryHistoryParams: {
    pageNum: 1,
    pageSize: 10,
    modelKey: null
  }
});

const {queryParams, form, rules, designerOpen, designerData,designerModelId,processView,upload,  currentRow, history, historyList, historyTotal, queryHistoryParams} = toRefs(data);


/** 查询流程分类列表 */
function getCategoryList() {
  listCategory().then(response => data.value.categoryOptions = response.rows)
}

/** 查询流程模型列表 */
function getList() {
  loading.value = true;
  listModel(queryParams).then(response => {
    modelList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function cancel() {
  reset();
  // 关闭dialog
  open.value = false
}

// 表单重置
function reset() {
  form.value = {
    modelId: undefined,
    modelKey: undefined,
    modelName: undefined,
    category: undefined,
    description: undefined
  };
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.$refs.queryForm.resetFields()
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.modelId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 部署流程 */
function handleDeploy(row) {
  loading.value = true;
  deployModel({
    modelId: row.modelId
  }).then(response => {
    proxy.$modal.msgSuccess(response.msg);
    let obj = {name: 'Deploy', path: '/workflow/deploy'}
    return proxy.$store.dispatch('tagsView/delCachedView', obj).then(() => {
      proxy.$router.push(obj);
    });
  }).finally(() => {
    loading.value = false;
  })
}

/** 查看流程图 */
function handleProcessView(row) {
  let modelId = row.modelId;
  processView.title = "流程图";
  processView.index = modelId;
  // 发送请求，获取xml
  getBpmnXml(modelId).then(response => {
    processView.xmlData = response.data;
  })
  processView.open = true;
}

function getHistoryList() {
  history.loading = true;
  historyModel(queryHistoryParams).then(response => {
    historyTotal = response.total;
    historyList = response.rows;
    history.loading = false;
  })
}

function handleHistory(row) {
  history.open = true;
  queryHistoryParams.modelKey = row.modelKey;
  getHistoryList();
}

/** 设为最新版 */
function handleLatest(row) {
  proxy.$modal.confirm('是否确认将此版本设为最新？').then(() => {
    history.loading = true;
    latestModel({
      modelId: row.modelId
    }).then(response => {
      history.open = false;
      getList();
      proxy.$modal.msgSuccess(response.msg);
    }).finally(() => {
      history.loading = false;
    })
  })
}

function handleCurrentChange(data) {
  if (data) {
    currentRow = JSON.parse(data.content);
  }
}

function handleAdd() {
  title.value = "新增流程模型";
  const dateTime = new Date().getTime();
  form.value = {
    modelKey: `Process_${dateTime}`,
    modelName: `业务流程_${dateTime}`
  }
  open.value = true;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  title.value = "修改流程模型";
  form.value = {
    modelId: row.modelId,
    modelKey: row.modelKey,
    modelName: row.modelName,
    category: row.category,
    description: row.description
  };
  open.value = true;
}

function submitForm() {
  proxy.$refs["form"].validate(valid => {
    if (valid) {
      if (form.value.modelId !== undefined) {
        updateModel(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addModel(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 设计按钮操作 */
function handleDesigner(row) {
  designerData.title = "流程设计 - " + row.modelName;
  designerData.modelId = row.modelId;
  designerData.form = {
    processName: row.modelName,
    processKey: row.modelKey
  }
  if (row.modelId) {
    designerData.loading = true;
    getBpmnXml(row.modelId).then(response => {
      designerData.bpmnXml = response.data || '';
      designerData.loading = false;
      designerOpen = true;
    })
  }
}

function onSaveDesigner(bpmnXml) {
  bpmnXml = bpmnXml;
  let dataBody = {
    modelId: designerData.modelId,
    bpmnXml: bpmnXml
  }
  proxy.$confirm("是否将此模型保存为新版本？", "提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: '是',
    cancelButtonText: '否'
  }).then(() => {
    confirmSave(dataBody, true)
  }).catch(action => {
    if (action === 'cancel') {
      confirmSave(dataBody, false)
    }
  })
}

function confirmSave(body, newVersion) {
  designerData.loading = true;
  saveModel(Object.assign(body, {
    newVersion: newVersion
  })).then(() => {
    designerOpen = false;
    getList();
  }).finally(() => {
    designerData.loading = false;
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const modelIds = row.modelId || ids.value;
  proxy.$modal.confirm('是否确认删除模型编号为"' + modelIds + '"的数据项？').then(() => {
    loading.value = true;
    return delModel(modelIds);
  }).then(() => {
    loading.value = false;
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).finally(() => {
    loading.value = false;
  });
}

/** 导出按钮操作 */
function handleExport() {
  download('workflow/model/export', {
    ...queryParams
  }, `wf_model_${new Date().getTime()}.xlsx`)
}

/** 导入bpmn.xml文件 */
function handleImport() {
  upload.title = "bpmn20.xml文件导入";
  upload.open = true;
}

// 文件上传中处理
function handleFileUploadProgress(event, file, fileList) {
  upload.isUploading = true;
}

// 文件上传成功处理
function handleFileSuccess(response, file, fileList) {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs.upload.clearFiles();
  proxy.$message.success(response.msg);
  getList();
}

// 提交上传文件
function submitFileForm() {
  proxy.$refs.uploadForm.validate(valid => {
    if (valid) {
      proxy.$refs.upload.submit();
    }
  });
}

function categoryFormat(row, column) {
  return categoryOptions.find(k => k.code === row.category)?.categoryName ?? '';
}

function submitSave() {
  getList();
}


getCategoryList();
getList();

</script>
