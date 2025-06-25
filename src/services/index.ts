import { http } from '@/utils/http'
import type { BannerItem, CategoryItem, HotItem, GuessItem } from '@/types/index'
import type { PageParams, PageResult } from '@/types/global'
// 获取banner
export const getHomeBarHttp = (distributionSite = 1) => {
  return http<BannerItem[]>({
    url: '/home/banner',
    method: 'GET',
    data: {
      distributionSite,
    },
  })
}

// /home/category/mutli
export const getHomeCategoryHttp = () => {
  return http<CategoryItem[]>({
    url: '/home/category/mutli',
    method: 'GET',
  })
}

// /home/hot/mutli
export const getHomeHotHttp = () => {
  return http<HotItem[]>({
    url: '/home/hot/mutli',
    method: 'GET',
  })
}
///home/goods/guessLike
export const getHomeguessLikeHttp = (data: PageParams) => {
  return http<PageResult<GuessItem>>({
    url: '/home/goods/guessLike',
    method: 'GET',
    data,
  })
}
