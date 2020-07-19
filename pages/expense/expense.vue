<template>
	<view class="expense">
		<view class="fixed">
			<!-- <view class="balance">
				<view class="balance_money">
					可用余额：￥7100.25
				</view>
				<view class="balance_btn">
					<button class="mini-btn" type="primary" size="mini">充值</button>
				</view>
			</view> -->
			<!-- <view class="census_title">
				<text class="census_txt">费用统计</text>
			</view> -->
			<view class="census_select">
				<view class="select_status">
					<u-input v-model="Personstatus" placeholder="请选择状态" type="select" @click="show = true" />
					<u-select v-model="show" mode="single-column" :list="list" @confirm="confirm"></u-select>
				</view>
				<view class="select_date">
					<u-input v-model="search_date" placeholder="请选择日期范围" type="select" @click="selectdate" />
					<u-calendar v-model="select_date" mode="range" @change="setpicker"></u-calendar>
				</view>
				<view class="select_btn">
					<button class="mini-btn" type="primary" size="mini" @click="intention">查询</button>
				</view>
			</view>
		</view>
		<view class="aiList_main">
			<view class="aiList_content">
				<view>
					1
				</view>
				<view>
					2
				</view>
				<view>
					3
				</view>
				<view>
					4
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
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
					},
					{
						value: '3',
						label: '未接通'
					}
				],
			}
		},
		methods: {
			selectdate() {
				this.select_date = true;
			},
			setpicker(e) {
				console.log(e)
				this.search_date = e.startDate + ' 至 ' + e.endDate;
			},
			select() {
				console.log('搜索')
			},
			confirm(e) {
				console.log(e);
				this.Personstatus = e[0].label
			},
			onConfirm(res, type) {
				this.result = res;
				console.log(res)
			},
			onCancel() {

			}
		}
	}
</script>

<style>
	.expense {
		border-top: 1px solid #DCDEE0;
	}

	.fixed {
		width: 100%;
		position: fixed;
		z-index: 999;
		background-color: #FFFFFF;
	}

	.balance {
		width: 100%;
		height: 60px;
		border-bottom: 5px solid #E4E7ED;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.census_title {
		width: 100%;
		height: 60px;
		line-height: 60px;
		padding: 0 20px;
		border-bottom: 1px solid #DCDEE0;
	}

	.census_txt {
		font-size: 18px;
		font-weight: 500;
		border-bottom: 3px solid #007aff;
		padding-bottom: 3px;
	}

	.census_select {
		width: 100%;
		height: 60px;
		border-bottom: 1px solid #DCDEE0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
		padding: 0 10px;
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
	.aiList_main{
		padding-top: 65px;
	}
	.aiList_content{
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 2px solid #DCDEE0;
		box-shadow:#DCDEE0 0px 0px 5px 2px;
	}
</style>
