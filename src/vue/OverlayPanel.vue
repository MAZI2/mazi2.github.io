<template>
  <div
      :style="panelStyle"
      class="overlay-panel"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
  >
    <div class="panel-header"
         @mousedown="startDragMouse"
         @touchstart.prevent="startDragTouch">
      <div class="menu">
        <i
            aria-hidden="true"
            class="menu-item fa fa-window-close-o"
            @click="$emit('close')"
            @touchstart.stop
            @mousedown.stop
        ></i>
        <i
            :class="maximized ? 'menu-item fa fa-window-minimize' : 'menu-item fa fa-window-maximize'"
            aria-hidden="true"
            @click="toggleMaximize"
            @touchstart.stop
            @mousedown.stop
        ></i>
      </div>
      <span class="title" v-html="props.title"></span>
      <span
          v-if="props.slug"
          class="share"
          @click.stop.prevent="copyShareUrl"
          @mousedown.stop
          @touchstart.stop
      >
  <i
      v-if="!copied"
      class="menu-item fa fa-share"
      aria-hidden="true"
  ></i>
   <span v-else class="copied-text">Copied URL</span>
</span>

    </div>

    <div ref="scrollContainer" class="content" @scroll="onScroll">
      <slot/>
    </div>

    <span v-if="showMoreToCome && props.withMoreToCome" class="more-to-come">And more to come...</span>

    <div class="resize-handle"
         @mousedown.prevent="startResizeMouse"
         @touchstart.prevent="startResizeTouch">
      <i aria-hidden="true" class="fa fa-expand"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  computed,
  ref,
  nextTick,
  watchEffect
} from 'vue'

const props = defineProps<{
  position: { x: number; y: number }
  size: { width: number; height: number }
  maximized?: boolean
  withMoreToCome?: boolean
  title?: string
  slug?: string
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

/* --------------------
   SHARE / COPY STATE
-------------------- */
const copied = ref(false)
let copiedTimeout: number | null = null

async function copyShareUrl() {
  if (!props.slug) return

  const url = `https://mpog.dev/${props.slug}`

  try {
    await navigator.clipboard.writeText(url)
    copied.value = true

    if (copiedTimeout) clearTimeout(copiedTimeout)

    copiedTimeout = window.setTimeout(() => {
      copied.value = false
      copiedTimeout = null
    }, 3000)
  } catch (err) {
    console.error('Clipboard copy failed', err)
  }
}

/* --------------------
   PANEL STYLE
-------------------- */
const panelStyle = computed(() => ({
  left: props.position.x + 'px',
  top: props.position.y + 'px',
  width: props.size.width + 'px',
  height: props.size.height + 'px'
}))

const onScroll = () => {
  if (!scrollContainer.value) return
  const c = scrollContainer.value
  showMoreToCome.value =
      c.scrollTop + c.clientHeight >= c.scrollHeight - 5 ||
      c.scrollHeight <= c.clientHeight
}

watchEffect(async () => {
  await nextTick()
  onScroll()
})

function onMouseEnter() {
  isHovered.value = true
}
function onMouseLeave() {
  isHovered.value = false
}

/* --------------------
   DRAGGING
-------------------- */
let dragging = false
let offset = { x: 0, y: 0 }

function startDragMouse(e: MouseEvent) {
  startDrag(e.clientX, e.clientY, 'mouse')
}
function startDragTouch(e: TouchEvent) {
  startDrag(e.touches[0].clientX, e.touches[0].clientY, 'touch')
}

function startDrag(x: number, y: number, type: 'mouse' | 'touch') {
  dragging = true
  offset = { x: x - props.position.x, y: y - props.position.y }

  if (type === 'mouse') {
    window.addEventListener('mousemove', onDragMouse)
    window.addEventListener('mouseup', stopDrag)
  } else {
    window.addEventListener('touchmove', onDragTouch, { passive: false })
    window.addEventListener('touchend', stopDrag)
  }
}

function onDragMouse(e: MouseEvent) {
  onDrag(e.clientX, e.clientY)
}
function onDragTouch(e: TouchEvent) {
  e.preventDefault()
  onDrag(e.touches[0].clientX, e.touches[0].clientY)
}
function onDrag(x: number, y: number) {
  if (!dragging) return
  emit('drag', { x: x - offset.x, y: y - offset.y })
}
function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDragMouse)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDragTouch)
  window.removeEventListener('touchend', stopDrag)
}

