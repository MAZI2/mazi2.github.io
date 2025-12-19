<template>
  <div class="project-panel">
      <span class="heading">
        <h2 v-html="project.title"></h2>

      </span>
    <span class="colab">
             <p v-if="project.colab && project.colab.length">
        with
        <template v-for="(c, index) in project.colab" :key="c.name">
          <a v-if="c.link" :href="c.link" target="_blank">{{ c.name }}</a>
          <span v-else>{{ c.name }}</span>
          <span v-if="index < project.colab.length - 1">, </span>
        </template>
    </p>
            <span>{{ formatDate(project.date) }}</span>
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

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}
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

    h2 {
      margin: 20px 0 0 0;
    }
  }

  .colab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;

    span, p {
      margin: 0px;
      cursor: pointer;
    }
  }
}
</style>

