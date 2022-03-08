const { combinePlugs, createHandler } = require('../dist/cjs/async')

let rootHandler = (v) => {
	console.log('reach root value', v)
	return Promise.resolve(v)
}

let PlugN = (n) => function(next) {
	return (v) => {
		if (v % 100 === 0) {
			console.log(`plug${n} context: ${this}, action: ${v}`)
		}

		// 内存不会溢出，不过有明显的垃圾回收操作
		// await next(v + 1)

		return next(v + 1)
	}
}

let plugs = []
for (let i = 0; i < 100000; i ++) {
	plugs.push(PlugN(i))
}

let h = createHandler({}, plugs, rootHandler);
h(0).then(ret => console.log('result', ret))
