<template>
	<view class="addUser">
		<view class="outboundbtn">
			<text>创建AI外呼任务</text>
		</view>
		<l-file ref="lFile" @up-success="onSuccess"></l-file>
		<u-toast ref="uToast" />
		<u-modal v-model="addUserShow" show-cancel-button title='添加用户' @confirm='AddUser'>
			<u-form :model="renewform" ref="renewform" :error-type="errorType">
				<u-form-item class="useript" label-width=0 :border-bottom='false' prop="addUseript">
					<u-input border v-model="renewform.addUseript" placeholder="请输入手机号" type="text" />
				</u-form-item>
			</u-form>
		</u-modal>
		<view class="fixed">
			<!-- 添加 -->
			<view class="create_ai">
				<view class="create">
					<u-button type="primary" shape="circle" size="medium" :ripple="true" ripple-bg-color="#909399" @tap="onUpload">批量添加</u-button>
				</view>
				<view class="telbalances">
					<u-button type="primary" shape="circle" size="medium" :ripple="true" ripple-bg-color="#909399" @click="openUserShow">单条添加</u-button>
				</view>
			</view>
			<!-- 查询 -->
			<view class="select">
				<view class="select_status">
					<u-input v-model="Personstatus" placeholder="请选择状态" type="select" @click="show = true" />
					<u-select v-model="show" mode="single-column" :list="list" @confirm="confirm"></u-select>
				</view>
				<view class="select_date">
					<u-input v-model="search_date" placeholder="请选择日期范围" type="select" @click="selectdate" />
					<u-calendar v-model="select_date" mode="range" @change="setpicker"></u-calendar>
				</view>
				<view class="select_btn">
					<button class="mini-btn" type="primary" size="mini" @click="convert">查询</button>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="aiList">
			<table>
				<tr class="aiList_head">
					<td>
						<!-- <checkbox-group @change="allChoose">
							<label>
								<checkbox value="all" :class="{'checked':allChecked}" :checked="allChecked?true:false"></checkbox>
							</label>
						</checkbox-group> -->
						<jiuaiCheckbox @change="allChoose" value="all" :class="{'checked':allChecked}" :checked="allChecked?true:false"></jiuaiCheckbox>
					</td>
					<td>
						时间
					</td>
					<td>
						电话
					</td>
					<td>
						状态
					</td>
					<td>
						意向
					</td>
				</tr>
				<tr class='aiList_content' v-for="(item, index) in dataList" :key="index">
					<td>
						<!-- <checkbox-group class="checkgroup" @change="onlyCheckbox">
							<checkbox :value="String(item.flag)" :checked="checkedArr.includes(String(item.flag))" :class="{'checked':checkedArr.includes(String(item.flag))}"></checkbox>
						</checkbox-group> -->
						<jiuaiCheckbox @change="onlyCheckbox" :value="String(item.flag)" :checked="checkedArr.includes(String(item.flag))" :class="{'checked':checkedArr.includes(String(item.flag))}"></jiuaiCheckbox>
					</td>
					<td>
						{{item.upClueTime}}
					</td>
					<td>
						{{item.upClueTel}}
					</td>
					<td>
						{{item.upClueStatus}}
					</td>
					<td>
						{{item.upClueAppraise}}
					</td>
				</tr>
			</table>
		</view>
	</view>
</template>

