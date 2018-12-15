import request from '@/utils/request'

export function getlist(query) {
  return request({
    url: '/Advertising/getlist',
    method: 'get',
    params: query
  })
}
// 修改用户审核状态
export function statusSk(data) {
  return request({
    url: '/Advertising/setStatus',
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/Advertising/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/Advertising/update',
    method: 'post',
    data
  })
}

//  删除技能
export function Delete(id) {
  return request({
    url: '/Advertising/delete',
    method: 'get',
    params: { id }
  })
}

//  删除技能
export function userlist() {
  return request({
    url: '/Advertising/userlist',
    method: 'get'
  })
}

