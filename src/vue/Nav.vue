<template>
  <nav class="navbar">

    <button class="hamburger" @click="toggleMobileMenu">
      <i aria-hidden="true" class="fa fa-bars"></i>
    </button>
    <div class="content">
      <!-- Hamburger for mobile -->

      <!-- Links for desktop -->
      <div class="links desktop">
        <a @click="$emit('open-panel', { route: '/about', props: {title: 'About me', slug: 'about'}})">About me</a>
        <a @click="$emit('open-panel', { route: '/portfolio', props: { withMoreToCome: true, title: 'Portfolio', slug: 'portfolio' } })">Portfolio</a>
        <a @click="$emit('open-panel', { route: '/blog', props: { withMoreToCome: true, title: 'Blog', slug: 'blog' } })">Blog</a>
      </div>

      <!-- Dropdown for mobile -->
      <div v-if="isMobileMenuOpen" class="links mobile">
        <a @click="$emit('open-panel', { route: '/about', props: {title: 'About me', slug: 'about'}}); isMobileMenuOpen=false">About me</a>
        <a @click="$emit('open-panel', { route: '/portfolio', props: { withMoreToCome: true, title: 'Portfolio', slug: 'portfolio' } }); isMobileMenuOpen=false">Portfolio</a>
        <a @click="$emit('open-panel', { route: '/blog', props: { withMoreToCome: true, title: 'Blog', slug: 'blog' } }); isMobileMenuOpen=false">Blog</a>
      </div>
    </div>
  </nav>
</template>


<script lang="ts">
import {defineComponent, ref} from 'vue'

export default defineComponent({
  emits: ['open-panel'],
  setup(props, {emit}) {
    const isMobileMenuOpen = ref(false)

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    return {isMobileMenuOpen, toggleMobileMenu, emit}
  }
})
</script>

<style scoped>
.navbar {
  color: var(--main-text);
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 700px;
  width: 90%;
  background-color: var(--main-background);
  border: 2px solid var(--main-stroke);
  border-radius: 10px;
  z-index: 10;
  text-align: center;

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    width: 100%;

  }

  .links.desktop {
    display: flex;
    gap: 15px;
  }

  .links.mobile {
    display: none;
    flex-direction: column;
    gap: 10px;
    position: fixed;
    top: 60px;
    right: 0px;
    align-items: flex-start;
    background: var(--main-background);
    border: 2px solid var(--main-stroke);
    border-radius: 10px;
    padding: 10px;
    width: fit-content;
  }

  .hamburger {
    position: fixed;
    right: 0;
    margin: 17px 10px;
    padding: 0;
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--main-text);

    i {
      font-size: 20px;
    }
  }
}

/* Mobile breakpoint */
@media screen and (max-width: 600px) {
  .navbar {
    background: transparent;
    border: none;
    z-index: 200000;
    top: 0;
  }

  .links.desktop {
    display: none !important;
  }

  .hamburger {
    display: block !important;
  }

  .links.mobile {
    display: flex !important;
  }
}


</style>

