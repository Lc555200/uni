<template>
	<view class="ai">
		<!-- 创建任务和余额 -->
		<view class="fixed">
			
		
		<view class="create_ai">
			<view class="create">
				<u-button type="primary" shape="circle" size="medium" :ripple="true" ripple-bg-color="#909399" @click="gocreateai">创建任务</u-button>
			</view>
			<view class="telbalances">
				<view class="balances">
					剩余话费：￥{{this.CustomCount.reserveField1}}
				</view>
				<view class="recharge">
					充值
				</view>
			</view>
		</view>
		<!-- 查询 -->
		<view class="ai_select">
			<view class="select_date">
				<view class="seledate">
					<u-input v-model="search_date" placeholder="请选择日期范围" type="select" @click="selectdate"/>
					<u-calendar v-model="select_date" mode="range" @change="setpicker"></u-calendar>
				</view>
				<view class="select_btn">
					<button class="mini-btn" type="primary" size="mini" @click="convert">查询</button>
				</view>
				<!-- <u-search shape="square" v-model="search_date" :clearabled="true":show-action="true" action-text="查询" @focus="selectdate" @custom="select"></u-search>
				<u-calendar v-model="select_date" mode="range" @change="setpicker"></u-calendar> -->
			</view>
		</view>
		<!-- 查询 -->
		<!-- 显示 -->
		<view class="showOther">
			<view class="schedule">
				拨打进度：{{this.CustomCount.aiywcall}}
			</view>
			<view class="duration">
				通话总时长：{{this.CustomCount.aitotaltime}}
			</view>
		</view>
		<!-- 显示 -->
		<!-- 列表 -->
			<view class="aiList">
				<table>
					<tr class="aiList_head">
						
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
					<tr class='aiList_content' v-for="(item, index) in AiList" :key="index">
						
						<td>
							{{item.upCreatetime}}
						</td>
						<td>
							{{item.upCluetel}}
						</td>
						<td>
							{{item.upFinishstatus}}
						</td>
						<td>
							{{item.upAiappraise}}
						</td>
					</tr>
				</table>
			</view>
		<!-- 列表 -->
	</view>
	</view>
	<!-- {{item.upAiappraise}}  {{item.upFinishstatus}}  {{item.upCluetel}}  {{item.upCreatetime}} -->
</template>

<script>
	export default {
		data() {
			return {
				beginTime:'',
				endTime:'',
				search_date:"",
				select_date: false,
				AiList:[],
				CustomCount: {},
			}
		},
		mounted() {
			this.DialStatistics()
			this.convert()
		},
		methods: {
			gocreateai(){
				console.log(123)
				uni.navigateTo({
				    url: '../createai/createai'
				});
				
			},
			selectdate(){
				this.select_date = true;
			},
			setpicker(e){
				console.log(e)
				this.beginTime = e.startDate;
				this.endTime = e.endDate
				this.search_date = e.startDate+' 至 '+e.endDate;
			},
			select(){
				console.log('搜索')
			},
			// 列表请求
			async convert(){
				const res = await this.$myRequest({
					url: '/js/a/clue/getAiTask?__sid=' + uni.getStorageSync('sessionid') + '&pageNum=' + 1,
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					data: {
						beginTime: this.beginTime,
						endTime: this.endTime
					}
				})
				console.log(res.data)
				this.AiList = res.data.pageInfo.list
				this.AiList.forEach((item)=>{
					if(item.upAiappraise == '1'){
						item.upAiappraise = '有意向'
					}else{
						item.upAiappraise = '无意向'
					}
					if(item.upFinishstatus != '')item.upFinishstatus = '已拨打'
				})
			},
			// 其他请求
			async DialStatistics(){
				const res = await this.$myRequest({
					url: '/js/a/statistics/loginOrganDialStatistics?__sid=' + uni.getStorageSync('sessionid') + '&pageNum=' + 1,
					method: 'POST',
					header: {
						'content-type': 'application/json',
					},
					data: {}
				})
				console.log(res.data)
				this.CustomCount = res.data;
			},
			intention(){
				console.log("查询")
			}
		}
	}
</script>

<style>
	.ai {
		border-top: 1px solid #DCDEE0;
	}
	.fixed{
		width: 100%;
		/* position: fixed; */
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

	.recharge {
		color: #2979FF;
	}

	.ai_select {
		width: 100%;
		height: 70px;
		border-bottom: 1px solid #DCDEE0;
		display: flex;
		align-items: center;
	}
	.select_date{
		flex: 1;
		padding: 0 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.seledate{
		width: 80%;
		border-bottom: 1px solid #DCDEE0;
	}
	.select_btn{
		padding-top: 8px;
	}
	.showOther{
		width: 100%;
		height: 50px;
		border-bottom: 3px solid #DCDEE0;
		display: flex;
		align-items: center;
	}
	.schedule{
		border-right: 1px solid #DCDEE0;
	}
	.schedule, .duration{
		flex: 1;
		text-align: center;
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

</style>
