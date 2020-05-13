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

export function getMyDataSource() {
  let data = {
    username: store.getters.name
  };
  return request({
    url: '/datasource-service/datasource/mine',
    method: 'get',
    params: data
  })
}

export function getMyAuthorizedDataSource() {
  let username = store.getters.name;
  return request({
    url: `/user-service/user/${username}/datasource`,
    method: 'get'
  }).then(response => {
      return Promise.resolve(getDataSourceBatch(response.data))
    })
}

export function getDataSourceBatch(data) {
  return request({
    url: '/datasource-service/datasource/batch',
    method: 'post',
    data
  })
}

export function subscribeDataSource(dataSource) {
  let body = {
    username: store.getters.name,
    resourceId: dataSource.id,
    resourceTopic: dataSource.topic,
    resourceName: dataSource.name,
    resourceDescription: dataSource.description,
    resourceOwner: dataSource.owner,
    status: 'PENDING'
  };
  return request({
    url: '/user-service/subscription',
    method: 'post',
    data: body
  })
}

export function getMySubscription() {
  return request({
    url: '/user-service/subscription/mine',
    method: 'get'
  })
}

export function getSubscriptionToSolve() {
  return request({
    url: '/user-service/subscription/toSolve',
    method: 'get'
  })
}

export function modifyStatus(id, status) {
  let data = {
    status
  };
  return request({
    url: `/user-service/subscription/${id}/status`,
    method: 'put',
    params: data
  })
}
