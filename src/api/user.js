import request from '@/utils/request'

export function UserList(query) {
  return request({
    url: '/user/userAudit',
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

// 修改用户类型
export function SetByType(data) {
  return request({
    url: '/user/SetByType',
    method: 'post',
    data
  })
}

export function Userlevel(query) {
  return request({
    url: '/user/user_level',
    method: 'get',
    params: query
  })
}
export function setUserbyUpdate(data) {
  return request({
    url: '/user/setUserbyUpdate',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function create(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

//  删除技能
export function Delete(id) {
  return request({
    url: '/user/delete',
    method: 'get',
    params: { id }
  })
}
export function getUserListbyData(query) {
  return request({
    url: '/user/getUserListbyData',
    method: 'get',
    params: query
  })
}
export function PostAwardedByData(data) {
  return request({
    url: '/user/PostAwardedByData',
    method: 'post',
    data
  })
}
export function GetAwardeByList(query) {
  return request({
    url: '/user/GetAwardeByList',
    method: 'get',
    params: query
  })
}

export function GetRedfedeByFind(query) {
  return request({
    url: '/user/GetRedfedeByFind',
    method: 'get',
    params: query
  })
}

export function SetRedfeByAdd(query) {
  return request({
    url: '/user/SetRedfeByAdd',
    method: 'get',
    params: query
  })
}
