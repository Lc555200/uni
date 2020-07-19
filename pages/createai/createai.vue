<template>
	<view class="createai">
		<view class="outboundbtn">
			<text>创建AI外呼任务</text>
		</view>
		<view class="fixed">
			<!-- 列表 -->
			<view class="aiList">
				<table>
					<tr class="aiList_head">
						<td>
							<u-checkbox-group @change="checkboxGroupChange">
								<u-checkbox size='30rpx' @change="checkboxChange" v-model="selectAll" name="all"></u-checkbox>
							</u-checkbox-group>
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
							<u-checkbox-group @change="checkboxGroupChange">
								<u-checkbox size='30rpx' @change="checkboxChange" v-model="selectAll" name="all"></u-checkbox>
							</u-checkbox-group>
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
		
					<!-- {{item.upClueTime}}					{{item.upClueTel}}					{{item.upClueStatus}}					{{item.upClueAppraise}} -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectAll: false,
				dataList: {}
			}
		},
		mounted() {
			this.convert()
		},
		methods: {
			async convert() {
				const res = await this.$myRequest({
					url: '/js/a/clue/listData?__sid=' + uni.getStorageSync('sessionid'),
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					data: {
						status: '',
						beginTime: '',
						endTime: ''
					}
				})
				console.log(res.data)
				this.dataList = res.data.pageInfo.list
				this.dataList.forEach((item, index) => {
					// console.log(item);
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
			},
		}
	}
</script>

<style>
	.createai {
		border-top: 1px solid #DCDEE0;
	}

	.fixed {
		width: 100%;
		/* position: fixed; */
		z-index: 999;
		background-color: #FFFFFF;
	}

	.aiList_head,
		.aiList_content {
			width: 100%;
			height: 50px;
			border-bottom: 1px solid #DCDEE0;
			box-shadow: #DCDEE0 0px 0px 3px 2px;
		}
		.aiList{
			/* padding-top: 240rpx; */
		}
		.aiList_head{
			width: 100%;
			/* position: fixed; */
			z-index: 999;
			background-color: #FFFFFF;
		}
		table {
			width: 100%;
			text-align: center;
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
</style>
