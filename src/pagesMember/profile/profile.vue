<script setup lang="ts">
// 获取数据
import { getProfileHttp, putMemberProfileAPI } from '@/services/profile'
import { useMemberStore } from '@/stores/modules/member'
import { onLoad } from '@dcloudio/uni-app'
import type { Gender, ProfileDetail } from '@/types/member'
import type { ProfileParams } from '@/types/member'
import { ref } from 'vue'
const memberStore = useMemberStore()
//获取用户数据
const profileData = ref({} as ProfileDetail)
const getProfileData = async () => {
  const ans = await getProfileHttp(memberStore.profile!.token)
  profileData.value = ans.result
  console.log(ans)
}
onLoad(() => {
  getProfileData()
})
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 修改头像
const avatarChange = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: (success) => {
      console.log(success)
      const tempFilePath = success.tempFiles[0].tempFilePath
      uni.uploadFile({
        url: '/member/profile/avatar',
        name: 'file',
        filePath: tempFilePath,
        success: (success) => {
          console.log(success)
        },
      })
    },
  })
}
//修改性别
const genderChange: UniHelper.RadioGroupOnChange = (e) => {
  profileData.value.gender = e.detail.value as Gender
}
// 修改生日
const birthdayChange: UniHelper.DatePickerOnChange = (e) => {
  profileData.value.birthday = e.detail.value
}
// 修改地址
const locationCode = ref(['', '', ''])
const loactionChange: UniHelper.RegionPickerOnChange = (e) => {
  profileData.value.fullLocation = e.detail.value.join(' ')
  locationCode.value = e.detail.code!
}
// 修改信息
const submit = async () => {
  const res = await putMemberProfileAPI({
    nickname: profileData.value?.nickname,
    gender: profileData.value?.gender,
    birthday: profileData.value?.birthday,
    provinceCode: locationCode.value[0],
    cityCode: locationCode.value[1],
    countyCode: locationCode.value[2],
    profession: profileData.value.profession,
  })
  console.log(res)
  memberStore.profile!.nickname = profileData.value?.nickname
  uni.showToast({ icon: 'success', title: '修改成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar" @tap="avatarChange">
      <view class="avatar-content">
        <image class="image" :src="profileData?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ profileData?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" type="text" placeholder="姓名" v-model="profileData!.nickname" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="genderChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="profileData.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="profileData.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            start="1900-01-01"
            :end="new Date()"
            :value="profileData.birthday"
            @change="birthdayChange"
          >
            <view v-if="profileData.birthday">{{ profileData.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            class="picker"
            mode="region"
            @change="loactionChange"
            :value="profileData.fullLocation?.split(' ')"
          >
            <view v-if="profileData.fullLocation">{{ profileData.fullLocation }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input
            class="input"
            type="text"
            placeholder="请填写职业"
            v-model="profileData.profession"
          />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="submit">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
