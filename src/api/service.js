import request from "@/utils/request";

export function createService(data) {
  return request({
    url: '/service-management/service',
    method: 'post',
    data
  })
}

export function getServiceList() {
  return request({
    url: '/service-management/service',
    method: 'get'
  })
}

export function getServiceById(id) {
  return request({
    url: `/service-management/service/${id}`,
    method: 'get'
  })
}
