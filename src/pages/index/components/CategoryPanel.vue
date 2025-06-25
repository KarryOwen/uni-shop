<script setup lang="ts">
import { getHomeCategoryHttp } from '@/services/index'
import { ref, onMounted } from 'vue'
import type { CategoryItem } from '@/types/index'

// 获取分类数据
const categoryData = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const ans = await getHomeCategoryHttp()
  // console.log(ans)
  categoryData.value = ans.result
}
onMounted(() => {
  getHomeCategoryData()
})
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      url="/pages/index/index"
      v-for="e in categoryData"
      :key="e.id"
    >
      <image class="icon" :src="e.icon"></image>
      <text class="text">{{ e.name }}</text>
    </navigator>
  </view>
</template>

<style lang="scss">
/* 前台类目 */
.category {
  margin: 20rpx 0 0;
  padding: 10rpx 0;
  display: flex;
  flex-wrap: wrap;
  min-height: 328rpx;

  .category-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 100rpx;
      height: 100rpx;
    }
    .text {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>
