import { http } from '@/utils/http'
import type { LoginResult } from '@/types/member'

type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}
export const postLoginHttp = (data: LoginParams) => {
  return http({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

// 模拟登入
export const postSimpleLoginHttp = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}
