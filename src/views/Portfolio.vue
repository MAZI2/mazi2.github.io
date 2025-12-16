<template>
  <div>
    <div class="portfolio-menu">
      <i :class="viewGrid ? 'fa fa-th-large' : 'fa fa-list'" @click="toggleView"></i>
    </div>

    <div :class="['projects', { list: !viewGrid }]">
      <div v-for="project in projects" :key="project.title" class="project-card">
        <!-- Clicking the image opens the full content in a panel -->
        <img :src="project.image" alt="" @click="openProjectPanel(project)" />
        
        <h3>{{ project.title }}</h3>
        <p v-html="viewGrid ? project.short : project.long"></p>

        <!-- Only show Markdown content in grid view if desired -->
        <div v-if="viewGrid" class="content" v-html="renderMarkdown(project.content)" @click="handleLinkClick"></div>
      </div>
    </div>
  </div>
</template>
  

<script setup lang="ts">
import { ref } from 'vue'
import { marked } from 'marked'

import IFrameComponent from '../vue/components/IFrameComponent.vue'

const emit = defineEmits<{
  (e: 'open-panel', url: string): void
}>()

const viewGrid = ref(true)
const toggleView = () => (viewGrid.value = !viewGrid.value)

// Load markdown projects
const projectFiles = import.meta.glob('../projects/*.md', { eager: true, as: 'raw' })

interface Project {
  title: string
  date: string
  short: string
  long: string
  image: string
  content: string
}

const projects = ref<Project[]>(Object.entries(projectFiles).map(([path, raw]: [string, string]) => {
  const frontmatterMatch = raw.match(/---\n([\s\S]*?)\n---/)
  let metadata: any = {}
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1]
    yaml.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':')
      metadata[key.trim()] = rest.join(':').trim()
    })
  }
  const content = raw.replace(/---[\s\S]*?---/, '').trim()
  return { ...metadata, content }
}))

// Render markdown normally
const renderMarkdown = (md: string) => marked(md)

// Delegate link clicks in markdown
const handleLinkClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'A') {
    e.preventDefault() // prevent navigation
    const href = (target as HTMLAnchorElement).href

    // Emit panel with OpenExternal
    emit('open-panel', { route: 'openExternal', props: { url: href } })
  }
}


// Open a panel with full project content
const openProjectPanel = (project: Project) => {
  emit('open-panel', {
    route: 'openProject', // tells parent to use ProjectPanel
    props: { project }     // pass the project object
  })
}

</script>


<style scoped>
.projects {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
.projects.list .project-card {
  display: flex;
  gap: 12px;
}
.project-card {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
}
.projects.list .project-card img {
  width: 150px;
  height: auto;
}
</style>

