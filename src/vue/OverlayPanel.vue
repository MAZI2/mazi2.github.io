<template>
  <div
    class="overlay-panel"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :style="panelStyle"
  >
    <div class="panel-header" @mousedown="startDrag" @touchstart.prevent="startDrag">
      <div class="menu">
        <i class="menu-item fa fa-window-close-o" @click="$emit('close')" aria-hidden="true"></i>
        <i :class="maximized ? 'menu-item fa fa-window-minimize' : 'menu-item fa fa-window-maximize'" @click="toggleMaximize" aria-hidden="true"></i>
      </div>
    </div>

    <div class="content" ref="scrollContainer" @scroll="onScroll">
      <slot />
    </div>


  <span v-if="showMoreToCome && props.withMoreToCome" class="more-to-come">And more to come...</span>
    <div class="resize-handle"
     @mousedown.prevent="startResize" @touchstart.prevent="startResize">
  <i class="fa fa-expand" aria-hidden="true"></i>
</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted, onBeforeUnmount, nextTick, watchEffect } from 'vue'

const props = defineProps<{
  position: { x: number; y: number }
  size: { width: number; height: number }
  maximized?: boolean
  withMoreToCome?: false 
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


const onScroll = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value

  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight

  // check if scrolled to bottom OR content fits inside container
  showMoreToCome.value = scrollTop + clientHeight >= scrollHeight - 5 || scrollHeight <= clientHeight
}

watchEffect(async () => {
  await nextTick() // wait for DOM to update
  onScroll()
})

// Dragging
let dragging = false
let offset = { x: 0, y: 0 }

function startDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  dragging = true

  let clientX: number, clientY: number
  if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }

  offset.x = clientX - props.position.x
  offset.y = clientY - props.position.y

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging) return

  e.preventDefault()
  let clientX: number, clientY: number
  if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }

  emit('drag', { x: clientX - offset.x, y: clientY - offset.y })
}

function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}


// Resizing
let resizing = false
let resizeStart = { x: 0, y: 0 }
let initialSize = { width: 0, height: 0 }

function startResize(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  resizing = true

  let clientX: number, clientY: number
  if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }

  resizeStart = { x: clientX, y: clientY }
  initialSize = { ...props.size }

  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
  window.addEventListener('touchmove', onResize, { passive: false })
  window.addEventListener('touchend', stopResize)
}

function onResize(e: MouseEvent | TouchEvent) {
    onScroll()
  if (!resizing) return
  e.preventDefault()

  let clientX: number, clientY: number
  if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }

  const newWidth = Math.max(100, initialSize.width + (clientX - resizeStart.x))
  const newHeight = Math.max(100, initialSize.height + (clientY - resizeStart.y))
  emit('resize', { width: newWidth, height: newHeight })
}

function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('touchmove', onResize)
  window.removeEventListener('touchend', stopResize)
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

  .menu {
    display: flex;
    gap: 8px;

    .menu-item {
      cursor: pointer;
    }
  }
}

.content {
    overflow-x: auto;
  flex: 1;
  color: black;
  margin-bottom: 20px;
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
.more-to-come {
      position: absolute;
    color: black;
    font-size: 14px;
    left: 10px;
  bottom: 5px;
  }
</style>
