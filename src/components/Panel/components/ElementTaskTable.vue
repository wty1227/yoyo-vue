<template>
  <n-collapse-item name="task-table">
    <template #header>
      <collapse-title :title="$t('panel.taskTable')">
        <lucide-icon name="Info"/>
      </collapse-title>
    </template>

    <edit-item key="condition" :label="$t('panel.onlineTable')" :label-width="120">
      <n-select
          label-field="formName"
          value-field="formId"
          :options="state.formList"
      />
    </edit-item>
    <edit-item key="executable" :label="$t('panel.editable')">
      <n-switch v-model:value="state.elementExecutable" @update:value="state.updateElementExecutable"/>
    </edit-item>
    <n-divider/>
    <n-data-table
        style="color:orange"
        :columns="state.columns"
        :data="state.buttonData"
        :bordered="false"
    />
    <n-button type="info" class="inline-large-button" secondary @click="openButtonModel">
      <lucide-icon :size="20" name="Plus" />
      <span>{{ $t('panel.addButton') }}</span>
    </n-button>

    <n-modal
        v-model:show="state.modelVisible"
        preset="dialog"
        :title="$t('panel.addButton')"
        :style="{ width: '520px' }"
    >
      <n-form  label-placement="left"
               label-width="auto"
               ref="formRef" :model="state.newProperty" :rules="state.rules" aria-modal="true">

        <n-form-item path="btnType" :label="$t('panel.buttonType')">
          <n-select
              v-model:value="state.newProperty.btnType"
              :options="btnTypeList"
              @update:value="handleUpdateValue"
          />
        </n-form-item>

        <n-form-item path="btnName" :label="$t('panel.buttonName')">
          <n-input v-model:value="state.newProperty.btnName" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="updateStatus" :label="$t('panel.updateStatus')">
          <n-select
              v-model:value="state.newProperty.updateStatus"
              :options="updateStatusList"
          />
        </n-form-item>
        <n-form-item path="updateStatus" :label="$t('panel.updateStatus')">
          <n-input-number v-model:value="state.newProperty.orderNum" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button size="small" type="info" @click="addProperty">{{ $t('panel.confirm') }}</n-button>
      </template>
    </n-modal>

    <!--    <edit-item :label="$t('panel.id')">-->
    <!--      <n-input v-model:value="elementId" maxlength="32" @change="updateElementId" />-->
    <!--    </edit-item>-->

    <!--    <edit-item :label="$t('panel.name')">-->
    <!--      <n-input v-model:value="elementName" maxlength="20" @change="updateElementName" />-->
    <!--    </edit-item>-->

    <!--    <template v-if="isProcess">-->
    <!--      <edit-item key="version" :label="$t('panel.version')">-->
    <!--        <n-input v-model:value="elementVersion" maxlength="20" @change="updateElementVersion" />-->
    <!--      </edit-item>-->

    <!--      <edit-item key="executable" :label="$t('panel.executable')">-->
    <!--        <n-switch v-model:value="elementExecutable" @update:value="updateElementExecutable" />-->
    <!--      </edit-item>-->
    <!--    </template>-->
  </n-collapse-item>
</template>

<script setup lang="ts" name="ElementGenerations">
import {defineComponent, onMounted, reactive} from 'vue'
import {mapState} from 'pinia'
import modelerStore from '@/store/modeler'
import {Base} from 'diagram-js/lib/model'
import {getNameValue, setNameValue} from '@/bo-utils/nameUtil'
import {setIdValue} from '@/bo-utils/idUtil'
import {
  getProcessExecutable,
  getProcessVersionTag,
  setProcessExecutable,
  setProcessVersionTag
} from '@/bo-utils/processUtil'
import EventEmitter from '@/utils/EventEmitter'
import {listAllForm} from "@/api/flowable/form";
import {NTag, SelectOption} from "naive-ui";
import {h} from 'vue'

// const btnTypeMap:any = {
//   0: {
//     text: '同意'
//   },
//   1: {
//     text: '拒绝'
//   }
// }
const btnTypeList = [
  {label: '同意', value: 0},
  {label: '拒绝', value: 1},
  {label: '驳回', value: 2},
  {label: '驳回到起点', value: 3},
  {label: '驳回到历史任务', value: 4},
  {label: '撤销', value: 5},
  {label: '转办', value: 6},
  {label: '加签', value: 7},
  {label: '减签', value: 8},
  {label: '保存', value: 8},
  {label: '终止', value: 8},
  {label: '会签', value: 8},
  {label: '同意（会签）', value: 9},
  {label: '拒绝（会签）', value: 10},
  {label: '弃权（会签）', value: 11},
  {label: '指定审批人', value: 12},
  {label: '自由跳', value: 13},
]
const updateStatusList = [
  {label: '不更新', value: 0},
  {label: '同意', value: 1},
  {label: '拒绝', value: 2},
  {label: '驳回', value: 3},
  {label: '会签同意', value: 4},
]
const state = reactive({
  elementName: '',
  elementVersion: '',
  elementExecutable: true,
  isProcess: false,

  newProperty: { btnType: null, btnName: '', updateStatus: null, orderNum: 0,  name: '', value: '' },
  rules: {
    btnType: { required: true, message: '不能为空', trigger: ['blur', 'change'] },
    btnName: { required: true, message: '不能为空', trigger: ['blur', 'change'] }
  },
  modelVisible: false,

  formList: [],
  columns: [{
    title: '按钮名称',
    key: 'btnName',
    render(row: any) {
      return h('a', {
        style: {
          'text-decoration': 'underline',
          color:'orange'
        },
        onClick: ()=>{window.__messageBox.info('123')}},`${row.btnName}`)
    }
  }, {
    title: '样式',
    key: 'btnType',
    render(row: any) {
      return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'info',
            bordered: false
          },
          {
            default: () => {
              return btnTypeFilter(row.btnType)
            }
          }
      )
    }
  }, {
    title: '值',
    key: 'orderNum'
  }],


  buttonData: [{
    id: 1,
    btnType: 0,
    btnName: '同意',
    orderNum: 0,
    updateStatus: false
  }]
});

// computed: {
//   ...mapState(modelerStore, ['getActive', 'getActiveId'])
// },

function onMounted() {
  getListForm();
}

function btnTypeFilter(val: number) {
  // debugger
  const tmp = btnTypeList.filter(item => item.value === val)
  return tmp.length > 0 && tmp[0].label
      //btnTypeMap[val].text;
}

// 获取表单信息
function getListForm() {
  listAllForm(null).then(res => {
    res.data.forEach((item:any) => {
      item.formId = item.formId.toString();
    })
    state.formList = res.data;
  })
}

function openButtonModel() {
  state.modelVisible = true
}
function  handleUpdateValue (value: string, option: SelectOption) {
  // message.info('value: ' + JSON.stringify(value))
  // message.info('option: ' + JSON.stringify(option))
  state.newProperty.btnName = option.label;
}

</script>
