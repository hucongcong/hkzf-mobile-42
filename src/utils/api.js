import axios from 'axios'
import { BASE_URL } from './config'
import { removeToken, getToken } from './token'
const API = axios.create({
  baseURL: BASE_URL
})

// 配置请求拦截器
API.interceptors.request.use(config => {
  // console.log('config', config)
  // 判断路径是否已user开头，并且不能是登陆和注册接口
  if (
    config.url.startsWith('user') &&
    !config.url.startsWith('user/login') &&
    !config.url.startsWith('user/registered')
  ) {
    // 给config配置token
    config.headers.authorization = getToken()
  }
  return config
})

// 配置响应的拦截器
API.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    // 添加一个额外的判断，判断状态码是否是400，如果是400，说明token过期或者无效
    if (response.data.status === 400) {
      removeToken()
    }
    return response.data
  },
  function(error) {
    return Promise.reject(error)
  }
)

export { API }
