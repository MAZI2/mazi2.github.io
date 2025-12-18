<template>
  <div class="controls">
    <span class="control-item grab">
      <i aria-hidden="true" class="fa fa-hand-pointer-o"></i>
      <p>Grab a neuron.</p>
    </span>
  </div>

  <!-- SETTINGS BUTTON (teleported) -->
  <Teleport to="body">
    <div class="settings-portal" ref="dropdownRef">
        <span class="control-item" @click="toggleMenu">
          <i class="fa fa-cog"></i>
          <p>Settings</p>
        </span>
    </div>
  </Teleport>

  <!-- DROPDOWN MENU (teleported) -->
  <Teleport to="body">
    <div
        v-if="menuOpen"
        class="dropdown-menu dropdown-portal"
        :style="portalStyle"
    >
      <span class="dropdown-item" @click="toggle">
        <i :class="paused ? 'fa fa-play' : 'fa fa-pause'"></i>
        {{ paused ? 'Resume simulation' : 'Pause simulation' }}
      </span>

      <span class="dropdown-item" @click="toggleDarkMode">
        <i class="fa fa-adjust"></i>
        Toggle theme
      </span>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed
} from 'vue'

const paused = ref(false)
const darkMode = ref(false)
const menuOpen = ref(false)

const dropdownRef = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  (e: 'toggle-animation'): void
}>()

watch(
    darkMode,
    () => {
      document.documentElement.setAttribute(
          'data-theme',
          darkMode.value ? 'dark' : 'light'
      )
    },
    { immediate: true }
)

const toggle = () => {
  paused.value = !paused.value
  emit('toggle-animation')
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (!menuOpen.value) return

  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    menuOpen.value = false
  }
}

const portalStyle = computed(() => {
  if (!dropdownRef.value) return {}

  const rect = dropdownRef.value.getBoundingClientRect()

  return {
    position: 'fixed',
    right: `${window.innerWidth - rect.right}px`,
    bottom: `${window.innerHeight - rect.top + 12}px`
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.controls {
  position: fixed;
  bottom: 10px;
  left: 30px;
  right: 30px;
  display: flex;
  justify-content: flex-start;
  color: var(--main-text);
  z-index: 10; /* normal UI */
}

.settings-portal {
  position: fixed;
  bottom: 10px;
  right: 30px;
  z-index: 2147483646; /* ABOVE EVERYTHING */
}

.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--main-text);
  cursor: pointer;
}

.dropdown-item {
  color: var(--main-text);
}

.dropdown-portal {
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2147483647;
  background: var(--main-background);
  border: 2px solid var(--main-stroke);
  border-radius: 10px;
  padding: 6px 12px;
  width: fit-content;
  white-space: nowrap;
}
</style>
