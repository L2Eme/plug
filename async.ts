/**
 * 使用return handler(action)的情况下，js没有尾递归优化，使用Promise可以避免内存溢出
 */
export type THandler = (action: any) => Promise<any>

export type TPlug<T> = (this: T, handler: THandler) => THandler

export function createHandler<T>(context: T | null, plugs: TPlug<T>[], rootHandler?: THandler): THandler {

	function _inner(plugs: TPlug<T>[], index: number): THandler {
		if (index === plugs.length) {
			return rootHandler?.bind(context) ?? ((v: any) => Promise.resolve(v))
		}
		else {
			let p = plugs[index];
			return (v: any) => {
				// 执行时打包next操作，将next封装为promise，promise会被当作结果返回，并在下一个plug开始前等待
				let next = (v: any) => Promise.resolve(v).then(v => _inner(plugs, index + 1)(v))
				return (p as any).bind(context)(next)(v)
			}
		}
	}

	return _inner(plugs, 0)
}

export function combinePlugs<T>(...plugs: TPlug<T>[]): TPlug<T> {
	return function (this: T, handler: THandler) {
		return createHandler(this, plugs, handler);
	}
}