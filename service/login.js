import request from './network'

export function fetchLogin(username,password){
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}
export function fetchTestWx(username,password){
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}
export function fetchWxLogin(code){
  return request({
    url: '/user/wxlogin',
    method: 'get',
    data: {
      code
    }
  })
}
export function fetchGetUserInfo(userId) {
  return request({
    url: '/user/findByUserInfo',
    method: 'get',
    data: {
      userId
    }
  })
}