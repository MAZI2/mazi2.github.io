<template>
  <Controls @toggle-animation="toggleAnimation"/>
  <Viewport :get-exclusion-zone="getExclusionZone" :paused="animationPaused"/>
  <TitleHeader ref="headerRef"/>
  <NavBar @open-panel="openPanel"/>

  <!-- Render all panels -->
  <OverlayPanel
      v-for="panel in panels"
      :key="panel.id"
      :style="{ zIndex: panel.zIndex }"
      :maximized="panel.maximized"
      :position="panel.position"
      :size="panel.size"
      :with-more-to-come="panel.withMoreToCome"
      :title="panel.title"
      :slug="panel.slug"
      @close="closePanel(panel.id)"
      @drag="updatePosition(panel.id, $event)"
      @maximize="maximizePanel(panel.id)"
      @minimize="minimizePanel(panel.id)"
      @resize="updateSize(panel.id, $event)"
      @mousedown="bringToFront(panel.id)"
  >
    <component
        :is="resolvePanelComponent(panel).component"
        v-if="resolvePanelComponent(panel).component"
        v-bind="resolvePanelComponent(panel).props"
        @open-panel="openPanel"
    />
  </OverlayPanel>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { marked } from 'marked'

import Controls from './vue/Controls.vue'
import ViewportComponent from './vue/Viewport.vue'
import TitleHeader from './vue/Header.vue'
import NavBar from './vue/Nav.vue'
import OverlayPanel from './vue/OverlayPanel.vue'
import YAML from 'js-yaml'

import OpenExternal from './views/OpenExternal.vue'
import ProjectPanel from './views/Project.vue'
import AboutMe from './views/AboutMe.vue'
import Portfolio from './views/Portfolio.vue'
import Blog from './views/Blog.vue'
import Welcome from "./views/Welcome.vue";

