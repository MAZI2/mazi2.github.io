<template>
  <nav class="navbar">
      <i class="fa fa-hand-pointer-o" aria-hidden="true"></i>

    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.navbar {
  padding: 20px;
  background-color: #ffffff;
  border: 2px solid black;
  border-radius: 10px;
  z-index: 10;        /* Make sure it floats above canvas */
  text-align: center;
}

.navbar ul {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
</style>

