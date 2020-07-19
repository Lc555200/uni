<template>
	<view class="forget">
		<view class="uni-flex uni-column">
			<view class="login flex-item">修改密码</view>
			<view class="flex-item">
				<u-form :model="regForm" ref="regForm">
					<u-form-item label-width="0px" prop="newphone">
						<u-input v-model="regForm.newphone" :border-bottom='false' label-width=0 placeholder="请填写旧密码" :clearable='false'></u-input>
					</u-form-item>
					<!-- <u-form-item label-width="0px" prop="megNum">
						<u-input v-model="regForm.megNum" :border-bottom='false' label-width=0 placeholder="请填写验证码" :clearable='false'>
						</u-input>
						<u-button class="megNumbtn" size="medium" slot="right" type="success" @tap="getCode">{{codeText}}</u-button>
						<u-verification-code ref="uCode" @change="codeChange"></u-verification-code>
					</u-form-item> -->
					<u-form-item label-width="0px" prop="password">
						<u-input v-model="regForm.password" :border-bottom='false' label-width=0 placeholder="请填写新密码" :clearable='false'>
						</u-input>
					</u-form-item>
					<u-form-item label-width="0px" prop="newpassword">
						<u-input v-model="regForm.newpassword" :border-bottom='false' label-width=0 placeholder="请确认新密码" :clearable='false'></u-input>
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
					password: '',
					newpassword: ''
				},
				codeText: '',
				btnStyle: {
					marginTop: "20px"
				},
				rules: {
					newphone: [{
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
			submit() {
				this.$refs.regForm.validate(async valid => {
					console.log(valid)
					if (valid) {
						console.log(valid)
						const res = await this.$myRequest({
							url: '/js/a/tosms/updatePass?__sid=' + uni.getStorageSync('sessionid'),
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded',
								// 'content-type': 'application/json'
							},
							data: this.regForm
						})
						console.log(res.data)
						if(res.data == 0){
							this.$refs.uToast.show({
								title: '原密码输入错误',
								type: 'default',
								url: '../modify/modify'
							})
						}else if(res.data == 1){
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'error',
								url: '../login/login'
							})
						}else{
							this.$refs.uToast.show({
								title: '修改失败',
								type: 'default',
								url: '../modify/modify'
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
		width: 150rpx;
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

