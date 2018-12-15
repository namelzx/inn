import request from '@/utils/request'

export function getBannerbylist(query) {
  return request({
    url: '/banner/getBannerbylist',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/getArticleBydetail',
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
    url: '/Banner/create',
    method: 'post',
    data
  })
}
//  删除
export function Delete(id) {
  return request({
    url: '/Banner/delete',
    method: 'get',
    params: { id }
  })
}
export function update(data) {
  return request({
    url: '/Banner/update',
    method: 'post',
    data
  })
}
// 修改用户审核状态
export function setStatus(data) {
  return request({
    url: '/Banner/setStatus',
    method: 'post',
    data
  })
}
