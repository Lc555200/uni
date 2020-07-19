<template>
	<view class="content">
		<u-toast ref="uToast" />
		<view class="uni-flex uni-column">
			<view class="logo flex-item"></view>
			<view class="title flex-item">欢迎使用奥力格</view>
			<view class="login flex-item">注册账号</view>
			<view class="flex-item">
				<u-form :model="regForm" ref="regForm">
					<u-form-item label-width="0px" prop="newphone">
						<u-input v-model="regForm.newphone" :border-bottom='false' label-width=0 placeholder="请填写手机号" :clearable='false'></u-input>
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
					<u-form-item label-width="0px" prop="newpassword">
						<u-input v-model="regForm.newpassword" :border-bottom='false' label-width=0 placeholder="请确认密码" :clearable='false'></u-input>
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
			const validatePass2 = (rule, value, callback) => {
			      if (value === '') {
			        callback(new Error('请再次输入密码'))
			      } else if (value !== this.regForm.password) {
			        callback(new Error('两次输入密码不一致!'))
			      } else {
			        callback()
			      }
			    }
			return {
				regForm: {
					newphone: '',
					megNum: '',
					password: '',
					newpassword: ''
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
					}],
					newpassword: [{
						validator: validatePass2,
						trigger: "blur"
					}],
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
							url: '/js/a/alipay/register',
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								// 'content-type': 'application/json'
							},
							data: this.regForm
						})
						console.log(res.data)
						if(res.data == 3){
							console.log(1)
							this.$refs.uToast.show({
								title: '注册成功',
								type: 'default',
								url: '../login/login'
							})
						}else if(res.data == 0){
							this.$refs.uToast.show({
								title: '注册失败',
								type: 'error',
								url: '../register/register'
							})
						}else if(res.data == 1){
							this.$refs.uToast.show({
								title: '验证码错误',
								type: 'default',
								url: '../register/register'
							})
						}else{
							this.$refs.uToast.show({
								title: '验证码超时',
								type: 'default',
								url: '../register/register'
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
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.logo {
		width: 36px;
		height: 36px;
		padding: 100rpx 0 20rpx 0;
		background: url(../../static/logo.png) no-repeat 100%;
	}

	.title {
		font-size: 50rpx;
		font-weight: 700;
		padding-bottom: 100rpx;
	}

	.login {
		font-size: 18px;
		width: 150rpx;
		padding: 0 0 5rpx 0;
		border-bottom: 3px solid #007AFF;
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
