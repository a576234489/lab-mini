import request from './network.js'

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
