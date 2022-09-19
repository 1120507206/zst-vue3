<template>
  <div
    class="form-item"
    @click.stop="handleCheck"
  >
    <!-- {{selectIndex === index}}---{{selectIndex}}---{{index}} -->
    <ElFormItem :label="config.name">
      <ElInput v-if="config.type === 'input'" />
      <ElInput
        v-else-if="config.type === 'textarea'"
        type="textarea"
      />
      <ElInputNumber v-else-if="config.type === 'number'" />
      <ElRadioGroup v-else-if="config.type === 'radio'">
        <ElRadio
          v-for="item in config.options.options"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </ElRadio>
      </ElRadioGroup>
      <ElCheckboxGroup
        v-else-if="config.type === 'checkbox'"
        :model-value="[]"
      >
        <ElCheckbox
          v-for="item in config.options.options"
          :key="item.value"
          :label="item.value"
        />
      </ElCheckboxGroup>
      <ElDatePicker
        v-else-if="config.type === 'time'"
        type="date"
      />
      <ElDatePicker
        v-else-if="config.type === 'date'"
        type="datetime"
      />
    </ElFormItem>
    <div class="form-item-action">
      <div class="form-item-action-icons">
        <i class="iconfont icon-icon_clone" />
        <i class="iconfont icon-trash" />
      </div>
    </div>

    <div class="form-item-drag">
      <i class="iconfont icon-drag form-item-drag" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/no-dupe-keys */
import {
  defineComponent,
  computed,
} from 'vue';
import {
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElDatePicker,
} from 'element-plus';

export default defineComponent({
  name: 'FormItem',
  components: {
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElRadioGroup,
    ElRadio,
    ElCheckboxGroup,
    ElCheckbox,
    ElDatePicker,
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        name: '',
      }),
    },
    // selectIndex: {
    //   type: Number,
    //   default: 0,
    // },
    // index: {
    //   type: Number,
    //   default: 0,
    // },
  },
  emits: ['update:selectIndex'],
  setup(props, { emit }) {
    const config = computed(() => props.config);
    // const selectIndex = computed(() => props.selectIndex);
    // const index = computed(() => props.index);

    const handleCheck = () => {
      //   console.log(config);
      // emit('update:selectIndex', index.value);
    };

    return {
      config,
      // selectIndex,
      // index,

      handleCheck,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-item {
  position: relative;
  margin: 2px;
  padding-bottom: 18px;
  border: 1px dashed rgba(170, 170, 170, 0.7);
  background-color: rgba(236, 245, 255, 0.3);

  &:hover {
    background: #ecf5ff;
    outline: 1px solid #409eff;
    outline-offset: 0px;
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
  }

  .form-item-action {
    display: none;
  }

  .form-item-drag {
    display: none;
  }

  i {
    background: #409eff;
    color: #fff;
  }
}

.form-item__active {
  .form-item-action {
    display: block;
    position: absolute;
    bottom: -1px;
    right: -1px;
    outline: 2px solid #409eff;
    border: 1px solid #409eff;
    width: 100%;
    height: 100%;
    .form-item-action-icons {
      position: absolute;
      bottom: 0;
      right: 0;

      i {
        padding: 5px 4px 4px 5px;
        cursor: pointer;
      }
    }
  }
  .form-item-drag {
    display: block;
    position: absolute;
    top: 0;
    left: 0;

    i {
      padding: 4px 5px 5px 4px;
      cursor: move;
    }
  }
}
</style>
