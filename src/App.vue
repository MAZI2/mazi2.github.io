<template>
  <Controls @toggle-animation="toggleAnimation"/>
  <Viewport :get-exclusion-zone="getExclusionZone" :paused="animationPaused"/>
  <TitleHeader ref="headerRef" />
  <NavBar @open-panel="openPanel" />

  <!-- Render all panels -->
  <OverlayPanel
  v-for="panel in panels"
  :key="panel.id"
  :position="panel.position"
  :size="panel.size"
  :maximized="panel.maximized"
  @drag="updatePosition(panel.id, $event)"
  @resize="updateSize(panel.id, $event)"
  @maximize="maximizePanel(panel.id)"
  @minimize="minimizePanel(panel.id)"
  @close="closePanel(panel.id)"
>
  <!-- Dynamically render the component -->
  <component :is="routeComponents[panel.route]" />
</OverlayPanel>

</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import Controls from './vue/Controls.vue'
import ViewportComponent from './vue/Viewport.vue'
import TitleHeader from './vue/Header.vue'
import NavBar from './vue/Nav.vue'
import OverlayPanel from './vue/OverlayPanel.vue'

import RouteOne from './views/RouteOne.vue'
import RouteTwo from './views/RouteTwo.vue'
import RouteThree from './views/RouteThree.vue'

export default {
  components: { Controls, Viewport: ViewportComponent, TitleHeader, NavBar, OverlayPanel },
  setup() {
    const panels = ref<
      Array<{
        id: number
        route: string
        position: { x: number; y: number }
        size: { width: number; height: number }
        prevPosition?: { x: number; y: number }
        prevSize?: { width: number; height: number }
        maximized?: boolean
      }>
    >([])

    const routeComponents: Record<string, any> = {
      '/route1': RouteOne,
      '/route2': RouteTwo,
      '/route3': RouteThree
    }

    const animationPaused = ref(false)

    const toggleAnimation = () => {
      animationPaused.value = !animationPaused.value
    }

    const OFFSET_DISTANCE = 20

    const openPanel = (route: string) => {
      // Remove any existing panel with this route
      panels.value = panels.value.filter(p => p.route !== route)

      const width = Math.min(window.innerWidth * 0.8, 700)
      const height = window.innerHeight - 250

      const baseX = (window.innerWidth - width) / 2
      const baseY = 200

      let x = baseX
      let y = baseY

      // Only offset if at least one panel already exists
      if (panels.value.length > 0) {
        const angle = Math.random() * Math.PI * 2
        x += Math.cos(angle) * OFFSET_DISTANCE
        y += Math.sin(angle) * OFFSET_DISTANCE
      }

      panels.value.push({
        id: Date.now(),
        route,
        position: { x, y },
        size: { width, height },
        maximized: false
      })
    }

    onMounted(() => {
      openPanel('/route1') // or whatever your default route is
    })

    function updateSize(id: number, size: { width: number; height: number }) {
      const p = panels.value.find(p => p.id === id)
      if (p) p.size = size
    }


    function maximizePanel(id: number) {
      const p = panels.value.find(p => p.id === id)
      if (!p) return
      if (!p.maximized) {
        p.prevPosition = { ...p.position }
        p.prevSize = { ...p.size }
        p.position = { x: 0, y: 0 }
        p.size = { width: window.innerWidth, height: window.innerHeight }
        p.maximized = true
      }
    }

    function minimizePanel(id: number) {
      const p = panels.value.find(p => p.id === id)
      if (!p || !p.prevPosition || !p.prevSize) return
      p.position = { ...p.prevPosition }
      p.size = { ...p.prevSize }
      p.maximized = false
    }


    const closePanel = (id: number) => {
      panels.value = panels.value.filter(p => p.id !== id)
    }

    const updatePosition = (id: number, pos: { x: number; y: number }) => {
      const panel = panels.value.find(p => p.id === id)
      if (panel) panel.position = pos
    }

    const headerRef = ref<InstanceType<typeof TitleHeader> | null>(null)
    const panelRef = ref<InstanceType<typeof OverlayPanel> | null>(null)

    function getExclusionZone() {
      const zones: Array<{ x: number; y: number; width: number; height: number; padding: number }> = []

      // Add header
      if (headerRef.value?.$el) {
        const rect = headerRef.value.$el.getBoundingClientRect()
        zones.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          padding: 20
        })
      }

      // Add all panels
      panels.value.forEach(panel => {
        // Attempt to get actual DOM element if needed
        // If panels are floating and don't have refs, we can just use position + estimated width/height
        zones.push({
          x: panel.position.x + 100, // keep the subtraction from original code
          y: panel.position.y,
          width: panel.size.width-200, // you can adjust this if you have actual panel width
          height: panel.size.height, // match OverlayPanel height
          padding: 20
        })
      })

      return zones
    }


    return { panels, openPanel, closePanel, updatePosition, headerRef, panelRef, getExclusionZone, minimizePanel, maximizePanel, updateSize, routeComponents, toggleAnimation, animationPaused }
  }
}
</script>
