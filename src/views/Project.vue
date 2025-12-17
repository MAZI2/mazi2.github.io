<template>
  <div class="project-panel">
      <span class="heading">
        <h2>{{ project.title }}</h2>
        <p>{{ project.date }}</p>
      </span>
    <MarkdownRenderer :content="project.content" @click="handleLinkClick"/>
  </div>
</template>

<script lang="ts" setup>
import {marked} from 'marked'
import MarkdownRenderer from '../vue/MarkdownRenderer.vue'

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
      props: {url: href}
    })
  }
}

</script>

<style scoped>
.project-panel {
  padding: 0 20px;

  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

