import request from './network.js'
import postRequest from './postNetwork.js'

export function fetchGetAppoint(data){
  return request({
    url: '/equipment/findByAppointments',
    method: 'get',
    data: data
  })
}
export function fetchGetAppointDetail(data){
  return request({
    url: '/equipment/findByAppointmentInfo',
    method: 'get',
    data: data
  })
}
export function fetchCancelAppoint(data){
  return request({
    url: '/equipment/updateAppointmentStatus',
    method: 'post',
    data: data
  })
}
