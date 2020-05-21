import store from '@/store'
import request from "@/utils/request";

export function createProcess(data) {
  data.owner = store.getters.name;
  data.status = 'STOPPED';
  return request({
    url: '/process-service/process',
    method: 'post',
    data
  })
}

export function getMyProcess() {
  let data = {
    username: store.getters.name
  };
  return request({
    url: '/process-service/process/mine',
    method: 'get',
    params: data
  })
}

export function getProcess(id) {
  return request({
    url: `/process-service/process/${id}`,
    method: 'get'
  })
}

export function startProcess(id) {
  return request({
    url: `/process-service/process/${id}/start`,
    method: 'post'
  })
}

export function stopProcess(id) {
  return request({
    url: `/process-service/process/${id}/stop`,
    method: 'post'
  })
}
