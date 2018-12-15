import request from '@/utils/request'

export function AdminList(query) {
  return request({
    url: '/adminuser/getDataBylist',
    method: 'get',
    params: query
  })
}
export function AdminSele() {
  return request({
    url: '/adminuser/getSelete',
    method: 'get'
  })
}
export function dele(id) {
  return request({
    url: '/adminuser/del',
    method: 'get',
    params: { id }
  })
}
export function update(data) {
  return request({
    url: '/adminuser/update',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/adminuser/add',
    method: 'post',
    data
  })
}
export function statusAD(data) {
  return request({
    url: '/adminuser/status',
    method: 'post',
    data
  })
}
