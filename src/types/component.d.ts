import ShopSwiper from './ShopSwiper.vue'
import ShopGuess from './ShopGuess.vue'
import ShopGuess from '@/components/ShopGuess.vue'

// src/types/components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    ShopSwiper: typeof ShopSwiper
    ShopGuess: typeof ShopGuess
  }
}
// 组件实例化导出
export type ShopGuessInsatnce = InstanceType<typeof ShopGuess>
