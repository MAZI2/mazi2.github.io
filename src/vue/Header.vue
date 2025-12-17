<template>
  <div class="header">
    <div class="content">
      <img class="logo" src="/Logo.svg"/>
      <div class="text">
        <span class="title">Matjaž Pogačnik</span>
        <span class="email">matjazpogacnik5@gmail.com</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'Header',
})
</script>

<style scoped>
.header {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 40px;
  left: 50%;
  transform: translate(-50%, -50%); /* Center horizontally & vertically */
  min-width: 300px; /* Minimum width */
  padding: 20px;

  .content {
    display: flex;
    align-items: flex-start;
    color: var(--main-text);
    z-index: 10; /* Make sure it floats above canvas */
    text-align: center;

    .logo {
      margin: 5px;
      height: 24px;
    }

    .text {
      display: flex;
      flex-direction: column;

      .title {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 22px;
      }

      .email {
        margin-top: -5px;
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
</style>

