<template>
  <IFrameComponent class="iframe" :url="url" />
</template>

<script setup lang="ts">
import IFrameComponent from '../vue/components/IFrameComponent.vue'
defineProps<{ url: string }>()
</script>

<style scoped>
.iframe {
    height: 95%;
} 
</style>
