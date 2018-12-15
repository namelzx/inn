import request from '@/utils/request'

export function AreaList(query) {
  return request({
    url: '/area/index',
    method: 'get',
    params: query
  })
}
// 修改用户审核状态
export function statusUser(data) {
  return request({
    url: '/user/setUserStatus',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createData(data) {
  return request({
    url: '/area/create',
    method: 'post',
    data
  })
}
// 修改技能
export function update(data) {
  return request({
    url: '/area/update',
    method: 'post',
    data
  })
}
//  删除技能
export function Delete(id) {
  return request({
    url: '/area/delete',
    method: 'get',
    params: { id }
  })
}
// 修改技能审核状态
export function Editstatus(data) {
  return request({
    url: '/area/setAreaSk',
    method: 'post',
    data
  })
}

