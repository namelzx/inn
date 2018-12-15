import request from '@/utils/request'

export function PostByData(data) {
  return request({
    url: '/News/PostByData',
    method: 'post',
    data
  })
}
export function fetchList(query) {
  return request({
    url: '/News/getBylist',
    method: 'get',
    params: query
  })
}

export function Delete(id) {
  return request({
    url: '/News/delete',
    method: 'get',
    params: { id }
  })
}
export function detail(id) {
  return request({
    url: '/News/detail',
    method: 'get',
    params: { id }
  })
}
export function getImages(id) {
  return request({
    url: '/News/getImages',
    method: 'get',
    params: { id }
  })
}
export function label() {
  return request({
    url: '/News/label',
    method: 'get'
  })
}

export function setStatus(data) {
  return request({
    url: '/News/setStatus',
    method: 'post',
    data
  })
}
