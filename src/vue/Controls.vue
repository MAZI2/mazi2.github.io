<template>
  <div class="controls">
  <span class="control-item">
      <i class="fa fa-hand-pointer-o" aria-hidden="true"></i>
      <p>Grab a neuron.</p>
  </span>
  <span class="control-item">
      <i class="pause-button" :class="paused ? 'fa fa-play' : 'fa fa-pause'" @click="toggle"></i>

    <p>{{ paused ? 'Resume simulation' : 'Pause simulation' }}</p>
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'

const paused = ref(false)

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
  color: black;
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

