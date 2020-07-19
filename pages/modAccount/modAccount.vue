<template>
	<view class="forget">
		<view class="uni-flex uni-column">
			<view class="login flex-item">修改账号/手机号</view>
			<view class="flex-item">
				<u-form :model="regForm" ref="regForm">
					<u-form-item label-width="0px" prop="newphone">
						<u-input v-model="regForm.newphone" :border-bottom='false' label-width=0 placeholder="请填写新手机号" :clearable='false'></u-input>
					</u-form-item>
					<u-form-item label-width="0px" prop="megNum">
						<u-input v-model="regForm.megNum" :border-bottom='false' label-width=0 placeholder="请填写验证码" :clearable='false'>
						</u-input>
						<u-button class="megNumbtn" size="medium" slot="right" type="success" @tap="getCode">{{codeText}}</u-button>
						<u-verification-code ref="uCode" @change="codeChange"></u-verification-code>
					</u-form-item>
					<u-form-item label-width="0px" prop="password">
						<u-input v-model="regForm.password" :border-bottom='false' label-width=0 placeholder="请填写密码" :clearable='false'>
						</u-input>
					</u-form-item>
					<u-button :custom-style="btnStyle" type="primary" shape="square" :ripple="true" ripple-bg-color="#909399" @click="submit">提交</u-button>
				</u-form>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			const checkMobile = (rule, value, callback) => {
				if (!value) {
					return callback(new Error("此项不能为空"));
				} else {
					const reg = /^1[3456789]\d{9}$/;
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确的手机号"));
					}
				}
			};
			return {
				regForm: {
					newphone: '',
					megNum: '',
					password: '',
				},
				codeText: '',
				btnStyle: {
					marginTop: "20px"
				},
				rules: {
					newphone: [{
						validator: checkMobile,
						trigger: "blur"
					}],
					megNum: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}]
				},
			}
		},
		onLoad() {

		},
		methods: {
			codeChange(text) {
				this.codeText = text;
			},
			getCode() {
				if (this.regForm.newphone == '') {
					this.$refs.uToast.show({
						title: '手机号不能为空',
						type: 'default'
					})
				} else {
					if (this.$refs.uCode.canGetCode) {

						this.selectMoney();
						setTimeout(() => {
							uni.hideLoading();
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}, 1000);
					} else {
						this.$u.toast('倒计时结束后再发送');
					}
				}
			},
			submit() {
				this.$refs.regForm.validate(async valid => {
					console.log(valid)
					if (valid) {
						console.log(valid)
						const res = await this.$myRequest({
							url: '/js/a/tosms/checkmeg?__sid=' + uni.getStorageSync('sessionid'),
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								// 'content-type': 'application/json'
							},
							data: this.regForm
						})
						console.log(res.data)
						if(res.data == 5){
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'success',
								url: '../login/login'
							})
						}else if(res.data == 1){
							this.$refs.uToast.show({
								title: '验证码错误',
								type: 'error',
								url: '../modAccount/modAccount'
							})
						}else if(res.data == 2){
							this.$refs.uToast.show({
								title: '验证码超时',
								type: 'default',
								url: '../modAccount/modAccount'
							})
						}else if(res.data == 3){
							this.$refs.uToast.show({
								title: '密码错误',
								type: 'default',
								url: '../modAccount/modAccount'
							})
						}else{
							this.$refs.uToast.show({
								title: '绑定失败',
								type: 'error',
								url: '../modAccount/modAccount'
							})
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			onReady() {
				this.$refs.regForm.setRules(this.rules);
			},
			//获取验证码
			async selectMoney() {
				const res = await this.$myRequest({
					url: '/js/a/tosms/getmeg?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						// 'content-type': 'application/json',
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						phone: this.regForm.newphone
					}
				})
				if (res.data == 1) {
					this.$refs.uToast.show({
						title: '验证码获取成功',
						type: 'default'
					})
				} else {
					this.$refs.uToast.show({
						title: '验证码获取失败',
						type: 'error'
					})
				}
			},
		}
	}
</script>

<style>
	.forget {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.login{
		font-size: 18px;
		width: 270rpx;
		padding: 0 0 5rpx 0;
		border-bottom: 3px solid #007AFF;
		margin-bottom: 50px;
	}

	.megNumbtn {
		background-color: #007AFF;
	}

	.uni-input {
		border-bottom: 1px solid #DCDEE0;
		padding: 20rpx 0;
		margin: 40rpx 0;
	}

	.submit {
		margin-top: 80rpx;
		background-color: #007AFF;
		color: #FFFFFF;
	}

	.apply {
		margin-top: 80rpx;
		text-align: center;
	}

	.remarks {
		display: block;
		text-align: center;
		/* margin: 0 30rpx; */
		font-size: 14px;
		color: orange;
	}

	.u-field {
		padding: 0px;
		margin-top: 10px;
	}

	.uni-input-placeholder {
		font-size: 16px;
	}
</style>

