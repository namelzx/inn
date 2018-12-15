import request from '@/utils/request'

export function trainingList(query) {
  return request({
    url: '/training/getTrainingBylist',
    method: 'get',
    params: query
  })
}

// 获取报名列表
export function logTraining(query) {
  return request({
    url: '/training/logTraining',
    method: 'get',
    params: query
  })
}

// 获取详情
export function detailTraining(id) {
  return request({
    url: '/training/getTrainingBydetail',
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

export function createTraining(data) {
  return request({
    url: '/training/postTrainingBycreate',
    method: 'post',
    data
  })
}
//  删除
export function Delete(id) {
  return request({
    url: '/training/delete',
    method: 'get',
    params: { id }
  })
}
export function updateTraining(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
export function setTrainingSk(data) {
  return request({
    url: '/training/setTrainingSk',
    method: 'post',
    data
  })
}
