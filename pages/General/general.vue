<template>
	<view class="general">
		<view class="general_visual">
			<view class="general_visual_ai">
				<view class="title">
					AI呼叫总客户数量</br>
					{{ General.gkcustomCount }}
				</view>
			</view>
			<view class="general_visual_in">
				<view class="title">
					意向用户数量</br>
					{{ General.gkintentionCount }}
				</view>
			</view>
		</view>
		<view class="other">
			<view class="other_top">
				<view class="duration">
					通话总时长: {{ General.gktotalTime }}分钟
				</view>
				<view class="charges">
					话费: {{ General.gkusingPhoneBill }}元
				</view>
			</view>
			<view class="other_bot">
				<view class="duration">
					剩余话费: {{ General.gkreserveField1 }}元
				</view>
				<view class="charges">
					<u-button size="mini" shape="circle" type="primary" @click="gomy">充值</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				General:{}
	
			}
		},
		mounted() {
			this.getGeneral()
		},
		methods: {
			async getGeneral(){
				const res = await this.$myRequest({
					url: '/js/a/statistics/loginOrganAICallCustomCount?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					}
				
				})
				this.General = res.data
			}
		}
	}
</script>

<style>
	.general {
		border-top: 1px solid #DCDEE0;
	}
	.general_visual{
		height: 300rpx;
		background-color: #DCDEE0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 1px solid #ccc;
	}
	.general_visual_in, .general_visual_ai{
		width: 45%;
		height: 180rpx;
		background-color: #0066CC;
		border-radius: 10px;
	}
	.title{
		color: #FFFFFF;
		font-size: 28rpx;
		padding: 40rpx 0 0 40rpx;
	}
	.other{
		height: 220rpx;
		padding: 0 20px;
		border-bottom: 1px solid #ccc;
	}
	.other_top, .other_bot{
		height: 50%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #ccc;
	}
	.other_bot{
		border-bottom: 0;
		}
</style>
