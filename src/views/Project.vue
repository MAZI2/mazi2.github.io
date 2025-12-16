<template>
  <div class="project-panel">
    <h2>{{ project.title }}</h2>
    <p>{{ project.date }}</p>
    <div v-html="renderMarkdown(project.content)" @click="handleLinkClick"></div>
    <img :src="project.image" alt="" />
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
const props = defineProps<{ project: any }>()
const emit = defineEmits<{
  (e: 'open-panel', url: string | object): void
}>()

const renderMarkdown = (md: string) => marked(md)

const handleLinkClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'A') {
    e.preventDefault()
    const href = (target as HTMLAnchorElement).href

    // Emit panel with OpenExternal component
    emit('open-panel', {
      route: 'openExternal',
      props: { url: href }
    })
  }
}

</script>

<style scoped>
.project-panel {
    padding: 0 20px;

        img {
      align-self: flex-end;
      max-width:220px;
      border-radius: 10px;
  width: auto;
  height: auto;
  }
}
</style>

