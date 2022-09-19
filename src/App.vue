<template>
  <el-config-provider :locale="elementPlusLocales">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { ElConfigProvider } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { elementPlusMessages } from '@/config/i18n';
import { setHtmlLang } from '@/utils/i18n';

export default defineComponent({
  name: 'App',

  components: {
    ElConfigProvider,
  },

  setup() {
    const { locale } = useI18n();
    const elementPlusLocales = computed(() => elementPlusMessages[locale.value]);

    onMounted(() => {
      setHtmlLang(locale.value);
    });

    return {
      elementPlusLocales,
    };
  },
});
</script>
