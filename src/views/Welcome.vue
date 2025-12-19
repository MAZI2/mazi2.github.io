<template>
  <div class="content">
    <span><b>Welcome to <a href="https://mpog.dev">mpog.dev</a></b></span>
    <span>This is Matjaž Pogačnik’s personal website and a place for his work. If you have trouble using this website, read about it <a @click="openHelp"><b>[here]</b>.</a></span>
    <span>This website consists of 3 pages:</span>
    <span class="entry">
      <span class="title">
            <i class="fa fa-play"></i>
      <a @click="$emit('open-panel', { route: '/about', props: {title: 'About me', slug: 'about'}})"><b>About me</b></a>
          </span>
    <span class="description">
      A section about me, my contact information and relevant documents.
    </span>
      </span>
    <br>
    <span class="entry">
            <span class="title">
            <i class="fa fa-play"></i>
              <a @click="$emit('open-panel', { route: '/portfolio', props: { withMoreToCome: true, title: 'Portfolio', slug: 'portfolio' } })"><b>Portfolio</b></a>
          </span>
          <span class="description">
            My portfolio which includes my academic/scientific projects as well as cross-disciplinary art.
    </span>
    </span>
    <span class="entry">
            <span class="title">
            <i class="fa fa-play"></i>
            <a @click="$emit('open-panel', { route: '/blog', props: { withMoreToCome: true, title: 'Blog', slug: 'blog' } })"><b>Blog</b></a>
          </span>
          <span class="description">
      A blog of my other endeavours and mini-projects.
    </span>
    </span>
    <img class="picture" src="https://mpog.dev/content/pictureOfMe.jpg"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

const emit = defineEmits<{
  (e: 'open-panel', payload: { route: string; props?: any }): void
}>()

const props = defineProps<{ projects: any[] }>()

const websiteProject = computed(() =>
    props.projects.find(p => p.slug.toLowerCase() === 'website')
)

const openHelp = () => {
  let panelProps: any = {}
  panelProps.project = websiteProject
  panelProps.title = 'About this website'
  panelProps.slug = websiteProject.value.slug

  emit('open-panel', { route: 'openProject', props: panelProps })
}
</script>

<style scoped>
.content {
  display: flex;
  gap: 15px;
  padding: 20px;
  flex-direction: column;
  height: 300px;

  img {
    align-self: flex-end;
    max-width: 220px;
    border-radius: 10px;
    width: auto;
    height: auto;
  }
  .entry {
    .title {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
  .description {
    margin: 0;
    padding: 0;
  }
}
</style>
<script setup lang="ts">
</script>