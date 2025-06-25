import { http } from '@/utils/http'
import type { ProfileDetail } from '@/types/member'
import type { ProfileParams } from '@/types/member'

export const getProfileHttp = (token: string) => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
    data: {
      token,
    },
  })
}

/**
 * 修改个人信息
 * @param data 请求体参数
 */
export const putMemberProfileAPI = (data: ProfileParams) => {
  return http<ProfileDetail>({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
}
