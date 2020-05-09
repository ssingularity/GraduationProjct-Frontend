import request from "@/utils/request";

export function login(data) {
  const params = new FormData();
  params.append("username", data.username);
  params.append("password", data.password);
  return request({
    url: '/user-service/login',
    method: 'post',
    data: params
  })
}

export function getInfo() {
  return request({
    url: '/user-service/user/self',
    method: 'get'
  })
}

export function logout() {
  // TODO logout
}
