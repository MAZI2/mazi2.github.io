<template>
  <div class="portfolio-top">
    <div class="separator"></div>
    <div class="portfolio-menu">
      <i
          :class="viewGrid ? 'fa fa-th-large' : 'fa fa-list'"
          aria-hidden="true"
          @click="toggleView"
      ></i>
    </div>
  </div>
  <div>

    <span class="header"><b>Portfolio</b></span>
    <div :class="['projects', { list: !viewGrid }]">
      <div
          v-for="project in projects"
          :key="project.title"
          class="project-card"
      >
        <!-- GRID VIEW -->
        <template v-if="viewGrid">
          <img
              :src="project.image"
              alt=""
              class="project-image"
              @click="openProjectPanel(project)"
          />
          <span class="left" @click="openProjectPanel(project)">
                    <i aria-hidden="true" class="fa fa-play" @click="openProjectPanel(project)"></i>
                    <b>{{ project.title }}</b>
                </span>
          <p class="short">{{ project.short }}</p>
        </template>

        <!-- LIST VIEW -->
        <template v-else>
            <span class="title">
                <span class="left" @click="openProjectPanel(project)">
                    <i aria-hidden="true" class="fa fa-play" @click="openProjectPanel(project)"></i>
                    <b>{{ project.title }}</b>
                </span>
                <span class="date">{{ project.date }}</span>
            </span>

          <span class="long">{{ project.long }}</span>

          <div class="list-gallery">
            <img
                v-for="(img, idx) in project.gallery"
                :key="idx"
                :src="img"
                class="list-thumb"
                @click="openProjectPanel(project)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {marked} from 'marked'

const emit = defineEmits<{
  (e: 'open-panel', payload: { route: string; props?: any }): void
}>()

const viewGrid = ref(false)
const toggleView = () => (viewGrid.value = !viewGrid.value)

const projectFiles = import.meta.glob('../projects/*.md', {
  eager: true,
  as: 'raw'
})

const scrollContainer = ref<HTMLElement | null>(null)
const showMoreToCome = ref(false)

const onScroll = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value

  // check if scrolled to bottom (with some tolerance)
  const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5
  showMoreToCome.value = atBottom
  if (atBottom === true) console.log("hit")
}


interface Project {
  title: string
  date: string
  short: string
  long: string
  image: string
  content: string
  gallery: string[]
  iframes: string[]
}

marked.use({
  extensions: [
    {
      name: 'iframe',
      level: 'block',
      start(src) {
        return src.indexOf('```iframe')
      },
      tokenizer(src) {
        if (!src.startsWith('```iframe')) return

        const match = src.match(/^```iframe\n([\s\S]*?)\n```/)
        if (!match) return

        return {
          type: 'iframe',
          raw: match[0],
          url: match[1].trim()
        }
      },
      renderer(token) {
        return `<iframe-placeholder data-url="${token.url}"></iframe-placeholder>`
      }
    }
  ]
})

const extractIframes = (md: string): string[] => {
  const html = marked(md)
  const div = document.createElement('div')
  div.innerHTML = html
  return Array.from(div.querySelectorAll('[data-iframe]'))
      .map(el => el.getAttribute('data-iframe')!)
}


const extractImages = (md: string) => {
  const html = marked(md)
  const div = document.createElement('div')
  div.innerHTML = html
  return Array.from(div.querySelectorAll('img')).map(img => img.src)
}

const projects = ref<Project[]>(
    Object.entries(projectFiles).map(([_, raw]) => {
      const frontmatterMatch = raw.match(/---\n([\s\S]*?)\n---/)
      const metadata: any = {}

      if (frontmatterMatch) {
        frontmatterMatch[1].split('\n').forEach(line => {
          const [key, ...rest] = line.split(':')
          metadata[key.trim()] = rest.join(':').trim()
        })
      }

      const content = raw.replace(/---[\s\S]*?---/, '').trim()
      const contentImages = extractImages(content)
      const iframeUrls = extractIframes(content)

      const gallery = Array.from(
          new Set([
            ...(metadata.image ? [metadata.image] : []),
            ...contentImages
          ])
      ).slice(0, 4)

      return {
        ...metadata,
        content,
        gallery,
        iframes: iframeUrls
      }


    })
)

const openProjectPanel = (project: Project) => {
  emit('open-panel', {
    route: 'openProject',
    props: {project}
  })
}
</script>


<style scoped>
.portfolio-top {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
}

/* Optional: subtle elevation */
.portfolio-top::after {
  content: '';
  display: block;
  background: #ffffff;
}


.separator {
  height: 2px;
  margin: 0 10px;
  background: var(--main-stroke);
}

.portfolio-menu {
  padding: 5px 12px;
  display: flex;
  justify-content: flex-end; /* push content to the right */
  align-items: flex-start;
}

.header {
  padding: 20px;
}

.projects {
  display: grid;
  padding: 0 20px;
  margin-top: 20px;
  gap: 0px;
  grid-template-columns: repeat(auto-fill, 240px);
  justify-content: start;
  position: relative;
  overflow-y: ;
}


/* CARD BASE */
.project-card {
  background: #fff;
  width: 220px;
}

/* GRID VIEW */
.project-image {
  width: 220px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.short {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
  padding: 0;
  margin-bottom: 15px;
}

/* LIST VIEW */
/* LIST VIEW */
.projects.list {
  grid-template-columns: 1fr; /* single column */
  gap: 20px; /* spacing between project cards */

  .project-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      i {
        cursor: pointer;
      }
    }

    .date {
      font-size: 14px;
    }
  }

  .long {
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 1.4;
    word-wrap: break-word; /* wrap long text */
  }

  .list-gallery {
    display: flex;
    flex-wrap: wrap; /* allow wrapping */
    gap: 10px;
    margin: 15px 0;
  }

  .list-thumb {
    width: 150px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
  }
}

.more-to-come {
  margin-top: 16px;
  text-align: center;
  padding: 8px 0;
  color: #333;
  font-weight: bold;
}

</style>


