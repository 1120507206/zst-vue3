<template>
  <div>
    <div class="area">
      <ElForm
        class="form-list"
        :size="data.config.size"
        label-suffix=":"
        :label-position="data.config.labelPosition"
        :label-width="data.config.labelWidth + 'px'"
      >
        <Draggable
          v-model="data.list"
          class="area-drag"
          item-key="id"
          v-bind="{group:'form-item', ghostClass: 'ghost',animation: 200, handle: '.form-item-drag'}"
          @add="handleAdd"
        >
          <template #item="{ element }">
            <FormItem
              v-if="element.type !== 'grid'"
              :config="element"
            />
            <div v-else>
              <ElRow class="layout__flex">
                <ElCol
                  v-for="(item, index) in element.columns"
                  :key="index"
                  :span="12"
                  class="layout__flex-item"
                >
                  <Draggable
                    v-model="item.list"
                    style="min-height:50px;"
                    item-key="id"
                    v-bind="{group:'form-item', ghostClass: 'ghost',animation: 200, handle: '.form-item-drag'}"
                  >
                    <template #item="{ element }">
                      <ElRow>
                        <ElCol>
                          <FormItem
                            v-if="element.type !== 'grid'"
                            :config="element"
                          />
                        </ElCol>
                      </ElRow>
                    </template>
                  </Draggable>
                </ElCol>
              </ElRow>
            </div>
          </template>
        </Draggable>
      </ElForm>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
} from 'vue';
import {
  ElForm,
  ElRow,
  ElCol,
} from 'element-plus';
import Draggable from 'vuedraggable';
import FormItem from './FormItem.vue';

interface DataType {
  list: any[];
  config: {
    labelWidth: number;
    labelPosition: string;
    size: string;
  }
}

export default defineComponent({
  name: 'FormArea',
  components: {
    ElForm,
    Draggable,
    FormItem,
    ElRow,
    ElCol,
  },
  setup() {
    const data = reactive<DataType>({
      list: [],
      config: {
        labelWidth: 100,
        labelPosition: 'right',
        size: 'small',
      },
    });

    // const selectIndex = ref(0);

    // watch(() => data.list.length, (cur) => {
    //   if (cur >= 2) {
    //     console.log(data.list[0] === data.list[1]);
    //   }
    // });

    const handleAdd = (e) => {
      // selectIndex.value = e.newIndex;
    };

    return {
      data,

      // selectIndex,

      handleAdd,
    };
  },
});
</script>

<style lang="scss" scoped>
.area {
  .form-list {
    position: relative;
    margin: 10px;
    border: 1px dashed #999;
    height: 100%;
    background: #fff;

    .area-drag {
      width: 100%;
      min-height: 600px;
    }

    .ghost {
      background: #f56c6c;
      border: 2px solid #f56c6c;
      outline-width: 0;
      height: 3px;
      box-sizing: border-box;
      font-size: 0;
      content: '';
      overflow: hidden;
      padding: 0;
    }
  }
}

.layout__flex {
  margin: 2px;
  .layout__flex-item {
    padding: 4px;
    border: 1px dashed rgba(170, 170, 170, 0.7);
    min-height: 50px;
  }
}
</style>
