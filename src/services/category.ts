import { http } from '@/utils/http'
import type { CategoryTopItem } from '@/types/category'
export const getCatoryHttp = () => {
  return http<CategoryTopItem[]>({
    url: '/category/top',
    method: 'GET',
  })
}
