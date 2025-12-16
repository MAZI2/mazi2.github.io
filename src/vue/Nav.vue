<template>
  <nav class="navbar">
      <div class="content">
          <a @click="$emit('open-panel', '/route1')">Section 1</a>
          <a @click="$emit('open-panel', '/route2')">Section 2</a>
          <a @click="$emit('open-panel', '/route3')">Section 3</a>
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
  background-color: #ffffff;
  border: 2px solid black;
  border-radius: 10px;
  z-index: 10;        /* Make sure it floats above canvas */
  text-align: center;

  .content {
  padding: 6px 12px;
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: flex-start;
  }
}


</style>

