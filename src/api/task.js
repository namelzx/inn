import request from '@/utils/request'
// 获取所有的技能
export function getTaskitem(query) {
  return request({
    url: '/Task/getTaskByItem',
    method: 'get',
    params: query
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}
// 添加技能
export function createSkills(data) {
  return request({
    url: '/skills/create',
    method: 'post',
    data
  })
}

// 修改技能
export function update(data) {
  return request({
    url: '/Task/update',
    method: 'post',
    data
  })
}
//  删除技能
export function Delete(id) {
  return request({
    url: '/task/delete',
    method: 'get',
    params: { id }
  })
}
// 修改技能审核状态
export function statusSk(data) {
  return request({
    url: '/skills/setSkissSk',
    method: 'post',
    data
  })
}
// 修改用户技能审核状态
export function statusSkills(data) {
  return request({
    url: '/skills/setSkissStatus',
    method: 'post',
    data
  })
}
