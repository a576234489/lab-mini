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
//获取首页倒计时
export function fetchGetCountdown(data) {
  return request({
    url: '/equipment/findByAppointmentCountDown',
    method: 'get',
    data
  })
}
