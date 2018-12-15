import request from '@/utils/request'

export function getbylist(query) {
  return request({
    url: '/Config/hotwordsGetbyList',
    method: 'get',
    params: query
  })
}
//  删除
export function Delete(id) {
  return request({
    url: '/Config/hotwordsGetbydelete',
    method: 'get',
    params: { id }
  })
}

export function setStatus(data) {
  return request({
    url: '/Config/hotwordssetStatus',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/Config/update',
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/Config/create',
    method: 'post',
    data
  })
}

