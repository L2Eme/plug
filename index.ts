// 可以处理不同类型的action，比如thunk类型
// 把thunk promise变成流
// 用作输入action的截流，转换，检查
// from clojure plug module

/**
 * 因为在plug链中，action可能会被转变，所以使用any类型。
 * 
 * 但是在具体过程中，可以定义其他类型作为编写时的辅助。
 */
export type THandler = (action: any) => any

/**
 * 是一种monad.
 * 将context放在function的this上
 */
export type TPlug<T> = (this: T, handler: THandler) => THandler

/**
 * 
 * 将plug打包为一个handler,
 * 处理过程为
 * 
 * ```
 * [
 * 		plug0, // 处理外层
 * 		plug1, // 向内层处理
 * 		...
 * 		rootHandler // 最终处理
 * ]
 * ```
 * 
 * @param context context among plugs
 * @param plugs plugs list
 * @param rootHandler default is v => v
 * @returns 
 */
export function createHandler<T>(context: T | null, plugs: TPlug<T>[], rootHandler?: THandler) {
	return plugs.reduceRight(
		(h, p) => (p as any).bind(context)(h),
		(rootHandler ?? ((v: any) => v)) as any,
	);
}

/**
 * 合并一组plug，生成函数再绑定任何handler和context
 * @param plugs plugs list
 * @returns 
 */
export function combinePlugs<T>(...plugs: TPlug<T>[]): TPlug<T> {
	return function (this: T, handler: THandler) {
		return createHandler(this, plugs, handler);
	}
}