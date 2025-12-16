<template>
  <nav class="navbar">
      <div class="content">
          <i v-if="maximized" class="fa fa-window-minimize-o" aria-hidden="true"></i>
          <i v-else class="fa fa-window-maximize-o" aria-hidden="true"></i>

          <i class="fa fa-hand-pointer-o" aria-hidden="true"></i>
          <i class="fa fa-hand-pointer-o" aria-hidden="true"></i>
      </div>
  </nav>
</template>

<script setup lang="ts">
    const maximized = false
</script>

<style scoped>
.navbar {
  padding: 6px 0;
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

