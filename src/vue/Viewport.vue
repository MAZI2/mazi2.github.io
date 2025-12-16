<template>
  <canvas ref="canvas" style="position: fixed; top: 0; left: 0;"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Simulation } from '../simulation/Simulation'
import { CanvasRenderer } from '../rendering/CanvasRenderer'
import { Viewport } from './Viewport'
import { Neuron } from '../simulation/Neuron'

const TILE_SIZE = 200

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null)
    const simulation = new Simulation()
    const viewport = new Viewport()
    let renderer: CanvasRenderer
    let dragged: Neuron | null = null
    let lastMouseEvent: MouseEvent | null = null

    // Efficient neuron picking using tiles
    function findNeuronAt(mouseX: number, mouseY: number): Neuron | null {
  // Convert to world coordinates
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
      if (dx*dx + dy*dy <= n.radius * n.radius) return n
    }
  }

  return null
}

    onMounted(() => {
      if (!canvas.value) return

      // Resize canvas
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
      renderer = new CanvasRenderer(canvas.value)

      // Scroll handling with throttling
      let scrollDX = 0
      let scrollDY = 0
      window.addEventListener('wheel', e => {
  e.preventDefault()
  viewport.onScroll(e.deltaY) // only vertical scroll
}, { passive: false })
      


      // Dragging
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

          // Reset receivedSignals only once per drag
          simulation.neurons.forEach(n => n.receivedSignals.clear())
        }
      })

      canvas.value.addEventListener('mousemove', e => {
        lastMouseEvent = e
      })

      window.addEventListener('mouseup', () => {
        if (dragged) dragged.isDragged = false
        dragged = null
      })

      // Animation loop
      let last = performance.now()
      const loop = (now: number) => {
        const dt = (now - last) / 1000
        last = now

        // Update dragged neuron position
        if (dragged && lastMouseEvent) {
          const rect = canvas.value!.getBoundingClientRect()
          dragged.position.x = lastMouseEvent.clientX - rect.left + viewport.offsetX
          dragged.position.y = lastMouseEvent.clientY - rect.top + viewport.offsetY
          lastMouseEvent = null
        }

        // Apply scroll deltas
        if (scrollDX !== 0 || scrollDY !== 0) {
          viewport.onScroll(scrollDX, scrollDY)
          scrollDX = 0
          scrollDY = 0
        }

        // Update simulation
        simulation.update(dt)
        simulation.updateVisibleTiles(viewport)

        // Draw
        renderer.draw(simulation, { x: viewport.offsetX, y: viewport.offsetY }, viewport.width, viewport.height)

        requestAnimationFrame(loop)
        viewport.update()
      }
      requestAnimationFrame(loop)

      // Handle window resize
      window.addEventListener('resize', () => {
        canvas.value!.width = window.innerWidth
        canvas.value!.height = window.innerHeight
        viewport.width = window.innerWidth
        viewport.height = window.innerHeight
      })
    })

    return { canvas }
  }
})
</script>
