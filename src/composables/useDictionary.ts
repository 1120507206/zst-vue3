import { ElMessage } from 'element-plus';
import { searchPage } from '@/views/home/platform/dictionary/service';

interface DictionaryItem {
  id: string,
  key: string,
  value: string,
  type: string,
}

export default async function useDictionary(type: string, key?: string): Promise<DictionaryItem[]> {
  try {
    const { data: { success, message, obj } } = await searchPage({
      type,
      ckey: key || '',
      pageIndex: 1,
      pageSize: 1000,
    });
    if (success) {
      return obj.data
        ? obj
          .data
          .map((item) => ({
            id: item.id,
            key: item.ckey,
            value: item.cvalue,
            type: item.type as string,
          }))
          // .sort((a, b) => Number(a.key) - Number(b.key))
        : [];
    }
    ElMessage.error(message);
    return [];
  } catch (e) {
    console.error('error', e);
    return [];
  }
}
