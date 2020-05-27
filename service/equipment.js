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
export function fetchMaintainEquip(data){
  return postRequest({
    url: '/equipment/repairEquipemnt',
    method: 'post',
    data
  })
}
export function fetchMaintainEquipComplete(data){
  return postRequest({
    url: '/equipment/repairEquipemntComplete',
    method: 'post',
    data
  })
}
export function fetchGetMainTainList(data){
  return request({
    url: '/equipment/findByRepairRecords',
    method: 'get',
    data
  })
}
export function fetchGetMainTainDetail(data){
  return request({
    url: '/equipment/findByRepairRecordInfo',
    method: 'get',
    data
  })
}
//获取待维修设备列表
export function fetchGetMyMainTainList(data){
  return request({
    url: '/equipment/findWaitForByRepairRecords',
    method: 'get',
    data
  })
}

