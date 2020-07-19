<template>
	<view>
		<!-- 多个复选框，带全选 -->
		<view>
			<checkbox-group class="block" @change="changeCheckbox">
				<view v-for="item in checkboxData" :key="item.flag">
					<checkbox :value="String(item.flag)" :checked="checkedArr.includes(String(item.flag))" :class="{'checked':checkedArr.includes(String(item.flag))}"></checkbox>
					<text>{{item.label}}</text>
				</view>
			</checkbox-group>
		</view>
		<view>
			<checkbox-group @change="allChoose">
				<label>
					<checkbox value="all" :class="{'checked':allChecked}" :checked="allChecked?true:false"></checkbox> 全选
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkboxData: [{
						'flag': 0,
						'label': '选项一'
					},
					{
						'flag': 1,
						'label': '选项二'
					},
					{
						'flag': 2,
						'label': '选项三'
					},
					{
						'flag': 3,
						'label': '选项四'
					},
					{
						'flag': 4,
						'label': '选项五'
					},
					{
						'flag': 5,
						'label': '选项六'
					},
					{
						'flag': 6,
						'label': '选项七'
					},
					{
						'flag': 7,
						'label': '选项八'
					},
					{
						'flag': 8,
						'label': '选项九'
					},
					{
						'flag': 9,
						'label': '选项十'
					}
				],
				isChecked: false,
				checkedArr: [], //复选框选中的值
				allChecked: false //是否全选
			}
		},
		methods: {

			// 多选复选框改变事件
			changeCheckbox(e) {
				console.log(e.detail.value)
				this.checkedArr = e.detail.value;
				console.log(this.checkedArr)
				// 如果选择的数组中有值，并且长度等于列表的长度，就是全选
				if (this.checkedArr.length > 0 && this.checkedArr.length == this.checkboxData.length) {
					this.allChecked = true;
				} else {
					this.allChecked = false;
				}
			},
			// 全选事件
			allChoose(e) {
				let chooseItem = e.detail.value;
				// 全选
				if (chooseItem[0] == 'all') {
					this.allChecked = true;
					for (let item of this.checkboxData) {
						let itemVal = String(item.value);
						if (!this.checkedArr.includes(itemVal)) {
							this.checkedArr.push(itemVal);
						}
					}
				} else {
					// 取消全选
					this.allChecked = false;
					this.checkedArr = [];
				}
			}
		}
	}
</script>

<style>
</style>
