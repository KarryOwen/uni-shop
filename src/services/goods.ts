import { http } from '@/utils/http'
import type { GoodsResult } from '@/types/goods'
export const getGoodsHttp = (id: string) => {
  return http<GoodsResult>({
    url: '/goods',
    method: 'GET',
    data: { id },
  })
}
