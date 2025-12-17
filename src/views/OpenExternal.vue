<template>
  <IFrameComponent :url="url" class="iframe"/>
</template>

<script lang="ts" setup>
import IFrameComponent from '../vue/components/IFrameComponent.vue'

defineProps<{ url: string }>()
</script>

<style scoped>
.iframe {
  height: 95%;
}
</style>
