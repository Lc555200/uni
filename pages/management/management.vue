<template>
	<view class="management">
		<u-section class='mana' :color='color' :bold="bold" :font-size='fontSize' :title="tel" :right="false"></u-section>
		<u-section class='mana' :color='color' :bold="bold" :font-size='fontSize' title="修改密码" sub-title="进入" @click="gomore('1')"></u-section>
		<u-section class='mana' :color='color' :bold="bold" :font-size='fontSize' title="修改账号/手机号" sub-title="进入" @click="gomore('2')"></u-section>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				bold: false,
				fontSize: 35,
				color: '#303133',
				tel:''
			};
		},

		mounted() {
			this.getTel()
		},
		methods: {
			gomore(val) {
				switch (val) {
					case "1":
						uni.navigateTo({
							url: '../modify/modify'
						});
						break;
					case "2":
						uni.navigateTo({
							url: '../modAccount/modAccount'
						});
						break;

				}
			},
			async getTel(){
				const res = await this.$myRequest({
					url: '/js/a/tosms/getMem?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					}
				})
				console.log(res.data)
				this.tel = "账号/手机号："+res.data.accountNumber
			}
		}

	}
</script>

<style>
	.management {
		border-top: 1px solid #DCDEE0;
	}

	.mana {
		height: 50px;
		padding: 5px 20px;
		border-bottom: 1px solid #DCDEE0;
		box-sizing: border-box;
	}
</style>
