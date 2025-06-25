import { useMemberStore } from '@/stores'
const memberStore = useMemberStore()

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const httpIntercepter = {
  invoke(options: UniApp.RequestOptions) {
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 请求超时
    options.timeout = 10000
    // header配置
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // token配置
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    // console.log(options)
  },
}
uni.addInterceptor('request', httpIntercepter)
uni.addInterceptor('uploadFile', httpIntercepter)

interface Data<T> {
  code: string
  mes: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        //请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        }
        // 用户信息出现错误
        else if (res.statusCode === 401) {
          memberStore.clearProfile()
          uni.navigateTo({ url: '/login' })
          reject(res)
        }
        // 提示错误
        else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).mes || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败： 一般是网络错误
      fail(arr) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(arr)
      },
    })
  })
}
