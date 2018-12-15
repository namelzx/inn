import request from '@/utils/request'

export function SkillsList(query) {
  return request({
    url: '/skills/audit_skills',
    method: 'get',
    params: query
  })
}

// 修改用户提交数据
export function updateData(data) {
  return request({
    url: '/skills/updateData',
    method: 'post',
    data
  })
}
// 获取所有的技能
export function getSkillsitem(query) {
  return request({
    url: '/skills/getSkillsByItem',
    method: 'get',
    params: query
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}
// 添加技能
export function createSkills(data) {
  return request({
    url: '/skills/create',
    method: 'post',
    data
  })
}

// 修改技能
export function updateSkills(data) {
  return request({
    url: '/skills/update',
    method: 'post',
    data
  })
}
//  删除技能
export function DeleteSkills(id) {
  return request({
    url: '/skills/delete',
    method: 'get',
    params: { id }
  })
}
// 修改技能审核状态
export function statusSk(data) {
  return request({
    url: '/skills/setSkissSk',
    method: 'post',
    data
  })
}
// 修改用户技能审核状态
export function statusSkills(data) {
  return request({
    url: '/skills/setSkissStatus',
    method: 'post',
    data
  })
}
