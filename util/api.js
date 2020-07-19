const BASE_URL = 'http://192.168.1.4:8980'
export const myRequest = (options)=>{
	return new Promise((resolve, reject)=>{
		uni.request({
			url:BASE_URL+options.url,
			method:options.method || 'GET',
			data:options.data || {},
			header:options.header || {},
			success: (res) => {
				resolve(res)
			},
			fail:(err)=>{
				console.log('请求失败')
				reject(err)
			}
		})
	})
}