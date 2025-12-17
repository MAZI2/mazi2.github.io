<template>
  <div ref="root"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { marked } from 'marked'
import IframeComponent from './components/IframeComponent.vue'
import { createApp } from 'vue'

const props = defineProps<{ content: string }>()

const root = ref<HTMLElement | null>(null)

const render = () => {
  if (!root.value) return

  root.value.innerHTML = marked(props.content)

  root.value.querySelectorAll('iframe-placeholder').forEach(node => {
    const url = node.getAttribute('data-url')!
    const mount = document.createElement('div')
    node.replaceWith(mount)

    createApp(IframeComponent, { url }).mount(mount)
  })
}

onMounted(render)
watch(() => props.content, render)
</script>

