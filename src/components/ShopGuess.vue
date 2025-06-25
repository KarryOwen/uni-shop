<script setup lang="ts">
import { getHomeguessLikeHttp } from '@/services/index.ts'
import { ref, onMounted } from 'vue'
import type { GuessItem } from '@/types/index'
import type { PageResult } from '@/types/global'
//获取数据
const pageParams = {
  page: 1,
  /** 页大小：默认值为 10 */
  pageSize: 10,
}
const guessData = ref<GuessItem[]>([])
const end = ref(false)
const getHomeguessLikeData = async () => {
  if (end.value) {
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据',
    })
  }
  const ans = await getHomeguessLikeHttp(pageParams)
  // console.log(ans)
  guessData.value.push(...ans.result.items)
  if (pageParams.page <= ans.result.pages) {
    pageParams.page++
  } else {
    end.value = true
  }
  // console.log(guessData.value)
}
onMounted(() => {
  getHomeguessLikeData()
})
//下拉刷新重置数据
const resetData = () => {
  pageParams.page = 1
  end.value = false
}
// 暴漏出方法
defineExpose({
  guessMore: getHomeguessLikeData,
  resetData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="e in guessData"
      :key="e.id"
      :url="`/pages/goods/goods?id=4007498`"
    >
      <image class="image" mode="aspectFill" :src="e.picture"></image>
      <view class="name"> {{ e.name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ e.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ end ? '没有更多数据' : '正在加载...' }}
  </view>
</template>

<style lang="scss">
:host {
  display: block;
}

/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }

  .image {
    width: 304rpx;
    height: 304rpx;
  }

  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }

  .small {
    font-size: 80%;
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
