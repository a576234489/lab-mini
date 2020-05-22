import request from './network.js'
import postRequest from './postNetwork.js'

export function fetchGetList(data){
  return request({
    url: '/equipment/findByEquipments',
    method: 'get',
    data: data
  })
}
export function fetchGetDetail(data){
  return request({
    url: '/equipment/findByEquipmentInfo',
    data: data,
    method: 'get'
  })
}
export function fetchGetEquipOpenTime(data) {
  return request({
    url: '/equipment/findByDailyOpenTime',
    method: 'get',
    data
  })
}
export function fetchAppoint(data){
  return postRequest({
    url: '/equipment/appointment',
    method: 'post',
    data
  })
}
