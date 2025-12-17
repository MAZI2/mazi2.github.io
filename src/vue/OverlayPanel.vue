<template>
  <div
    class="overlay-panel"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :style="panelStyle"
  >
    <div class="panel-header" 
         @mousedown="startDragMouse" 
         @touchstart.prevent="startDragTouch">
<div class="menu">
  <i
    class="menu-item fa fa-window-close-o"
    @click="$emit('close')"
    @touchstart.stop
    @mousedown.stop
    aria-hidden="true"
  ></i>
  <i
    :class="maximized ? 'menu-item fa fa-window-minimize' : 'menu-item fa fa-window-maximize'"
    @click="toggleMaximize"
    @touchstart.stop
    @mousedown.stop
    aria-hidden="true"
  ></i>
</div>
      
    </div>

    <div class="content" ref="scrollContainer" @scroll="onScroll">
      <slot />
    </div>

    <span v-if="showMoreToCome && props.withMoreToCome" class="more-to-come">And more to come...</span>

    <div class="resize-handle"
         @mousedown.prevent="startResizeMouse" 
         @touchstart.prevent="startResizeTouch">
      <i class="fa fa-expand" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, nextTick, watchEffect, onMounted } from 'vue'

const props = defineProps<{
  position: { x: number; y: number }
  size: { width: number; height: number }
  maximized?: boolean
  withMoreToCome?: boolean 
}>()

const emit = defineEmits<{
  (e: 'drag', pos: { x: number; y: number }): void
  (e: 'resize', size: { width: number; height: number }): void
  (e: 'maximize'): void
  (e: 'minimize'): void
  (e: 'close'): void
}>()

const isHovered = ref(false)
const showMoreToCome = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

defineExpose({ isHovered })

const panelStyle = computed(() => ({
  left: props.position.x + 'px',
  top: props.position.y + 'px',
  width: props.size.width + 'px',
  height: props.size.height + 'px'
}))

const onScroll = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  showMoreToCome.value = container.scrollTop + container.clientHeight >= container.scrollHeight - 5 
    || container.scrollHeight <= container.clientHeight
}

// ensure showMoreToCome updates after DOM changes
watchEffect(async () => {
  await nextTick()
  onScroll()
})

function onMouseEnter() { isHovered.value = true }
function onMouseLeave() { isHovered.value = false }

// --------------------
// DRAGGING
// --------------------
let dragging = false
let offset = { x: 0, y: 0 }

function startDragMouse(e: MouseEvent) { startDrag(e.clientX, e.clientY, 'mouse') }
function startDragTouch(e: TouchEvent) {
  if (typeof TouchEvent === 'undefined') return
  startDrag(e.touches[0].clientX, e.touches[0].clientY, 'touch')
}

function startDrag(clientX: number, clientY: number, type: 'mouse' | 'touch') {
  dragging = true
  offset.x = clientX - props.position.x
  offset.y = clientY - props.position.y

  if (type === 'mouse') {
    window.addEventListener('mousemove', onDragMouse)
    window.addEventListener('mouseup', stopDrag)
  } else {
    window.addEventListener('touchmove', onDragTouch, { passive: false })
    window.addEventListener('touchend', stopDrag)
  }
}

function onDragMouse(e: MouseEvent) { onDrag(e.clientX, e.clientY) }
function onDragTouch(e: TouchEvent) {
  e.preventDefault()
  onDrag(e.touches[0].clientX, e.touches[0].clientY)
}

function onDrag(clientX: number, clientY: number) {
  if (!dragging) return
  emit('drag', { x: clientX - offset.x, y: clientY - offset.y })
}

function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDragMouse)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDragTouch)
  window.removeEventListener('touchend', stopDrag)
}

// --------------------
// RESIZING
// --------------------
let resizing = false
let resizeStart = { x: 0, y: 0 }
let initialSize = { width: 0, height: 0 }

function startResizeMouse(e: MouseEvent) { startResize(e.clientX, e.clientY, 'mouse') }
function startResizeTouch(e: TouchEvent) {
  if (typeof TouchEvent === 'undefined') return
  startResize(e.touches[0].clientX, e.touches[0].clientY, 'touch')
}

function startResize(clientX: number, clientY: number, type: 'mouse' | 'touch') {
  resizing = true
  resizeStart = { x: clientX, y: clientY }
  initialSize = { ...props.size }

  if (type === 'mouse') {
    window.addEventListener('mousemove', onResizeMouse)
    window.addEventListener('mouseup', stopResize)
  } else {
    window.addEventListener('touchmove', onResizeTouch, { passive: false })
    window.addEventListener('touchend', stopResize)
  }
}

function onResizeMouse(e: MouseEvent) { onResize(e.clientX, e.clientY) }
function onResizeTouch(e: TouchEvent) {
  e.preventDefault()
  onResize(e.touches[0].clientX, e.touches[0].clientY)
}

function onResize(clientX: number, clientY: number) {
  if (!resizing) return
  onScroll()
  const newWidth = Math.max(100, initialSize.width + (clientX - resizeStart.x))
  const newHeight = Math.max(100, initialSize.height + (clientY - resizeStart.y))
  emit('resize', { width: newWidth, height: newHeight })
}

function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResizeMouse)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('touchmove', onResizeTouch)
  window.removeEventListener('touchend', stopResize)
}

// --------------------
// MAXIMIZE / MINIMIZE
// --------------------
function toggleMaximize() {
  if (!props.maximized) emit('maximize')
  else emit('minimize')
}
</script>

<style scoped>
.overlay-panel {
  position: fixed;
  z-index: 10999;
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
}

.menu {
  display: flex;
  gap: 8px;
}

.menu-item { cursor: pointer }

.content {
  overflow-x: auto;
  flex: 1;
  color: black;
  margin-bottom: 20px;
  min-height: 50px;
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
}

.resize-handle i { display: inline-block; transform: scaleX(-1); }

.more-to-come {
  position: absolute;
  color: black;
  font-size: 14px;
  left: 10px;
  bottom: 5px;
}
</style>

