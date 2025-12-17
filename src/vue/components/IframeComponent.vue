<template>
  <iframe
      :src="url"
      class="iframe-panel"
      sandbox="allow-scripts allow-same-origin allow-popups"
  ></iframe>
</template>

<script lang="ts" setup>
import {defineProps} from 'vue'

const props = defineProps<{
  url: string
}>()
</script>

<style scoped>
.iframe-panel {
  border: none;
  width: 100%;
  height: 1000px;
}
</style>