export default {
  components: {
    Controls,
    Viewport: ViewportComponent,
    TitleHeader,
    NavBar,
    OverlayPanel,
    Blog,
    Welcome
  },

  setup() {
    interface Collaborator {
      name: string
      link?: string
    }

    interface Project {
      slug: string
      title: string
      date: string
      short: string
      long: string
      image: string
      content: string
      gallery: string[]
      iframes: string[]
      colab?: Collaborator[]
    }

    const projects = ref<Project[]>([])
    const posts = ref<Project[]>([])

    // --------------------
    // MARKED IFRAME EXTENSION
    // --------------------
    marked.use({
      extensions: [
        {
          name: 'iframe',
          level: 'block',
          start(src) { return src.indexOf('```iframe') },
          tokenizer(src) {
            if (!src.startsWith('```iframe')) return
            const match = src.match(/^```iframe\n([\s\S]*?)\n```/)
            if (!match) return
            return { type: 'iframe', raw: match[0], url: match[1].trim() }
          },
          renderer(token) {
            return `<iframe-placeholder data-url="${token.url}"></iframe-placeholder>`
          }
        }
      ]
    })

    function bringToFront(id: number) {
      const maxZ = Math.max(...panels.value.map(p => p.zIndex || 0))
      const panel = panels.value.find(p => p.id === id)
      if (panel) panel.zIndex = maxZ + 1
    }

    const extractIframes = (md: string): string[] => {
      const html = marked(md)
      const div = document.createElement('div')
      div.innerHTML = html
      return Array.from(div.querySelectorAll('[data-iframe]'))
          .map(el => el.getAttribute('data-iframe')!)
    }

    const extractImages = (md: string): string[] => {
      const html = marked(md)
      const div = document.createElement('div')
      div.innerHTML = html

      return Array.from(div.querySelectorAll('img'))
          .filter(img => {
            const widthAttr = img.getAttribute('width')
            if (!widthAttr) return true // keep if width not specified (optional)
            const width = parseInt(widthAttr, 10)
            return !isNaN(width) && width >= 200
          })
          .map(img => img.src)
    }


    // --------------------
    // LOAD PROJECTS
    // --------------------
    async function loadProjects() {
      const files: string[] = await fetch('https://mpog.dev/projects/projects.json').then(r => r.json())
      const raws = await Promise.all(
          files.map(f => fetch(`https://mpog.dev/projects/${f}`).then(r => r.text()))
      )


      projects.value = raws.map((raw, index) => {
        const slug = files[index].replace(/\.md$/, '')

        // extract frontmatter
        const frontmatterMatch = raw.match(/---\n([\s\S]*?)\n---/)
        let metadata: any = {}

        if (frontmatterMatch) {
          metadata = YAML.load(frontmatterMatch[1]) as any
        }

        const content = raw.replace(/---[\s\S]*?---/, '').trim()
        const images = extractImages(content)
        const iframes = extractIframes(content)
        const galleryFull: string[] = []
        if (metadata.image) galleryFull.push(metadata.image)
        images.forEach(img => {
          if (!galleryFull.includes(img)) galleryFull.push(img)
        })

        const gallery = galleryFull.slice(0, 3)

        return {
          slug,
          title: metadata.title || 'Untitled',
          date: metadata.date || '',
          short: metadata.short || '',
          long: metadata.long || '',
          image: metadata.image || images[0] || 'https://mpog.dev/content/default.png',
          content,
          gallery,
          iframes,
          colab: metadata.colab || []
        }
      })

      // Blog
      const blogFiles: string[] = await fetch('https://mpog.dev/blog/posts.json').then(r => r.json())
      const blogRaws = await Promise.all(
          blogFiles.map(f => fetch(`https://mpog.dev/blog/${f}`).then(r => r.text()))
      )

      posts.value = blogRaws.map((raw, index) => {
        const slug = blogFiles[index].replace(/\.md$/, '')

        // extract frontmatter
        const frontmatterMatch = raw.match(/---\n([\s\S]*?)\n---/)
        let metadata: any = {}

        if (frontmatterMatch) {
          metadata = YAML.load(frontmatterMatch[1]) as any
        }

        const content = raw.replace(/---[\s\S]*?---/, '').trim()
        const images = extractImages(content)
        const iframes = extractIframes(content)
        const galleryFull: string[] = []
        if (metadata.image) galleryFull.push(metadata.image)
        images.forEach(img => {
          if (!galleryFull.includes(img)) galleryFull.push(img)
        })

        const gallery = galleryFull.slice(0, 3)

        return {
          slug,
          title: metadata.title || 'Untitled',
          date: metadata.date || '',
          short: metadata.short || '',
          long: metadata.long || '',
          image: metadata.image || images[0] || 'https://mpog.dev/content/default.png',
          content,
          gallery,
          iframes,
          colab: metadata.colab || []
        }
      })
    }

    // --------------------
    // URL BOOTSTRAP
    // --------------------
    function openFromURL() {
      const path = window.location.pathname.replace(/^\/+/, '')

      if (!path) {
        openPanel('/welcome')
        return
      }

      let panelProps: any = {}

      // Check if path matches a project
      let project = projects.value.find(p => p.slug === path)
      if (!project) project = posts.value.find(p => p.slug === path)
      if (project) {
        panelProps.project = project
        panelProps.title = project.title
        openPanel({ route: 'openProject', props: panelProps, initial: 'url' })
        return
      }

      // General pages
      if (['about', 'portfolio', 'blog'].includes(path)) {
        if (path === 'portfolio') {
          panelProps.projects = projects.value
          panelProps.title = 'Portfolio'
        } else if (path === 'blog') {
          panelProps.posts = posts.value
          panelProps.title = 'Blog'
        }

        openPanel({ route: `/${path}`, props: panelProps, initial: 'url' })
      }
    }


    // --------------------
    // PANELS & ROUTE COMPONENTS
    // --------------------
    const panels = ref<any[]>([])
    const animationPaused = ref(false)

    const routeComponents: Record<string, any> = {
      '/about': AboutMe,
      '/portfolio': Portfolio,
      '/blog': Blog,
      '/welcome': Welcome,
      openExternal: OpenExternal,
      openProject: ProjectPanel
    }

    function resolvePanelComponent(panel: any) {
      if (panel.route === 'openExternal' && panel.props?.url) {
        return { component: OpenExternal, props: { url: panel.props.url } }
      }
      if (panel.route === '/portfolio') {
        return { component: Portfolio, props: { projects: projects.value } } // pass projects
      }
      if (panel.route === '/blog') {
        return { component: Blog, props: { posts: posts.value } } // pass projects
      }
      if (panel.route === '/welcome') {
        return { component: Welcome, props: { projects: posts.value } } // pass projects
      }
      const component = routeComponents[panel.route] || null
      return { component, props: panel.props || {} }
    }

    const isMobile = () => window.innerWidth <= 768

    function getInitialPanelRect(route: string) {
      const width = window.innerWidth * 0.95
      const height = window.innerHeight - 150
      return { position: { x: (window.innerWidth - width) / 2, y: 80 }, size: { width, height } }
    }

    function openPanel(panelData: any) {
      let route = ''
      let props: any = {}
      let fromUrl = false
      if (typeof panelData === 'string') route = panelData
      else { route = panelData.route; props = panelData.props || {}; fromUrl = panelData.initial === 'url' }

      // Remove existing panel with the same route (optional)
      panels.value = panels.value.filter(p => p.route !== route)

      if (props.withMoreToCome === undefined) {
        props.withMoreToCome = route === '/portfolio'
      }

      let position, size
      if (fromUrl) {
        const rect = getInitialPanelRect(route)
        position = rect.position
        size = rect.size
      } else {
        const w = Math.min(window.innerWidth * 0.9, 700)
        const h = window.innerHeight - (isMobile() ? 180 : 250)
        let x = (window.innerWidth - w) / 2
        let y = isMobile() ? 100 : 150
        if (panels.value.length > 0) {
          const angle = Math.random() * Math.PI * 2
          x += Math.cos(angle) * 20
          y += Math.sin(angle) * 20
        }
        position = { x, y }
        size = { width: w, height: h }
      }

      // Determine max z-index so new panel appears on top
      const maxZ = panels.value.length ? Math.max(...panels.value.map(p => p.zIndex || 0)) : 0

      panels.value.push({
        id: Date.now(),
        route,
        props,
        position,
        size,
        maximized: false,
        withMoreToCome: props.withMoreToCome,
        title: props.title,
        slug: props.slug,
        zIndex: maxZ + 1 + 200 // <-- new panel on top
      })
    }


    function closePanel(id: number) { panels.value = panels.value.filter(p => p.id !== id) }
    function updatePosition(id: number, pos: { x: number; y: number }) { const p = panels.value.find(p => p.id === id); if (p) p.position = pos }
    function updateSize(id: number, size: { width: number; height: number }) { const p = panels.value.find(p => p.id === id); if (p) p.size = size }
    function maximizePanel(id: number) { const p = panels.value.find(p => p.id === id); if (!p || p.maximized) return; p.prevPosition = { ...p.position }; p.prevSize = { ...p.size }; p.position = { x: 0, y: 0 }; p.size = { width: window.innerWidth-4, height: window.innerHeight-4 }; p.maximized = true }
    function minimizePanel(id: number) { const p = panels.value.find(p => p.id === id); if (!p) return; if (!p.prevPosition || !p.prevSize) { const rect = getInitialPanelRect(p.route); p.position = rect.position; p.size = rect.size } else { p.position = { ...p.prevPosition }; p.size = { ...p.prevSize } }; p.maximized = false }
    function toggleAnimation() { animationPaused.value = !animationPaused.value }

    // --------------------
    // VIEWPORT EXCLUSION
    // --------------------
    const headerRef = ref(null)
    function getExclusionZone() {
      const zones: any[] = []
      if (headerRef.value?.$el) {
        const rect = headerRef.value.$el.getBoundingClientRect()
        zones.push({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, padding: 20 })
      }
      panels.value.forEach(panel => zones.push({ x: panel.position.x + 100, y: panel.position.y, width: panel.size.width - 200, height: panel.size.height, padding: 20 }))
      return zones
    }

    onMounted(async () => { await loadProjects(); openFromURL() })

    return { panels, openPanel, closePanel, updatePosition, updateSize, maximizePanel, minimizePanel, resolvePanelComponent, toggleAnimation, animationPaused, getExclusionZone, headerRef, bringToFront }
  }
}
</script>

<style>
.app { background: var(--main-background); }
</style>
