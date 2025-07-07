<script setup lang="ts">
const props = defineProps({
  japanese: {
    type: Boolean,
    default: false,
  },
  version: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <template v-if="props.japanese">
    <div class="info-item">
      ℹ️ このルールは {{ props.version }} で
      <a href="/ja/rules/#recommended-rules"> recommended </a>
      ルールに含まれます。
    </div>
  </template>
  <template v-else>
    <div class="info-item">
      ℹ️ This rule will be included in
      <a href="/rules/#recommended-rules"> recommended </a>
      rules in {{ props.version }}.
    </div>
  </template>
</template>

<style scoped>
.status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
</style>
