// ajax 封装插件, 使用 axios
import Vue from 'vue'
import axios from 'axios'
import Config from '@/config'
// import ErrorCode from '@/config/error-code'
import store from '@/store'
import { getToken } from '@/lin/util/token'

const config = {
  baseURL: Config.baseURL || process.env.apiUrl || '',
  timeout: 5 * 1000, // 请求超时时间设置
  crossDomain: true,
  // withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status) {
    return status >= 200 && status < 510
  },
}

/**
 * 错误码是否是token相关
 * @param {number} code 错误码
 * 10100 过期
 * 10101 不存在
 */
function accessTokenException(code) {
  let flag = false
  const codes = [10100, 10101]
  if (codes.includes(code)) {
    flag = true
  }
  return flag
}

// 创建请求实例
const _axios = axios.create(config)

_axios.interceptors.request.use(
  originConfig => {
    // 有 API 请求重新计时
    Vue.prototype.$_lin_jump()

    const reqConfig = { ...originConfig }

    // step1: 容错处理
    if (!reqConfig.url) {
      /* eslint-disable-next-line */
      console.error('request need url')
      throw new Error({
        source: 'axiosInterceptors',
        message: 'request need url',
      })
    }

    if (!reqConfig.method) {
      // 默认使用 get 请求
      reqConfig.method = 'get'
    }
    // 大小写容错
    reqConfig.method = reqConfig.method.toLowerCase()

    // 参数容错
    if (reqConfig.method === 'get') {
      if (!reqConfig.params) {
        // 防止字段用错
        reqConfig.params = reqConfig.data || {}
      }
    } else if (reqConfig.method === 'post') {
      if (!reqConfig.data) {
        // 防止字段用错
        reqConfig.data = reqConfig.params || {}
      }

      // 检测是否包含文件类型, 若包含则进行 formData 封装
      let hasFile = false
      Object.keys(reqConfig.data).forEach(key => {
        if (typeof reqConfig.data[key] === 'object') {
          const item = reqConfig.data[key]
          if (item instanceof FileList || item instanceof File || item instanceof Blob) {
            hasFile = true
          }
        }
      })

      // 检测到存在文件使用 FormData 提交数据
      if (hasFile) {
        const formData = new FormData()
        Object.keys(reqConfig.data).forEach(key => {
          formData.append(key, reqConfig.data[key])
        })
        reqConfig.data = formData
      }
    }
    // 防止字段用错
    if (!reqConfig.data) {
      // 防止字段用错
      reqConfig.data = reqConfig.params || {}
    }
    // step2: permission 处理
    if (reqConfig.url === 'cms/user/refresh') {
      const refreshToken = getToken('refresh_token')
      if (refreshToken) {
        // eslint-disable-next-line no-param-reassign
        reqConfig.headers.Authorization = refreshToken
      }
    } else {
      // 有access_token
      const accessToken = getToken('access_token')
      if (accessToken) {
        // eslint-disable-next-line no-param-reassign
        reqConfig.headers.Authorization = accessToken
        reqConfig.headers.TargetType = 1 // 登录类型 后台
      }
    }
    return reqConfig
  },
  error => {
    Promise.reject(error)
  },
)

// 响应拦截器
_axios.interceptors.response.use(
  async res => {
    let { code, message } = res.data // eslint-disable-line
    if (res.status.toString().charAt(0) === '2') {
      return res.data
    }
    return new Promise(async (resolve, reject) => {
      // const { url } = res.config

      // refreshToken相关，直接登出
      if (accessTokenException(code)) {
        setTimeout(() => {
          store.dispatch('loginOut')
          const { origin } = window.location
          window.location.href = origin
        }, 1500)
        return resolve(null)
      }
      // 全部采用后端错误处理
      Vue.prototype.$message({
        message,
        type: 'error',
      })
      console.log(1)
      reject()
    })
  },
  error => {
    if (!error.response) {
      Vue.prototype.$notify({
        title: 'Network Error',
        dangerouslyUseHTMLString: true,
        message: '<strong class="my-notify">请检查 API 是否异常</strong>',
      })
      console.log('error', error)
    }
    console.log(2)

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Vue.prototype.$message({
        type: 'warning',
        message: '请求超时',
      })
    }
    return Promise.reject(error)
  },
)

// eslint-disable-next-line
Plugin.install = function(Vue, options) {
  // eslint-disable-next-line
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      },
    },
    $axios: {
      get() {
        return _axios
      },
    },
  })
}

if (!Vue.axios) {
  Vue.use(Plugin)
}

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post(url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put(url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete(url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params,
  })
}

export default _axios
