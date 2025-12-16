<template>
  <div
    class="overlay-panel"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :style="panelStyle"
  >
    <div class="panel-header" @mousedown="startDrag">
      <div class="menu">
        <i class="menu-item fa fa-window-close-o" @click="$emit('close')" aria-hidden="true"></i>
        <i :class="maximized ? 'menu-item fa fa-window-minimize' : 'menu-item fa fa-window-maximize'" @click="toggleMaximize" aria-hidden="true"></i>
      </div>
    </div>

    <div class="content" ref="contentRef">
      <slot />
    </div>

    <div class="resize-handle"
     :style="{ right: hasScrollbar ? '20px' : '10px' }"
     @mousedown.prevent="startResize">
  <i class="fa fa-expand" aria-hidden="true"></i>
</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

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

const isHovered = ref(false)


function onMouseEnter() {
  isHovered.value = true
}

function onMouseLeave() {
  isHovered.value = false
}

defineExpose({ isHovered })

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
  background: #ffffff;
  border: 2px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  color: black;
  padding: 6px 12px;
  cursor: grab;

  .menu {
    display: flex;
    gap: 8px;

    .menu-item {
      cursor: pointer;
    }
  }
}

.content {
  flex: 1;
  overflow-y: scroll; /* force scrollbar always visible */
  overflow-x: hidden;
  color: black;
  margin: 20px;
  min-height: 50px;

  /* Firefox */
  scrollbar-width: thick;
  scrollbar-color: black white;
}



.resize-handle {
  width: 12px;
  height: 12px;
  position: absolute;
  right: 10px;
  bottom: 15px;
  cursor: se-resize;
  color: black;

  i {
    display: inline-block; /* needed for transform */
    transform: scaleX(-1);
  }
}
</style>
