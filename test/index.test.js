const { createHandler } = require('../dist/cjs/index')

let rootHandler = (v) => {
	console.log('reach root value', v)
	return Promise.resolve(v)
}

let PlugN = (n) => function(next) {
	return (v) => {
		if (v % 100 === 0) {
			console.log(`plug${n} context: ${this}, action: ${v}`)
		}

		// plug10300 内存溢出
		return next(v + 1)
	}
}

let plugs = []
for (let i = 0; i < 1000; i ++) {
	plugs.push(PlugN(i))
}

let h = createHandler({}, plugs, rootHandler);
h(0).then(ret => console.log('result', ret))
