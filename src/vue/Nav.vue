<template>
  <nav class="navbar">
      <div class="content">
          <button @click="$emit('open-panel', '/route1')">Open Route 1</button>
    <button @click="$emit('open-panel', '/route2')">Open Route 2</button>
    <button @click="$emit('open-panel', '/route3')">Open Route 3</button>
      </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['open-panel'],
  setup(props, { emit }) {
    const open = () => {
        emit('open-panel', '/route1')
    }
    return { open }
  }
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 150px;
  left: 50%;
  transform: translate(-50%, -50%); /* Center horizontally & vertically */
  min-width: 300px;   /* Minimum width */
  max-width: 700px;
  width: 80%;
  padding: 20px;

  padding: 6px 12px;
  background-color: #ffffff;
  border: 2px solid black;
  border-radius: 10px;
  z-index: 10;        /* Make sure it floats above canvas */
  text-align: center;

  .content {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: flex-start;
  }
}


</style>