/* --------------------
   RESIZING
-------------------- */
let resizing = false
let resizeStart = { x: 0, y: 0 }
let initialSize = { width: 0, height: 0 }

function startResizeMouse(e: MouseEvent) {
  startResize(e.clientX, e.clientY, 'mouse')
}
function startResizeTouch(e: TouchEvent) {
  startResize(e.touches[0].clientX, e.touches[0].clientY, 'touch')
}

function startResize(x: number, y: number, type: 'mouse' | 'touch') {
  resizing = true
  resizeStart = { x, y }
  initialSize = { ...props.size }

  if (type === 'mouse') {
    window.addEventListener('mousemove', onResizeMouse)
    window.addEventListener('mouseup', stopResize)
  } else {
    window.addEventListener('touchmove', onResizeTouch, { passive: false })
    window.addEventListener('touchend', stopResize)
  }
}

function onResizeMouse(e: MouseEvent) {
  onResize(e.clientX, e.clientY)
}
function onResizeTouch(e: TouchEvent) {
  e.preventDefault()
  onResize(e.touches[0].clientX, e.touches[0].clientY)
}
function onResize(x: number, y: number) {
  if (!resizing) return
  emit('resize', {
    width: Math.max(100, initialSize.width + (x - resizeStart.x)),
    height: Math.max(100, initialSize.height + (y - resizeStart.y))
  })
}
function stopResize() {
  resizing = false
  window.removeEventListener('mousemove', onResizeMouse)
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('touchmove', onResizeTouch)
  window.removeEventListener('touchend', stopResize)
}

/* --------------------
   MAXIMIZE
-------------------- */
function toggleMaximize() {
  props.maximized ? emit('minimize') : emit('maximize')
}
</script>


<style scoped>
.overlay-panel {
  position: fixed;
  z-index: 10999;
  background: var(--main-background);
  border: 2px solid var(--main-stroke);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}

.panel-header {
  position: relative;        /* needed for absolute positioning of title */
  display: flex;
  justify-content: flex-start; /* align menu items to left */
  align-items: center;
  background: var(--main-background);
  color: var(--main-stroke);
  padding: 6px 12px;
  cursor: grab;
}

.menu {
  display: flex;
  gap: 8px;
  z-index: 1; /* ensure menu is above title if needed */
}

.title {
  position: absolute;       /* position independently */
  left: 50%;                /* center horizontally */
  transform: translateX(-50%); /* actually center */
  white-space: nowrap;       /* prevent wrapping */
  font-weight: bold;
  pointer-events: none;      /* clicks pass through to panel if needed */
  font-size: 14px;
}
.share {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-right: 12px;

  cursor: pointer;
  user-select: none;
  z-index: 2;
}

.copied-text {
  font-size: 14px;
  font-weight: bold;
  color: var(--main-text);
  white-space: nowrap;
}




.menu-item {
  cursor: pointer
}

.content {
  overflow-x: auto;
  flex: 1;
  color: var(--main-text);
  margin-bottom: 20px;
  min-height: 50px;
  scrollbar-width: thick;
  scrollbar-color: var(--main-stroke) var(--main-background);
}

.resize-handle {
  width: 12px;
  height: 12px;
  position: absolute;
  right: 10px;
  bottom: 15px;
  cursor: se-resize;
  color: var(--main-text);
}

.resize-handle i {
  display: inline-block;
  transform: scaleX(-1);
}

.more-to-come {
  position: absolute;
  color: var(--main-text);
  font-size: 14px;
  left: 10px;
  bottom: 5px;
}
</style>

