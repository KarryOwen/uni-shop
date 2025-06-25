import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'

type HotParams = PageParams & { subType?: string }
export const getHotHttp = (url: string, data?: HotParams) => {
  return http<HotResult>({
    url,
    data,
    method: 'GET',
  })
}
