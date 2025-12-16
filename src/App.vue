<template>
  <Controls />
  <Viewport :get-exclusion-zone="getExclusionZone" />

  <TitleHeader ref="headerRef" />
  <OverlayPanel ref="panelRef">
    <h2>Neuron Simulation Controls</h2>
    <p>Drag neurons or scroll to explore the network.</p>
    <button @click="resetSimulation">Reset</button>
  </OverlayPanel>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import ViewportComponent, { Viewport } from './vue/Viewport.vue' // import class
import Controls from './vue/Controls.vue'

import TitleHeader from './vue/Header.vue'
import OverlayPanel from './vue/OverlayPanel.vue'

export default {
  components: { Viewport: ViewportComponent, OverlayPanel, Controls, TitleHeader },
  setup() {
    const headerRef = ref<InstanceType<typeof TitleHeader> | null>(null)
    const panelRef = ref<InstanceType<typeof OverlayPanel> | null>(null)

    function getExclusionZone() {
      if (!panelRef.value?.$el || !headerRef.value?.$el) return null
      const rect = panelRef.value.$el.getBoundingClientRect()
      const rect2 = headerRef.value.$el.getBoundingClientRect()

      return [{
        x: rect.left+100,
        y: rect.top,
        width: rect.width-200,
        height: rect.height,
        padding: 20
      },{
        x: rect2.left,
        y: rect2.top,
        width: rect2.width,
        height: rect2.height,
        padding: 20
      }]
    }

    const resetSimulation = () => console.log('Reset clicked!')

    return { panelRef, headerRef, getExclusionZone, resetSimulation }
  }
}
</script>
