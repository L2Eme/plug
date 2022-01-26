"use strict";
// 可以处理不同类型的action，比如thunk类型
// 把thunk promise变成流
// 用作输入action的截流，转换，检查
// from clojure plug module
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinePlugs = exports.createHandler = void 0;
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
function createHandler(context, plugs, rootHandler) {
    var _a;
    return plugs.reduceRight((h, p) => p.bind(context)(h), ((_a = rootHandler === null || rootHandler === void 0 ? void 0 : rootHandler.bind(context)) !== null && _a !== void 0 ? _a : (() => { })));
}
exports.createHandler = createHandler;
/**
 * 合并一组plug，生成函数再绑定任何handler和context
 * @param plugs plugs list
 * @returns
 */
function combinePlugs(...plugs) {
    return function (handler) {
        return createHandler(this, plugs, handler);
    };
}
exports.combinePlugs = combinePlugs;
