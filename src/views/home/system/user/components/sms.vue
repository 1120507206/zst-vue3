<template>
  <el-dialog title="设置短信通知人" width="31%" v-model="isShowModal">
    <div>用户剩余项目数、剩余接口次数不足时通知</div>
    <div class="sms-box">
      <span> 通知人名称：</span>
      <el-select
        v-model="contactsId"
        multiple
        class="center"
        placeholder="Select"
        size="large"
      >
        <el-option
          v-for="item in contactsList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button type="primary">清空</el-button>
    </div>
    <div>
      <el-button
        type="primary"
        @click="save"
        style="margin-left: 200px; margin-top: 30px;"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref ,watch} from "vue";
  import { useVModel } from "@vueuse/core";
  import { getListPage, saveContact,getContact } from "../service";
  import { ElMessage } from "element-plus";
  // const isShowModal =ref(false)
  const props = defineProps<{
    visible: boolean;
    userId: string;
  }>();
  const emit = defineEmits(["update:modelValue"]);
  const isShowModal = useVModel(props, "visible");
  const contactsId = ref<any>("");
  const contactsList = ref<any>([]);
  //查询条件
  const getPageData = async () => {
    const params = {
      pageIndex: "1",
      pageSize: "999",
    };
    const {
      data: { success, message, obj },
    } = await getListPage(params);
    contactsList.value = obj.data;
    console.log(' contactsList.value :>> ',  contactsList.value);
  };
  getPageData();
//指定用户获取联系人

  const getContactList  = async()=>{
   const params = {
   userId:props.userId
   }
       try {
      const {
        data: { success, message ,obj},
      } = await getContact(params);
      if (success) {
     contactsId.value =  obj.contactIds
      console.log('指定用户获取联系人obj :>> ', obj);
      } else {
        ElMessage.error(message);
      }
    } catch (e) {
    }
  console.log('props.userId 1111:>> ', props.userId);

  }
   watch(() => props.userId, (cur) => {
    getContactList()
    });
//保存
  const save = async () => {
    const params = {
      contactIds:contactsId.value,
      userId: props.userId,
    };
    try {
      const {
        data: { success, message },
      } = await saveContact(params);
      if (success) {
        ElMessage.success("设置成功！");
isShowModal.value = false;
      } else {
        ElMessage.error(message);
      }
    } catch (e) {
      console.log("error", e);
    }
    // const {
    //   data: { success, message, obj },
    // } = await saveContact(params);
  };
  // const isShowModal = useVModel(props, 'modelValue', emit)
</script>

<style lang="scss" scoped>
  .sms-box {
    display: flex;
    // justify-content: center;
    align-items: center;
    .center {
      width: 250px;
      margin: 0 20px;
    }
  }
</style>
