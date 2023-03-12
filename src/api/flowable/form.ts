import request from '@/utils/request'

// @ts-ignore 查询流程表单列表
export function listForm(query) {
  return request({
    url: '/flowable/form/list',
    method: 'get',
    params: query
  })
}
// @ts-ignore
export function listAllForm(query) {
  return request({
    url: '/flowable/form/formList',
    method: 'get',
    params: query
  })
}

// @ts-ignore 查询流程表单详细
export function getForm(formId) {
  return request({
    url: '/flowable/form/' + formId,
    method: 'get'
  })
}

// @ts-ignore 新增流程表单
export function addForm(data) {
  return request({
    url: '/flowable/form',
    method: 'post',
    data: data
  })
}

// @ts-ignore 修改流程表单
export function updateForm(data) {
  return request({
    url: '/flowable/form',
    method: 'put',
    data: data
  })
}
// @ts-ignore 挂载表单
export function addDeployForm(data) {
  return request({
    url: '/flowable/form/addDeployForm',
    method: 'post',
    data: data
  })
}

// @ts-ignore 删除流程表单
export function delForm(formId) {
  return request({
    url: '/flowable/form/' + formId,
    method: 'delete'
  })
}

// @ts-ignore 导出流程表单
export function exportForm(query) {
  return request({
    url: '/flowable/form/export',
    method: 'get',
    params: query
  })
}
