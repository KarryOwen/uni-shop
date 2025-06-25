<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavBar from './components/CustomNavBar.vue'
import { getHomeBarHttp, getHomeHotHttp } from '@/services/index'
import { ref } from 'vue'
import type { BannerItem, HotItem } from '@/types/index'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import type { ShopGuessInsatnce } from '@/types/component.d.ts'
import HomeSkeletion from './components/HomeSkeletion.vue'
//获取首页广告
const barnnerList = ref<BannerItem[]>([])
const getHomeBarData = async () => {
  const ans = await getHomeBarHttp()
  // console.log(ans.result)
  barnnerList.value = ans.result
}
// 获取推荐数据
const HotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const ans = await getHomeHotHttp()
  // console.log(ans.result)
  HotList.value = ans.result
}

const isLoaded = ref(false)
onLoad(async () => {
  isLoaded.value = true
  await Promise.all([getHomeBarData(), getHomeHotData()])
  isLoaded.value = false
})

// 定义ShopGuess实例

const GuessRef = ref<ShopGuessInsatnce>()
const toLower = () => {
  // console.log(GuessRef.value)
  GuessRef.value.guessMore()
}

//下拉刷新
const isTriggered = ref(false)
const refresh = async () => {
  isTriggered.value = true
  await Promise.all([getHomeBarData(), getHomeHotData()])
  isTriggered.value = false
  GuessRef.value.resetData()
  GuessRef.value.guessMore()
}
</script>

<template>
  <CustomNavBar></CustomNavBar>
  <scroll-view
    scroll-y
    class="scroll-view"
    @scrolltolower="toLower"
    refresher-enabled
    @refresherrefresh="refresh"
    :refresher-triggered="isTriggered"
  >
    <HomeSkeletion v-if="isLoaded"></HomeSkeletion>
    <view v-else>
      <ShopSwiper :list="barnnerList"></ShopSwiper>
      <CategoryPanel></CategoryPanel>
      <HotPanel :hotList="HotList"></HotPanel>
      <ShopGuess ref="GuessRef"></ShopGuess>
    </view>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
