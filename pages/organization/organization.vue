<template>
	<view class="organization">
		<u-toast ref="uToast" />
		<view class="uni-flex uni-column">
			<view class="login flex-item">公司信息</view>
			<u-form :model="comForm" ref="comForm">
				<u-form-item label-width="0px" prop="organName">
					<u-input placeholder='请输入公司名称' v-model="comForm.organName" />
				</u-form-item>
				<u-form-item label-width="0px" prop="organClass">
					<u-input placeholder='请选择行业' v-model="comForm.organClass" type="select" @click="show = true" />
				</u-form-item>
				<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
				<u-form-item label-width="0px" prop="organMan">
					<u-input placeholder='负责人姓名' v-model="comForm.organMan" />
				</u-form-item>
				<u-form-item label-width="0px" prop="organManphone">
					<u-input placeholder='负责人电话' v-model="comForm.organManphone" />
				</u-form-item>
				<u-form-item label-width="0px" prop="organAddress">
					<u-input placeholder='公司地址(市,区)' v-model="comForm.organAddress" />
				</u-form-item>
				<u-form-item label-width="0px" prop="detailAddress">
					<u-input placeholder='详细地址' v-model="comForm.detailAddress" />
				</u-form-item>
				<u-form-item label-width="0px" prop="organPhone">
					<u-input placeholder='公司电话' v-model="comForm.organPhone" />
				</u-form-item>
				<u-form-item label-width="0px" prop="organHava">
					<u-input placeholder='公司简介' v-model="comForm.organHava" type="textarea" />
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
					console.log(reg.test(value));
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确的手机号"));
					}
				}
			};
			return {
				btnStyle: {
					marginTop: "20px"
				},
				show: false,
				comForm: {
					organAddress: '',
					organName: '',
					organClass: '',
					organPhone: '',
					organMan: '',
					organManphone: '',
					detailAddress: '',
					organHava: ''
				},
				rules: {
					organName: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					organClass: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					organPhone: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					organMan: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					organManphone: [{
						validator: checkMobile,
						trigger: "blur"
					}],
					organAddress: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					detailAddress: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}],
					organHava: [{
						required: true,
						message: '此项不能为空',
						trigger: 'blur'
					}]
				},
				actionSheetList: [{
						text: '教育培训'
					},
					{
						text: '二手车'
					},
					{
						text: '新车'
					},
					{
						text: '室内装修'
					},
					{
						text: '财税服务'
					},
					{
						text: '五金建材'
					},
					{
						text: '美容美发'
					},
					{
						text: '招聘服务'
					}
				],
				dataList:{}
			}
		},
		mounted() {
			this.agency()
			// /js/a/account/updateMember
		},
		methods: {
			async agency(){
				const res = await this.$myRequest({
					url: '/js/a/account/findMemberByCode?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					data: {}
				})
				this.comForm = res.data
			},
			actionSheetCallback(index) {
				this.comForm.organClass = this.actionSheetList[index].text;
			},
			submit() {
				this.$refs.comForm.validate(async valid => {
					if (valid) {
						const res = await this.$myRequest({
							url: '/js/a/account/updateMember?__sid=' + uni.getStorageSync('sessionid'),
							method: 'POST',
							header: {
								'content-type': 'application/json',
							},
							data: this.comForm
						})
						if (res.data == 1) {
							this.$refs.uToast.show({
								title: '修改成功',
								type: 'success'
							})
						} else{
							this.$refs.uToast.show({
								title: '修改失败',
								type: 'error'
							})
						}
						this.agency()
					} else {
						console.log('验证失败');
					}
				});
			},
			onReady() {
				this.$refs.comForm.setRules(this.rules);
			}

		},

	}
</script>

<style>
	.organization {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.login {
		font-size: 18px;
		width: 150rpx;
		padding: 0 0 5rpx 0;
		border-bottom: 3px solid #007AFF;
	}
</style>
