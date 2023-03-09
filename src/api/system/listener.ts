import request from '@/utils/request'

// @ts-ignore 查询流程监听列表
export function listListener(query) {
  return request({
    url: '/system/listener/list',
    method: 'get',
    params: query
  })
}

// @ts-ignore 查询流程监听详细
export function getListener(id) {
  return request({
    url: '/system/listener/' + id,
    method: 'get'
  })
}

// @ts-ignore 新增流程监听
export function addListener(data) {
  return request({
    url: '/system/listener',
    method: 'post',
    data: data
  })
}

// @ts-ignore 修改流程监听
export function updateListener(data) {
  return request({
    url: '/system/listener',
    method: 'put',
    data: data
  })
}

// @ts-ignore 删除流程监听
export function delListener(id) {
  return request({
    url: '/system/listener/' + id,
    method: 'delete'
  })
}
