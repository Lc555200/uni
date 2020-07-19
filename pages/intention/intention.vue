<template>
	<view class="intention">
		<view class="title">
			您有{{strip}}条意向用户！
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
				<button class="mini-btn" type="primary" size="mini" @click="intention">查询</button>
			</view>
		</view>

		<!-- 列表 -->
		<view>
			<view class="list_title">
				<view>时间</view>
				<view>电话</view>
				<view>人工拨打</view>
				<view>拨打状态</view>
			</view>
			<view class="list_item" v-for="item in dataList" :key="item.upAiphone">
				<view class="date list-item">
					{{item.upAiendtime}}
				</view>
				<view class="tel list-item">
					{{item.newPhone}}
				</view>
				<view class="outbound list-item" @click="dadianhua(item.upAiphone)">

				</view>
				<view class="rengongstatus list-item">
					<view :class="item.upPersonstatus == '0' ? 'upPersonstatus':''" @click="ChangeStatus(0, item)">未拨打</view>
					<view :class="item.upPersonstatus == '1' ? 'upPersonstatus':''" @click="ChangeStatus(1, item)">已拨打</view>
					<view :class="item.upPersonstatus == '2' ? 'upPersonstatus':''" @click="ChangeStatus(2, item)">未接听</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				stutas:'',
				beginTime:'',
				endTime:'',
				Personstatus: '',
				person: '',
				strip: 0,
				dataList: [],
				search_date: "",
				select_date: false,
				show: false,
				list: [{
						value: '0',
						label: '未拨打'
					},
					{
						value: '1',
						label: '已拨打'
					},
					{
						value: '2',
						label: '未接听'
					}
				],

			}
		},
		mounted() {
			this.intention()
		},
		methods: {
			confirm(e) {
				console.log(e);
				this.stutas = e[0].value
				this.Personstatus = e[0].label
			},
			onConfirm(res, type) {
				this.result = res;
				console.log(res)
			},
			onCancel() {

			},
			dadianhua(tel) {
				console.log(tel)
				uni.makePhoneCall({
					phoneNumber: tel,
					success: (res) => {
						console.log('调用成功!')
					},
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},
			async intention() {
				// /apis/js/a/clue/intentionClue
				const res = await this.$myRequest({
					url: '/js/a/clue/intentionClue?__sid=' + uni.getStorageSync('sessionid') + '&pageNum=' + 1,
					method: 'POST',
					data: {
						upPersonstatus: this.stutas,
						beginTime: this.beginTime,
						endTime: this.endTime
					},
					header: {
						'content-type': 'application/json',
					}

				})
				console.log(res.data)
				this.dataList = res.data.pageInfo.list
				this.strip = res.data.pageInfo.total
				this.dataList.forEach((item, key) => {
					let phonenumber = item.upAiphone.replace(item.upAiphone.substring(3, 7), '****')
					item.newPhone = phonenumber
					console.log(item)
					if (item.source == '1') {
						item.source = '潜在用户'
					} else {
						item.source = '推荐用户'
					}
				})
			},
			async ChangeStatus(val, row) {
				this.person = val;
				console.log(row)
				const res = await this.$myRequest({
					url: '/js/a/clue/personStatusChange?__sid=' + uni.getStorageSync('sessionid') + '&personStatusChange=' + this.person,
					method: 'POST',
					data: row,
					header: {
						'content-type': 'application/json',
					}

				})
				this.intention()
			},
			selectdate() {
				this.select_date = true;
			},
			setpicker(e) {
				console.log(e)
				this.beginTime = e.startDate;
				this.endTime = e.endDate
				this.search_date = e.startDate + ' 至 ' + e.endDate;
			}

		}
	}
</script>

<style>
	.intention {
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}

	.title {
		text-align: center;
		/* border-bottom: 3px solid #ccc; */
		padding: 50px 0 10px 0;
		margin: 0 0 5px 0;
		font-size: 18px;
	}

	.select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
		padding: 0 10px;
	}
	.select_status{
		width: 25%;
		border-bottom: 1px solid #DCDEE0;
	}
	.select_date{
		width: 55%;
		border-bottom: 1px solid #DCDEE0;
	}
	.select_btn{
		padding-top: 8px;
	}
	.list_title {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 0 0 5px 0;
		width: 100%;
		height: 120rpx;
		color: #000000;
		font-size: 25rpx;
		border-bottom: 1px solid #DCDEE0;
		box-shadow: #DCDEE0 0px 0px 5px 2px;
	}

	.list_title uni-view {
		width: 25%;
		text-align: center;
	}

	.list_item {
		display: flex;
		align-items: center;
		width: 100%;
		height: 160rpx;
		color: #000000;
		margin-bottom: 3px;
		font-size: 12px;
		border-bottom: 2px solid #DCDEE0;
	}

	.list-item {
		width: 25%;
		text-align: center;
	}

	.date {
		/* width: 20%; */
	}

	.outbound {
		/* width: 20px; */
		height: 20px;
		background: url(../../static/Outbound.png) no-repeat 50%;
	}

	.rengongstatus view {
		margin-bottom: 3px;
	}

	.upPersonstatus {
		color: #007AFF;
	}
</style>
