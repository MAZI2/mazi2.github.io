<template>
  <div class="portfolio-top">
    <div class="separator"></div>
    <div class="portfolio-menu">
      <i :class="viewGrid ? 'fa fa-th-large' : 'fa fa-list'" @click="toggleView"></i>
    </div>
  </div>

  <div>
    <span class="header"><b>Portfolio</b></span>
    <div :class="['projects', { list: !viewGrid }]">
      <div v-for="project in projects" :key="project.slug" class="project-card">
        <!-- GRID VIEW -->
        <template v-if="viewGrid">
          <img :src="project.image" class="project-image" @click="openProject(project)" />
          <span class="left" @click="openProject(project)">
            <i class="fa fa-play"></i> <b>{{ project.title }}</b>
          </span>
          <p class="short">{{ project.short }}</p>
        </template>

        <!-- LIST VIEW -->
        <template v-else>
          <span class="title">
            <span class="left" @click="openProject(project)">
              <i class="fa fa-play"></i> <b>{{ project.title }}</b>
            </span>
            <span class="date">{{ project.date }}</span>
          </span>
          <span class="long">{{ project.long }}</span>
          <div class="list-gallery">
            <img v-for="(img, idx) in project.gallery" :key="idx" :src="img" class="list-thumb" @click="openProject(project)" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'open-panel', payload: { route: string; props?: any }): void
}>()

const props = defineProps<{ projects: any[] }>()

const projects = props.projects
const viewGrid = ref(false)
const toggleView = () => (viewGrid.value = !viewGrid.value)

const openProject = (project: any) => {
  emit('open-panel', { route: 'openProject', props: { project } })
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
  background: var(--main-background);
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
  background: var(--main-background);
  color: var(--main-text);
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
  background: var(--main-background);
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

</style>


