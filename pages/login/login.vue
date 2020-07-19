<template>
	<view class="content">
		<view class="uni-flex uni-column">
			<view class="logo flex-item"></view>
			<view class="title flex-item">欢迎使用奥力格</view>
			<view class="login flex-item">登录</view>
			<view class="flex-item">
				<form @submit="formSubmit">
					<view class="uni-form-item uni-column">
						<input class="uni-input" name="username" v-model="username" placeholder="请输入账号/手机号" />
					</view>
					<view class="uni-form-item uni-column">
					                <view class="uni-input-wrapper">
					                    <input class="uni-input" v-model="password" placeholder="请输入密码" :password="showPassword" />
					                    <!-- <text class="uni-icon" :class="[!showPassword ? 'uni-eye-active' : '']" @click="changePassword">&#xe568;</text> -->
					                </view>
					            </view>
					<view class="other">
						<view style="display: flex;align-items: center;">
							<view class="redio">
								<u-checkbox-group>
											<u-checkbox  
												v-model="rideo" 
												v-for="(item, index) in list" :key="index" 
												:name="item.name"
											>{{item.name}}</u-checkbox>
										</u-checkbox-group>
							</view>
							<view class="navigator">
								<navigator class="navigator" url="../agreement/agreement">《用户协议》</navigator>
							</view>
						</view>
						
						<view class="navigator">
							<navigator class="navigator" url="../forgetpassword/forget">忘记密码?</navigator>
						</view>
					</view>
					<view class="uni-btn-v">
						<button class="submit" form-type="submit">登录</button>
					</view>
					<view class="apply uni-btn-v">
						<text class="read">没有账号?</text><navigator class="navigator" url="../register/register">立即申请</navigator>
					</view>
				</form>
						<u-toast ref="uToast" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				 showPassword: true,
				 list: [
				 				{
				 					name: '阅读并同意',
				 					checked: false,
				 					disabled: false
				 				}
				 			],
				 			// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				 			rideo: false,
			}
		},
		onLoad() {

		},
		methods: {
			changePassword: function() {
			                this.showPassword = !this.showPassword;
			            },
			async formSubmit(e) {
				if(this.rideo){
					// console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
					const res = await this.$myRequest({
						url: '/js/a/login?__login=true&__ajax=json',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							username: this.username,
							password: this.password
						}
					})
					console.log(res.data)
					if(res.data.result == 'true'){
						uni.setStorage({
						    key: 'sessionid',
						    data: res.data.sessionid,
						    success: function () {
						        console.log('success');
								uni.switchTab({
									url: '../intention/intention'
								});
						    }
						});
					}else{
					this.$refs.uToast.show({
										title: '账号/密码错误',
										type: 'default',
										icon: false
									})
					}
				}else{
					this.$refs.uToast.show({
										title: '请勾选用户协议',
										type: 'default',
										icon: false
									})
					}
				}
				
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
		width: 75rpx;
		padding: 0 0 5rpx 0;
		border-bottom: 3px solid #007AFF;
	}

	.uni-input {
		border-bottom: 1px solid #DCDEE0;
		padding: 20rpx 0;
		margin: 40rpx 0;
	}
	.other{
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.navigator {
		vertical-align: middle;
		display: inline-block;
		height: 27px;
		line-height: 27px;
		color: #007AFF;
		font-size: 30rpx;
	}
	.uni-icon {
	        font-family: uniicons;
	        font-size: 24px;
	        font-weight: normal;
	        font-style: normal;
	        width: 24px;
	        height: 24px;
	        line-height: 24px;
	        color: #999999;
	    }
</style>