<script>
	import lFile from '@/components/l-file/l-file.vue'
	import jiuaiCheckbox from "@/components/jiuai-checkbox/jiuai-checkbox.vue";
	export default {
		components: {
			lFile,
			jiuaiCheckbox
		},
		data() {
			return {
				status: '',
				beginTime: '',
				endTime: '',
				//单挑添加
				renewform: {
					addUseript: ''
				},
				rules: {
					addUseript: [{
						required: true,
						trigger: ['blur']
					}]
				},
				errorType: ['border'],
				addUserShow: false,
				Personstatus: '',
				search_date: "",
				select_date: false,
				show: false,
				list: [{
						value: '1',
						label: '已拨打'
					},
					{
						value: '2',
						label: '未拨打'
					}
				],

				localPath: '',
				dataList: [],
				isChecked: false,
				checkedArr: [], //复选框选中的值
				allChecked: false, //是否全选
				arr:[]

			}
		},
		watch: {
			addUserShow: function(newVal) {
				if (newVal == false) {
					this.renewform.addUseript = '';
				} else {
					this.$nextTick(() => {
						this.$refs.renewform.setRules(this.rules);
					})
				}
			}

		},
		mounted() {
			this.convert()
		},
		methods: {
			// 全选事件
			allChoose(e) {
				console.log(e)
				let chooseItem = e.detail.checked;
				// 全选
				if (chooseItem) {
					this.allChecked = true;
					this.dataList.forEach((item, index) => {
						let itemVal = String(item.flag);
						if (!this.checkedArr.includes(itemVal)) {
							this.checkedArr.push(itemVal);
						}
					})
					console.log(this.checkedArr)
				} else {
					// 取消全选
					this.allChecked = false;
					this.checkedArr = [];
				}
			},


			// 多选复选框改变事件
			onlyCheckbox(e) {
				if(e.detail.checked){
					this.checkedArr.push(e.detail.value)
				}else{
					if(this.checkedArr.includes(e.detail.value)){
						this.checkedArr.forEach((item, index)=>{
							debugger
							if(item != e.detail.value){
								this.arr.push(item)
							}
						})
						this.checkedArr = this.arr
					}
				}
				console.log(this.checkedArr)
				// 如果选择的数组中有值，并且长度等于列表的长度，就是全选
				if (this.checkedArr.length > 0 && this.checkedArr.length == this.dataList.length) {
					this.allChecked = true;
				} else {
					this.allChecked = false;
				}

			},









			async convert() {
				const res = await this.$myRequest({
					url: '/js/a/clue/listData?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					data: {
						status: this.status,
						beginTime: this.beginTime,
						endTime: this.endTime
					}
				})
				// console.log(res.data)
				this.dataList = res.data.pageInfo.list
				this.dataList.forEach((item, index) => {
					item.flag = index //向每一个ITEM中添加selectonly属性为false
					if (item.upClueStatus == "2") {
						item.upClueStatus = "未拨打";
						item.upClueAppraise = "一一一";
					} else {
						item.upClueStatus = "已拨打";
						if (item.upClueAppraise == "1") {
							item.upClueAppraise = "有意向";
						} else {
							item.upClueAppraise = "无意向";
						}
					}
					item = JSON.parse(JSON.stringify(item));
				});
				// console.log(this.dataList)
			},
			AddUser() {
				this.$refs.renewform.validate(async valid => {
					if (valid) {
						const res = await this.$myRequest({
							url: '/js/a/clue/addUpClueForTel?__sid=' + uni.getStorageSync('sessionid'),
							method: 'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded',
							},
							data: {
								tel: this.renewform.addUseript
							}
						})
						console.log(res.data)
						if (res.data.result == 'true') {
							this.$refs.uToast.show({
								title: '添加成功',
								type: 'success'
							})
						} else {
							this.$refs.uToast.show({
								title: '添加失败',
								type: 'error'
							})
						}
						this.convert()
					} else {
						console.log('验证失败')
					}

				})
			},
			// **************************
			openUserShow() {
				// this.addUserShow = true
				this.$refs.uToast.show({
					title: '添加失败',
					type: 'error',
					url: '/pages/new/new'
				})
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				console.log(123);
			},
			confirm(e) {
				console.log(e);
				this.Personstatus = e[0].label
				this.status = e[0].value
			},
			selectdate() {
				this.select_date = true;
			},
			setpicker(e) {
				this.beginTime = e.startDate;
				this.endTime = e.endDate
				this.search_date = e.startDate + ' 至 ' + e.endDate;
			},


			/* 上传 */
			onUpload() {
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: 'http://192.168.1.4:8980/js/a/clue/uploadClueExcel?__sid=' + uni.getStorageSync('sessionid'),
					//默认file,上传文件的key
					name: 'file',
					header: {},
					//...其他参数
				});
			},
			onSuccess(res) {
				console.log('上传成功回调', JSON.stringify(res));
				uni.showToast({
					title: JSON.stringify(res)
				})
			}
		}
	}
</script>

<style>
	.addUser {
		border-top: 1px solid #DCDEE0;
	}

	.fixed {
		width: 100%;
		position: fixed;
		z-index: 999;
		background-color: #FFFFFF;
	}

	.create_ai {
		width: 100%;
		height: 70px;
		border-bottom: 1px solid #DCDEE0;
		display: flex;
		align-items: center;
		padding: 0 10px;
	}

	.create {
		flex: 1;
		text-align: center;
	}

	.telbalances {
		flex: 1;
		display: flex;
		justify-content: space-around;
	}

	.select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
		padding: 0 10px;
		/* border-bottom: 1px solid #DCDEE0; */
	}

	.select_status {
		width: 25%;
		border-bottom: 1px solid #DCDEE0;
	}

	.select_date {
		width: 55%;
		border-bottom: 1px solid #DCDEE0;
	}

	.select_btn {
		padding-top: 8px;
	}

	.aiList_head,
	.aiList_content {
		width: 100%;
		height: 50px;
		border-bottom: 1px solid #DCDEE0;
		box-shadow: #DCDEE0 0px 0px 3px 2px;
	}

	.aiList {
		padding-top: 240rpx;
	}

	.aiList_head {
		width: 100%;
		/* position: fixed; */
		z-index: 999;
		background-color: #FFFFFF;
	}

	.checkgroup {
		width: 100%;
	}

	table {
		width: 100%;
		text-align: center;
	}


	.useript {
		width: 80%;
		margin: 30px auto;
	}

	.outboundbtn {
		z-index: 2;
		position: fixed;
		right: 0;
		bottom: 150px;
		width: 30%;
		height: 35px;
		line-height: 35px;
		text-align: center;
		color: #fff;
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
		background-color: #0081FF;

	}

	/deep/.u-drawer {
		z-index: 9999;
	}
</style>
