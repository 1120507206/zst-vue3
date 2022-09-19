<template>
  <ElRow class="form">
    <ElCol class="form__components">
      <template v-if="basicFields.length">
        <div class="form__components-cate">
          基础字段
        </div>
        <Draggable
          tag="ul"
          item-key="type"
          :list="basicComponents"
          v-bind="{group:{ name:'form-item', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
        >
          <template #item="{ element }">
            <li
              v-if="basicFields.includes(element.type)"
              :key="element.type"
              class="form__components-item"
              :class="{'no-put': element.type === 'divider'}"
            >
              <a>
                <i
                  class="icon iconfont"
                  :class="element.icon"
                />
                <span>{{ element.name }}</span>
              </a>
            </li>
          </template>
        </Draggable>
      </template>
      <template v-if="advanceFields.length">
        <div class="form__components-cate">
          高级字段
        </div>
        <Draggable
          tag="ul"
          item-key="type"
          :list="advanceComponents"
          v-bind="{group:{ name:'form-item', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
        >
          <template #item="{ element }">
            <li
              v-if="advanceFields.includes(element.type)"
              :key="element.type"
              class="form__components-item"
              :class="{'no-put': element.type === 'divider'}"
            >
              <a>
                <i
                  class="icon iconfont"
                  :class="element.icon"
                />
                <span>{{ element.name }}</span>
              </a>
            </li>
          </template>
        </Draggable>
      </template>
      <template v-if="layoutFields.length">
        <div class="form__components-cate">
          布局字段
        </div>
        <Draggable
          tag="ul"
          item-key="type"
          :list="layoutComponents"
          v-bind="{group:{ name:'form-item', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
        >
          <template #item="{ element }">
            <li
              v-if="layoutFields.includes(element.type)"
              :key="element.type"
              class="form__components-item"
              :class="{'no-put': element.type === 'divider'}"
            >
              <a>
                <i
                  class="icon iconfont"
                  :class="element.icon"
                />
                <span>{{ element.name }}</span>
              </a>
            </li>
          </template>
        </Draggable>
      </template>
    </ElCol>
    <ElCol class="form__container">
      <ElHeader class="btn-bar">
        <ElButton
          type="text"
          icon="el-icon-view"
          size="medium"
        >
          预览
        </ElButton>
      </ElHeader>

      <FormArea class="form__container-area" />
    </ElCol>
    <ElCol class="form__config" />
  </ElRow>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import {
  ElRow,
  ElCol,
  ElHeader,
  ElButton,
} from 'element-plus';
import Draggable from 'vuedraggable';
import {
  basicComponents,
  layoutComponents,
  advanceComponents,
} from '@/config/componentsConfig';
import FormArea from './components/FormArea.vue';

export default defineComponent({
  name: 'CustomForm',
  components: {
    ElRow,
    ElCol,
    ElHeader,
    ElButton,
    Draggable,
    FormArea,
  },
  setup() {
    return {
      basicComponents,
      basicFields: ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'select', 'switch', 'slider', 'text'],
      layoutComponents,
      layoutFields: ['grid'],
      advanceComponents,
      advanceFields: ['imgupload', 'cascader'],
    };
  },
});
</script>

<style lang="scss" scoped>
.form {
  height: 100%;
  .form__components {
    padding: 10px 0;
    flex: 0 0 250px;
    height: 100%;
    overflow: auto;

    .form__components-cate {
      padding: 8px 12px;
      font-size: 13px;
    }

    ul {
      margin: 0;
      padding: 0 10px 10px;
      overflow: hidden;

      li {
        display: block;
        float: left;
        box-sizing: border-box;
        margin: 1%;
        border: 1px solid #f4f6fc;
        width: 48%;
        font-size: 12px;
        line-height: 26px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        a {
          display: block;
          cursor: move;
          color: #333;
          background: #f4f6fc;
          border: 1px solid #f4f6fc;

          .icon {
            margin-right: 6px;
            margin-left: 8px;
            font-size: 14px;
            display: inline-block;
            vertical-align: middle;
          }

          span {
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .form__container {
    flex: 1;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    height: 100%;
    overflow: hidden;
    // background-color: green;

    .btn-bar {
      padding: 0 20px;
      border-bottom: 2px solid #e4e7ed;
      height: 45px;
      line-height: 45px;
      text-align: right;
    }

    .form__container-area {
      height: calc(100% - 47px);
      background-color: #fafafa;
      overflow: hidden auto;

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
  .form__config {
    flex: 0 0 300px;
    height: 100%;
    overflow: hidden;
    // background-color: blue;
  }
}
</style>
