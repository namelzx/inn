import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/getConfigBylist',
    method: 'get',
    params: query
  })
}

export function wxfetchList(query) {
  return request({
    url: '/article/getwxConfigBylist',
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
export function Configupdate(data) {
  return request({
    url: '/article/Configupdate',
    method: 'post',
    data
  })
}
export function ConfigCreate(data) {
  return request({
    url: '/article/ConfigCreate',
    method: 'post',
    data
  })
}
//  删除
export function ConfigDelele(id) {
  return request({
    url: '/article/ConfigDelele',
    method: 'get',
    params: { id }
  })
}
export function ConfigStatus(data) {
  return request({
    url: '/article/ConfigStatus',
    method: 'post',
    data
  })
}
export function ConfigTask() {
  return request({
    url: '/article/ConfigTask',
    method: 'get'

  })
}
