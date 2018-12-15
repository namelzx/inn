import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/getArticleBylist',
    method: 'get',
    params: query
  })
}
export function getwxArticleBylist(query) {
  return request({
    url: '/article/getwxArticleBylist',
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

export function Articlecreate(data) {
  return request({
    url: '/article/postArticleBycreate',
    method: 'post',
    data
  })
}
//  删除
export function Delete(id) {
  return request({
    url: '/article/delete',
    method: 'get',
    params: { id }
  })
}
export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
