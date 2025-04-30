// src/api/api.js
import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8081/api', // 你的 API 基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    // 'Content-Type': 'application/json'
    // 可以在这里添加全局 headers，如认证 token
    // 'Authorization': 'Bearer your-token'
  }
})

/**
 * 关于拦截器中return的是什么,是.then(response=>{..})中的response
 * 是.catch(err=>{..}) 或 catch(error){..}中的err
 */
// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：添加 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 关于response和error是什么,区别在哪里
 * 成功（then）：状态码为 2xx，直接接收 response
 *   大约有{
 *   data: {...},    // 响应体（如后端返回的 JSON）
 *   status: 200,    // HTTP 状态码
 *   statusText: 'OK',
 *   headers: {...}, // 响应头
 *   config: {...},  // 请求配置
 *   request: {...}  // 原始请求对象
 * }系列信息
 * 失败（catch）：状态码为 4xx/5xx，response同上 被包裹在 error 对象中（即 error.response,进一步封装）
 *  error对象大约有
 * {
 *   config: {...},    // 请求配置
 *   request: {...},   // XMLHttpRequest 对象
 *   response: {       // 响应详情
 *     status: 404,    // HTTP 状态码
 *     data: {...},    // 响应体（你的 {code:500,message:"..."} 就在这里）
 *     headers: {...},
 *     config: {...}
 *   },
 *   isAxiosError: true
 * }服务器response转化成的对象 + 关于错误的所有信息
 *
 */
api.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          break
        case 404:
          // 处理未找到
          break
        // 其他状态码处理
      }
    }
    /**
     * 这个仅仅是将其标记了下,使其可以触发.catch,可以简单看成激活
     */
    return Promise.reject(error.response.data)// 这里假设网络通畅,仅处理500和错误状态码的情况
  }
)

export default api
