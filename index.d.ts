/**
 * 因为在plug链中，action可能会被转变，所以使用any类型。
 *
 * 但是在具体过程中，可以定义其他类型作为编写时的辅助。
 */
export declare type THandler = (this: any, action: any) => any;
/**
 * 是一种monad.
 * 将context放在function的this上
 */
export declare type TPlug<T> = (this: T, handler: THandler) => THandler;
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
 * @param rootHandler
 * @returns
 */
export declare function createHandler<T>(context: T | null, plugs: TPlug<T>[], rootHandler?: THandler): any;
/**
 * 合并一组plug，生成函数再绑定任何handler和context
 * @param plugs plugs list
 * @returns
 */
export declare function combinePlugs<T>(...plugs: TPlug<T>[]): TPlug<T>;
