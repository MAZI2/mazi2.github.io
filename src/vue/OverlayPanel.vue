<template>
  <div
    class="overlay-panel"
    :style="panelStyle"
  >
    <div class="panel-header" @mousedown="startDrag">
      <span>Panel</span>
      <div>
        <button @click.stop="toggleMaximize">{{ props.maximized ? 'Minimize' : 'Maximize' }}</button>
        <button @click="$emit('close')">X</button>
      </div>
    </div>

    <div class="content">
      <slot />
    </div>

    <div class="resize-handle" @mousedown.prevent="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  position: { x: number; y: number }
  size: { width: number; height: number }
  maximized?: boolean
}>()

const emit = defineEmits<{
  (e: 'drag', pos: { x: number; y: number }): void
  (e: 'resize', size: { width: number; height: number }): void
  (e: 'maximize'): void
  (e: 'minimize'): void
  (e: 'close'): void
}>()

// Apply both position AND size
const panelStyle = computed(() => ({
  left: props.position.x + 'px',
  top: props.position.y + 'px',
  width: props.size.width + 'px',
  height: props.size.height + 'px'
}))

// Dragging
let dragging = false
let offset = { x: 0, y: 0 }

function startDrag(e: MouseEvent) {
  e.preventDefault()
  dragging = true
  offset.x = e.clientX - props.position.x
  offset.y = e.clientY - props.position.y
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!dragging) return
  emit('drag', { x: e.clientX - offset.x, y: e.clientY - offset.y })
}

function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

// Resizing
let resizing = false
let resizeStart = { x: 0, y: 0 }
let initialSize = { width: 0, height: 0 }

function startResize(e: MouseEvent) {
  resizing = true
  resizeStart = { x: e.clientX, y: e.clientY }
  initialSize = { ...props.size }
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
  if (!resizing) return
  const newWidth = Math.max(100, initialSize.width + (e.clientX - resizeStart.x))
  const newHeight = Math.max(100, initialSize.height + (e.clientY - resizeStart.y))
  emit('resize', { width: newWidth, height: newHeight })
}

function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}

// Maximize / Minimize
function toggleMaximize() {
  if (!props.maximized) emit('maximize')
  else emit('minimize')
}
</script>

<style scoped>
.overlay-panel {
  position: fixed;
  z-index: 9999;
  background: #eee;
  border: 1px solid #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  background: #ccc;
  padding: 4px 8px;
  cursor: grab;
}

.content {
  flex: 1;
  padding: 8px;
  overflow: auto;
  min-height: 50px;
}

.resize-handle {
  width: 12px;
  height: 12px;
  background: #888;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: se-resize;
}
</style>
