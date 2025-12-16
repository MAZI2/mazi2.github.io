<template>
  <Controls />
  <Viewport :get-exclusion-zone="getExclusionZone" />

  <Header ref="panelRef" />
  <OverlayPanel>
    <h2>Neuron Simulation Controls</h2>
    <p>Drag neurons or scroll to explore the network.</p>
    <button @click="resetSimulation">Reset</button>
  </OverlayPanel>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import ViewportComponent, { Viewport } from './vue/Viewport.vue' // import class
import Controls from './vue/Controls.vue'

import Header from './vue/Header.vue'
import OverlayPanel from './vue/OverlayPanel.vue'

export default {
  components: { Viewport: ViewportComponent, OverlayPanel, Controls, Header },
  setup() {
    const headerRef = ref<InstanceType<typeof Header> | null>(null)
    const navRef = ref<InstanceType<typeof Nav> | null>(null)
    const panelRef = ref<InstanceType<typeof OverlayPanel> | null>(null)

    function getExclusionZone() {

      if (!panelRef.value?.$el) return null
      const rect = panelRef.value.$el.getBoundingClientRect()

      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        padding: 20
      }
    }

    const resetSimulation = () => console.log('Reset clicked!')

    return { panelRef, getExclusionZone, resetSimulation }
  }
}
</script>
