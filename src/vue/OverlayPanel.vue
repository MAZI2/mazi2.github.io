<template>
  <div class="overlay-panel">
    <NavBar />
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavBar from './Nav.vue'

export default defineComponent({
  name: 'OverlayPanel',
  components: {NavBar}
})
</script>

<style scoped>
.overlay-panel {
    position: fixed;
    top: 350px;
  left: 50%;
  transform: translate(-50%, -50%); /* Center horizontally & vertically */
  max-width: 700px;   /* Maximum width */
  min-width: 300px;   /* Minimum width */
  width: 80%;         /* Responsive width */
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;

    .content {
    background-color: #ffffff; /* semi-transparent */
    border: 2px solid black;
  border-radius: 10px;
  z-index: 10;        /* Make sure it floats above canvas */
  text-align: center;
    height: 300px;
    }
}
</style>

