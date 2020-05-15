import request from './network'

export function fetchGetBanner(){
  return request({
    url: '/banner/findByBanners',
    method: 'get'
  })
}
export function fetchGetNotice(){
  return request({
    url: '/notice/findByNotices',
    method: 'get'
  })
}
