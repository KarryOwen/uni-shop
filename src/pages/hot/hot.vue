<script setup lang="ts">
import { getHotHttp } from '@/services/hot'
import { onLoad } from '@dcloudio/uni-app'
import type { HotResult, SubTypeItem } from '@/types/hot'
import { ref } from 'vue'
// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
//接收参数
const type = defineProps<{
  type: string
}>()
const currentHot = hotMap.find((e) => e.type === type.type)
// 修改标题
uni.setNavigationBarTitle({ title: currentHot!.title })
// 获取数据
const bannerPictureUrl = ref<string>()
const SubTypes = ref<(SubTypeItem & { finsh?: boolean })[]>()
const activeIndex = ref(0)
const getHotData = async () => {
  const ans = await getHotHttp(currentHot!.url, {
    page: 30,
  })
  // console.log(ans.result)
  bannerPictureUrl.value = ans.result.bannerPicture
  SubTypes.value = ans.result.subTypes
  console.log(SubTypes.value)
}
onLoad(() => {
  getHotData()
})
const toLower = async () => {
  // 获取当前的商品列表
  const currSubtype = SubTypes.value![activeIndex.value]
  if (currSubtype.goodsItems.page < currSubtype.goodsItems.pages) {
    currSubtype.goodsItems.page++
  } else {
    //没有数据提示并标记
    SubTypes.value![activeIndex.value].finsh = true
    return uni.showToast({ icon: 'none', title: '没有更多数据' })
  }
  const ans = await getHotHttp(currentHot!.url, {
    subType: currSubtype.id,
    pageSize: currSubtype.goodsItems.pageSize,
    page: currSubtype.goodsItems.page,
  })
  console.log(ans.result)
  SubTypes.value![activeIndex.value].goodsItems.items.push(
    ...ans.result.subTypes[activeIndex.value].goodsItems.items,
  )
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPictureUrl"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        class="text"
        :class="{ active: i === activeIndex }"
        v-for="(e, i) in SubTypes"
        :key="e.id"
        @tap="activeIndex = i"
        >{{ e.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      scroll-y
      class="scroll-view"
      v-for="(e, i) in SubTypes"
      :key="e.id"
      v-show="i === activeIndex"
      @scrolltolower="toLower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="good in e.goodsItems.items"
          :key="good.id"
          :url="`/pages/goods/goods?id=${e.id}`"
        >
          <image class="thumb" :src="good.picture"></image>
          <view class="name ellipsis">{{ good.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ good.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{
        SubTypes![activeIndex].finsh ? '没有更多数据' : '正在加载中'
      }}</view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.scroll-view {
  flex: 1;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;

  .text {
    margin: 0 20rpx;
    position: relative;
  }

  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;

  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .thumb {
    width: 305rpx;
    height: 305rpx;
  }

  .name {
    height: 88rpx;
    font-size: 26rpx;
  }

  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }

  .symbol {
    font-size: 70%;
  }

  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
