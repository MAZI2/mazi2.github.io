<template>
  <canvas ref="canvas" style="position: fixed; top: 0; left: 0;"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Simulation } from '../simulation/Simulation'
import { CanvasRenderer } from '../rendering/CanvasRenderer'
import { Viewport } from './Viewport'
import { Neuron } from '../simulation/Neuron'

const TILE_SIZE = 400

export default defineComponent({
props: {
  paused: {
    type: Boolean,
    required: true
  },
  getExclusionZone: Function
},
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null)
    const simulation = new Simulation()
    const viewport = new Viewport()
    let renderer: CanvasRenderer
    let dragged: Neuron | null = null
    let lastMouseEvent: MouseEvent | null = null

    // Efficient neuron picking using tiles
    function findNeuronAt(mouseX: number, mouseY: number): Neuron | null {
      const worldX = mouseX + viewport.offsetX
      const worldY = mouseY + viewport.offsetY
      const tileX = Math.floor(worldX / TILE_SIZE)
      const tileY = Math.floor(worldY / TILE_SIZE)
      const nearbyTiles = [
        `${tileX},${tileY}`,
        `${tileX-1},${tileY}`, `${tileX+1},${tileY}`,
        `${tileX},${tileY-1}`, `${tileX},${tileY+1}`,
        `${tileX-1},${tileY-1}`, `${tileX+1},${tileY-1}`,
        `${tileX-1},${tileY+1}`, `${tileX+1},${tileY+1}`
      ]
      for (const key of nearbyTiles) {
        const neurons = simulation.tiles.get(key)
        if (!neurons) continue
        for (const n of neurons) {
          const dx = n.position.x - worldX
          const dy = n.position.y - worldY
          if (dx * dx + dy * dy <= n.radius * n.radius) return n
        }
      }
      return null
    }

    function updateExclusionZone() {
      if (!props.getExclusionZone) return
      const zones = props.getExclusionZone()
      if (zones) simulation.exclusionZones = zones
    }

    onMounted(() => {
      if (!canvas.value) return
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
      viewport.width = canvas.value.width
      viewport.height = canvas.value.height
      renderer = new CanvasRenderer(canvas.value)

      // Handle resize
      window.addEventListener('resize', () => {
        if (!canvas.value) return
        canvas.value.width = window.innerWidth
        canvas.value.height = window.innerHeight
        viewport.width = canvas.value.width
        viewport.height = canvas.value.height
        updateExclusionZone()
      })

      // Handle scrolling (vertical only)
      window.addEventListener('wheel', e => {
        if (!props.getExclusionZone) return

        const zones = simulation.exclusionZones

        const mouseX = e.clientX
        const mouseY = e.clientY

        let blockScroll = false

        zones.forEach((zone, index) => {
          // Adjust first item (header)
          if (index != 0) {
            // For panels (from second onward), block scroll if mouse is inside zone
            if (
              mouseX >= zone.x - 100 &&
              mouseX <= zone.x + zone.width + 200 &&
              mouseY >= zone.y &&
              mouseY <= zone.y + zone.height
            ) {
              blockScroll = true
            }
          }
        })

        if (blockScroll) return // ignore scroll over panels

        // Handle scroll for canvas
        e.preventDefault()
        viewport.onScroll(e.deltaY)
      }, { passive: false })


      // Dragging neurons
      canvas.value.addEventListener('mousedown', e => {
        const rect = canvas.value!.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        dragged = findNeuronAt(x, y)
        if (dragged) {
          dragged.isDragged = true
          dragged.timeCounter = 0
          dragged.firing = true
          dragged.firingTimer = 0
          simulation.neurons.forEach(n => n.receivedSignals.clear())
        }
      })

      canvas.value.addEventListener('mousemove', e => lastMouseEvent = e)
      window.addEventListener('mouseup', () => {
        if (dragged) dragged.isDragged = false
        dragged = null
      })

      // Animation loop
      let last = performance.now()
      const loop = (now: number) => {
        const dt = (now - last) / 1000
        last = now

        if (!props.paused) {
          updateExclusionZone()

          if (dragged && lastMouseEvent && canvas.value) {
            const rect = canvas.value.getBoundingClientRect()
            dragged.position.x =
              lastMouseEvent.clientX - rect.left + viewport.offsetX
            dragged.position.y =
              lastMouseEvent.clientY - rect.top + viewport.offsetY
            lastMouseEvent = null
          }

          simulation.update(dt, viewport)
          simulation.updateVisibleTiles(viewport)
          renderer.draw(
            simulation,
            { x: viewport.offsetX, y: viewport.offsetY },
            viewport.width,
            viewport.height
          )
          viewport.update()
        }

        requestAnimationFrame(loop) // ✅ ALWAYS schedule next frame
      }
      requestAnimationFrame(loop)
    })

    return { canvas }
  }
})
</script>
