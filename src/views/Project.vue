<template>
  <div class="project-panel">
    <h2>{{ project.title }}</h2>
    <p>{{ project.date }}</p>
    <img :src="project.image" alt="" />
    <div v-html="renderMarkdown(project.content)" @click="handleLinkClick"></div>
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
    emit('open-panel', href)
  }
}
</script>

