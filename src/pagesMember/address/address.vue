<script setup lang="ts">
//
import { getMemberAddressAPI, deleteMemberAddressByIdAPI } from '@/services/address'
import { onShow } from '@dcloudio/uni-app'
import type { AddressItem } from '@/types/address'
import { ref } from 'vue'
import { useAddressStore } from '@/stores/modules/address'
const addressDta = ref<AddressItem[]>()
const getAddressData = async () => {
  const ans = await getMemberAddressAPI()
  addressDta.value = ans.result
  // console.log(ans)
}
// 删除地址
const deleteAddress = async (id: string) => {
  uni.showModal({
    content: '是否删除改地址',
    success: async (success) => {
      if (success.confirm) {
        await deleteMemberAddressByIdAPI(id)
        getAddressData()
      }
    },
  })
}
onShow(() => {
  getAddressData()
})
// 修改地址
const onChangeAddress = (item: AddressItem) => {
  // 修改选中收货地址
  const addressStore = useAddressStore()
  addressStore.changeSelectedAddress(item)
  // 返回上一页
  uni.navigateBack()
}
</script>

<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view class="scroll-view" scroll-y>
      <view v-if="true" class="address">
        <uni-swipe-action class="address-list">
          <!-- 收货地址项 -->
          <uni-swipe-action-item class="item" v-for="e in addressDta" :key="e.address">
            <view class="item-content" @tap="onChangeAddress(e)">
              <view class="user">
                {{ e.receiver }}
                <text class="contact">{{ e.contact }}</text>
                <text v-if="e.isDefault" :class="{ badge: e.isDefault }">默认</text>
              </view>
              <view class="locate">{{ e.fullLocation }} {{ e.address }}</view>
              <navigator
                class="edit"
                hover-class="none"
                :url="`/pagesMember/address-form/address-form?id=${e.id}`"
                @tap.stop="() => {}"
              >
                修改
              </navigator>
            </view>
            <template #right>
              <button class=".delete-button" @tap="deleteAddress(e.id)">删除</button>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="/pagesMember/address-form/address-form">
        新建地址
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

/* 删除按钮 */
.delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  font-size: 28rpx;
  color: #fff;
  border-radius: 0;
  padding: 0;
  background-color: #cf4444;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;

  .scroll-view {
    padding-top: 20rpx;
  }
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item-content {
    line-height: 1;
    padding: 40rpx 10rpx 38rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;

    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }
  }

  .item:last-child .item-content {
    border: none;
  }

  .user {
    font-size: 28rpx;
    margin-bottom: 20rpx;
    color: #333;

    .contact {
      color: #666;
    }

    .badge {
      display: inline-block;
      padding: 4rpx 10rpx 2rpx 14rpx;
      margin: 2rpx 0 0 10rpx;
      font-size: 26rpx;
      color: #27ba9b;
      border-radius: 6rpx;
      border: 1rpx solid #27ba9b;
    }
  }

  .locate {
    line-height: 1.6;
    font-size: 26rpx;
    color: #333;
  }
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
