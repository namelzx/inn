import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/images/upload',
    method: 'post',
    data
  })
}
