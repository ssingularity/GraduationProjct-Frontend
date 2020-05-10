import request from "@/utils/request";

import store from "@/store";

export function registerDataSource(data) {
  data.owner = store.getters.name;
  return request({
    url: '/datasource-service/datasource',
    method: 'post',
    data
  })
}

export function getAllDataSource() {
  return request({
    url: '/datasource-service/datasource',
    method: 'get'
  })
}
