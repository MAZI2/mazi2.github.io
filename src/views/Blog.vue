<template>
  <div class="portfolio-top">
    <div class="separator"></div>

  </div>
  <div class="blog">
    <div class="posts list">
      <div v-for="post in posts" :key="post.slug" class="post-card">
          <span class="title" @click="openpost(post)">
            <span class="left">
            <i class="fa fa-play"></i>
            <b v-html="post.title"></b>
              </span>
            <span class="date"  v-if="post.colab && post.colab.length == 0">{{ formatDate(post.date) }}</span>
          </span>
          <span class="colab" v-if="post.colab && post.colab.length">
             <p>
        with
        <template v-for="(c, index) in post.colab" :key="c.name">
          <a v-if="c.link" :href="c.link" target="_blank">{{ c.name }}</a>
          <span v-else>{{ c.name }}</span>
          <span v-if="index < post.colab.length - 1">, </span>
        </template>
    </p>
            <span>{{ formatDate(post.date) }}</span>
          </span>
          <span class="long">{{ post.long }}</span>
          <div class="list-gallery">
            <img v-for="(img, idx) in post.gallery" :key="idx" :src="img" class="list-thumb" @click="openpost(post)" />
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

const emit = defineEmits<{
  (e: 'open-panel', payload: { route: string; props?: any }): void
}>()

const props = defineProps<{ posts: any[] }>()

const posts = computed(() =>
    [...props.posts].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
)

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

const openpost = (project: any) => {
  let panelProps: any = {}
  panelProps.project = project
  panelProps.title = project.title
  panelProps.slug = project.slug

  emit('open-panel', { route: 'openProject', props: panelProps })
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
.blog {
  padding-top: 10px;
}


.posts {
  display: grid;
  padding: 0 20px;
  margin-top: 20px;
  gap: 0px;
  grid-template-columns: repeat(auto-fill, 240px);
  justify-content: start;
  position: relative;
}


/* CARD BASE */
.post-card {
  background: var(--main-background);
  width: 220px;
}

/* LIST VIEW */
.posts.list {
  grid-template-columns: 1fr; /* single column */
  gap: 20px; /* spacing between post cards */

  .post-card {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .date {
    font-size: 12px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    i {
      margin-right: 8px;
    }
  }
  .colab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding-left: 20px;
    margin-bottom: 0px;

    span, p {
      margin: 0px;
      cursor: pointer;
    }
  }

  .long {
    margin-top: 10px;
    margin-left: 20px;
    margin-bottom: 0px;
    line-height: 1.4;
    max-width: 700px;
    word-wrap: break-word; /* wrap long text */
  }

  .list-gallery {
    margin: 20px;
    display: grid;
    grid-template-columns: repeat(
    auto-fit,
    minmax(min(300px, 100%), max-content)
  );
    gap: 10px;
    justify-content: start;
  }

  .list-thumb {
    width: 100%;
    height: 240px;
    max-width: 300px;
    justify-self: start;
    object-fit: cover;
    border-radius: 10px;
  }




}

</style>


