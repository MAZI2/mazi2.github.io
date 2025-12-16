<template>
  <div class="overlay-panel">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OverlayPanel',
})
</script>

<style scoped>
.overlay-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center horizontally & vertically */
  max-width: 600px;   /* Maximum width */
  min-width: 300px;   /* Minimum width */
  width: 80%;         /* Responsive width */
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9); /* semi-transparent */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10;        /* Make sure it floats above canvas */
  text-align: center;
}
</style>

