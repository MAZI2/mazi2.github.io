<template>

  <Controls />
  <Viewport /> <!-- neuron canvas -->

  <!-- Overlay panel centered -->
  <OverlayPanel>
    <h2>Neuron Simulation Controls</h2>
    <p>Drag neurons or scroll to explore the network.</p>
    <button @click="resetSimulation">Reset</button>
  </OverlayPanel>

  <!-- Controls in bottom-left -->
</template>

<script lang="ts">
import Viewport from './vue/Viewport.vue'
import OverlayPanel from './vue/OverlayPanel.vue'
import Controls from './vue/Controls.vue'

export default {
  components: { Viewport, OverlayPanel, Controls },
  methods: {
    resetSimulation() {
      console.log('Reset clicked!')
    },
  },
}
</script>

<style>
/* Ensure the app root doesn’t create new stacking context */
#app {
  position: relative;
  overflow: hidden;
}
</style>

