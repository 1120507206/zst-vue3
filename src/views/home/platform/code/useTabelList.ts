import { ref } from 'vue';
import type { ResResult } from './data.d';

const list = ref<ResResult.tableList[]>([]);

/**
 * @TODO 缺少返回类型
 *  @typescript-eslint/explicit-module-boundary-types
 */
// eslint-disable-next-line
const useTableList = () => list;

export default useTableList;
