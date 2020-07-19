<template>
	<view>
		<view class="person-head">
			<view class="person-head-box">
				<view class="person-head-nickname">奥力格科技</view>
				<view class="person-head-other">
					<view class="person-head-username">可用余额：￥{{Abalance}}元</view>
					<view class="person-head-renew" @click="openrenewShow">充值</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-modal v-model="renewShow" show-cancel-button title='充值' @confirm='renew'>
			<view class="Recharge">

				<u-form :model="renewform" ref="renewform" :error-type="errorType">
					<u-form-item label-width=150 :border-bottom='false' label="当前余额:">
						<view class="balance">
							7100.25
						</view>
					</u-form-item>
					<u-form-item label-width=150 :border-bottom='false' label="充值金额:" prop="renewipt">
						<u-input class="useript" border v-model="renewform.renewipt" placeholder="请输入金额" type="text" />

					</u-form-item>
					<u-form-item label-width=150 :border-bottom='false' label="支付方式:">
						<view class="paymethod">
							<view class="alipay_ico">

							</view>支付宝支付
						</view>
					</u-form-item>
				</u-form>
			</view>
		</u-modal>
		<view class="person-list">
			<cmd-cell-item @click="myFunction('1')" title="概况" slot-left arrow>
			</cmd-cell-item>
			<cmd-cell-item @click="myFunction('2')" title="费用中心" slot-left arrow>
			</cmd-cell-item>
			<cmd-cell-item @click="myFunction('3')" title="公司信息" slot-left arrow>
			</cmd-cell-item>
			<cmd-cell-item @click="myFunction('4')" title="账号管理" slot-left arrow>
			</cmd-cell-item>
			<cmd-cell-item @click="myFunction('5')" title="帮助中心" slot-left arrow>
			</cmd-cell-item>
			<button class="btn-logout" @click="Loginout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	import cmdIcon from "@/components/cmd-icon/cmd-icon.vue"
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	export default {
		components: {
			cmdAvatar,
			cmdCellItem,
			cmdIcon
		},
		data() {
			return {
				//剩余话费
				Abalance:0,
				//支付宝orderInfo
				orderInfo: '',
				renewform: {
					renewipt: ''
				},
				rules: {
					renewipt: [{
						required: true,
						trigger: ['blur']
					}]
				},
				errorType: ['border'],
				renewShow: false
			};
		},
		watch: {
			renewShow: function(newVal) {
				if (newVal == false) {
					this.renewform.renewipt = '';
				} else {
					this.$nextTick(() => {
						this.$refs.renewform.setRules(this.rules);
					})
				}
			}
		},
		mounted() {
			this.balance();
		},
		methods: {
			openrenewShow() {
				this.renewShow = true;
			},
			async balance(){
				const res = await this.$myRequest({
					url: '/js/a/statistics/loginOrganAICallCustomCount?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					data: {}
				})
				this.Abalance = res.data.gkreserveField1
			},
			//充值
			renew() {
				this.$refs.renewform.validate(async valid => {
					if (valid) {
						const res = await this.$myRequest({
							url: '/js/a/alipay/appPay?__sid=' + uni.getStorageSync('sessionid'),
							method: 'POST',
							header: {
								'content-type': 'application/json',
							},
							data: {
								subject: '充值',
								totalFee: this.renewform.renewipt
							}
						})
						this.orderInfo = res.data.orderString

						uni.requestPayment({
							provider: 'alipay',
							orderInfo: res.data.orderString,
							success: res => {
								// 进入此回调说明支付成功  
								console.log('success')
							},
							fail: err => {
								const message = err.errMsg || '';
								console.log(message)
								if (message.indexOf('[payment支付宝:62001]') !== -1) {
									uni.showModal({
										content: '您已取消支付。如有需要，您可在我的订单里重新付款。30分钟内有效。',
										showCancel: false
									});
								} else {
									console.log(message)
									uni.showModal({
										content: '支付失败',
										showCancel: false
									});
								}
							},
							complete: () => {
								this.renewShow = false;
							}
						});
					} else {
						console.log('验证失败');
					}
				});



			},
			//退出登录
			async Loginout() {
				const res = await this.$myRequest({
					url: '/js/a/logout?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
				})
				uni.showModal({
					title: '提示',
					content: '您确定要退出吗？',
					success: function(res) {
						if (res.confirm) {
							uni.clearStorageSync();
							uni.showToast({
								title: '退出成功',
								duration: 2000
							});
							setTimeout(function() {
								uni.navigateTo({
									url: '/pages/login/login',
								});
							}, 2000)

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},

			//我的功能
			myFunction(val) {
				switch (val) {
					case "1":
					uni.navigateTo({
						url: '../General/general'
					});
						break;
					case "2":
						uni.navigateTo({
							url: '../expense/expense'
						});
						break;
					case "3":
						uni.navigateTo({
							url: '../organization/organization'
						});

						break;
					case "4":
					uni.navigateTo({
						url: '../management/management'
					});
						break;
					case "5":
						uni.navigateTo({
							url: '../help/help'
						});
						break;
				}
			}
		},
		// onReady() {
		// 	this.$refs.renewform.setRules(this.rules);

		// }

	}
</script>

<style>
	.person-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 145px;
		padding: 20px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		background: url(../../static/myBgc.jpg) 100% 100%;
	}

	.person-head-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

	}

	.person-head-nickname {
		font-size: 20px;
		font-weight: 500;
		color: #fff;
	}

	.person-head-other {
		margin-top: 10px;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.person-head-username {
		font-size: 15px;
		font-weight: 500;
		color: #fff;
	}

	.person-head-renew {
		color: #FFFFFF;
		border: 1px solid #FFFFFF;
		border-radius: 8px;
		padding: 0 4px;
		font-size: 13px;
	}

	.person-list {
		line-height: 0;
	}

	.btn-logout {
		margin-top: 100upx;
		width: 80%;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #365fff, #36bbff);
	}

	.Recharge {
		padding: 20px;
	}

	.alipay_ico {
		vertical-align: sub;
		display: inline-block;
		width: 16px;
		height: 16px;
		background: url(../../static/alipayico.jpg) no-repeat 100%;
		margin: 2px 5px 0 0;
	}
</style>
