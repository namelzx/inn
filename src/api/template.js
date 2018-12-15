import request from '@/utils/request'

export function posttemplate(data) {
  return request({
    url: '/Template/warningTemplate',
    method: 'post',
    data
  })
}

