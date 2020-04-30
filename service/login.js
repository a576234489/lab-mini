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