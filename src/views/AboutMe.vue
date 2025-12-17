<template>
  <div class="content">
    <span><b>About Me</b></span>
    <span>I’m Matjaž Pogačnik, a researcher and developer exploring brain-inspired AI, neural networks, and emergent behavior. I love building systems that blend technology, art, and human perception. <br> Collaboration and creativity drive my work, whether it’s interactive installations with light and sound or designing AI simulations, I thrive at the intersection of science and art. Music is a huge passion of mine, shaping how I think, create, and connect with the world.<br>
        I’m always excited to explore new ideas, push boundaries, and find inspiration in unexpected places.</span>
    <img class="picture" src="/pictureOfMe.jpg"/>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  gap: 15px;
  padding: 20px;
  flex-direction: column;
  height: 300px;

  img {
    align-self: flex-end;
    max-width: 220px;
    border-radius: 10px;
    width: auto;
    height: auto;
  }
}
</style>
