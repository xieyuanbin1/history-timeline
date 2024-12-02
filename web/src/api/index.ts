import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
  code: number;
  msg: string;
  data?: any;
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
  data?: T;
}

const URL = '/api'
enum RequestEnums {
  TIMEOUT = 30000,
  OVERDUE = 600, // 登录失效
  FAIL = 1, // 请求失败
  SUCCESS = 0, // 请求成功
}
const config: AxiosRequestConfig = {
  // 默认地址
  baseURL: URL,
  // 设置超时时间
  timeout: RequestEnums.TIMEOUT,
  // 跨域时候允许携带凭证
  withCredentials: true
}

class RequestHttp {
  service: AxiosInstance;
  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)

    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验: 接受服务器返回的token, 存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: any) => {
        const token = sessionStorage.getItem('token') || '';
        return {
          ...config,
          headers: {
            'token': token, // 请求头中携带token信息
          }
        }
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )

    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response; // 解构
        if (data.code === RequestEnums.OVERDUE) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          sessionStorage.removeItem('token');
          // router.replace({
          //   path: '/login'
          // })
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          // 此处也可以使用组件提示报错信息
          console.error(data.msg);
          return Promise.reject(data)
        }
        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
        }
        if (!window.navigator.onLine) {
          // 网络连接失败
          // 可以跳转到错误页面，也可以不做操作
          // return router.replace({
          //   path: '/404'
          // });
        }
      }
    )
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.get(url, { params });
  }
  post<T>(url: string, body?: object): Promise<ResultData<T>> {
    return this.service.post(url, body);
  }
}

// 导出一个实例对象
export const request = new RequestHttp(config);
