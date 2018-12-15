import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/index/dashboard',
    method: 'get'
  })
}
