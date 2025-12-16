<template>
   <div class="separator" />
   <div class="portfolio-menu">
        <i :class="viewGrid ? 'fa fa-th-large' : 'fa fa-list'" aria-hidden="true" @click="toggleView"></i>
   </div> 
   <div class="content">
      <span><b>Portfolio</b></span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const viewGrid = ref(false)

const toggleView = () => {
    viewGrid.value = !viewGrid.value
}
</script>


<style scoped>
.separator {
    height: 2px;
    margin: 0 10px;
    background: black;
}
.portfolio-menu {
    padding: 5px 12px;
    display: flex;
    justify-content: flex-end; /* push content to the right */
    align-items: flex-start;
}
.content {
    padding: 0 20px;
}
</style>
