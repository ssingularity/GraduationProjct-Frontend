import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import {getToken} from '@/utils/auth';

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
});

request.interceptors.request.use(
  config => {
    if (getToken() != null) {
      config.headers['Authorization'] = getToken();
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });

      if (res.code === 401) {
        MessageBox.confirm('您尚未登录', '尚未登录', {
          confirmButtonText: '登录',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            name: 'Login'
          });
        })
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res
    }
  }
);

export default request;
