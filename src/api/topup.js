import request from '@/utils/request'

export function tupuplist(query) {
  return request({
    url: '/topup/withdrawal',
    method: 'get',
    params: query
  })
}
//  提现
export function withsuccess(data) {
  return request({
    url: '/topup/withsuccess',
    method: 'post',
    data
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
