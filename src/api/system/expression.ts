import request from '@/utils/request'

// @ts-ignore 查询流程达式列表
export function listExpression(query) {
  return request({
    url: '/system/expression/list',
    method: 'get',
    params: query
  })
}

// @ts-ignore 查询流程达式详细
export function getExpression(id) {
  return request({
    url: '/system/expression/' + id,
    method: 'get'
  })
}

// @ts-ignore 新增流程达式
export function addExpression(data) {
  return request({
    url: '/system/expression',
    method: 'post',
    data: data
  })
}

// @ts-ignore 修改流程达式
export function updateExpression(data) {
  return request({
    url: '/system/expression',
    method: 'put',
    data: data
  })
}

// @ts-ignore 删除流程达式
export function delExpression(id) {
  return request({
    url: '/system/expression/' + id,
    method: 'delete'
  })
}
