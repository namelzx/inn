import request from '@/utils/request'

export function LoabrList(query) {
  return request({
    url: '/shop/Labor',
    method: 'get',
    params: query
  })
}
// 创建
export function createData(data) {
  return request({
    url: '/shop/create',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/shop/update',
    method: 'post',
    data
  })
}
//  删除
export function Delete(id) {
  return request({
    url: '/shop/delete',
    method: 'get',
    params: { id }
  })
}
// 修改状态
export function Editstatus(data) {
  return request({
    url: '/shop/setLaborSk',
    method: 'post',
    data
  })
}

