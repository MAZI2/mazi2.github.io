<template>
  <div class="controls">
  <span class="control-item">
      <i aria-hidden="true" class="fa fa-hand-pointer-o"></i>
      <p>Grab a neuron.</p>
  </span>
    <span class="control-item">
      <i :class="paused ? 'fa fa-play' : 'fa fa-pause'" class="pause-button" @click="toggle"></i>

    <p>{{ paused ? 'Resume simulation' : 'Pause simulation' }}</p>
      <button @click="toggleDarkMode">Toggle dark</button>
    </span>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, onMounted, ref, watch} from 'vue'

const paused = ref(false)
const darkMode = ref(false)


onMounted(() => {
  watch(
      darkMode,
      (value) => {


        console.log('theme changed')
        document.documentElement.setAttribute(
            'data-theme',
            darkMode.value ? 'dark' : 'light'
        )
      },
      { immediate: true }
  )

})
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}
const emit = defineEmits<{
  (e: 'toggle-animation'): void
}>()

const toggle = () => {
  paused.value = !paused.value
  emit('toggle-animation')
}
</script>

<style scoped>
.controls {
  position: fixed;
  bottom: 10px;
  left: 50%;
  width: calc(100% - 60px);
  transform: translate(-50%, 0%);
  justify-content: space-between;
  color: var(--main-text);
  z-index: 10000;

  display: flex;
  align-items: center;
  gap: 8px;

  .control-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .pause-button {
      cursor: pointer;
      margin: 5px;
    }
  }
}
</style>

