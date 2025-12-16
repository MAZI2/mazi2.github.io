<template>
    <canvas ref="canvas" width="600" height="400" />
</template>


<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { Simulation } from '../simulation/Simulation'
    import { CanvasRenderer } from '../rendering/CanvasRenderer'


    const canvas = ref<HTMLCanvasElement>()
    const sim = new Simulation()
    let renderer: CanvasRenderer
    let dragged: any = null


    onMounted(() => {
        renderer = new CanvasRenderer(canvas.value!)


        const loop = () => {
            sim.update(0.016)
            renderer.draw(sim)
            requestAnimationFrame(loop)
        }
        loop()


        canvas.value!.addEventListener('mousedown', e => {
            const rect = canvas.value!.getBoundingClientRect()
            dragged = sim.findNeuronAt(e.clientX - rect.left, e.clientY - rect.top)
            if (dragged) {
                dragged.isDragged = true
                dragged.timeCounter = 0
                dragged.firing = true 
                dragged.firingTimer = 0

                // reset receivedSignals for all neurons
                for (const n of sim.neurons) {
                  n.receivedSignals.clear()
                }

            }
        })


        canvas.value!.addEventListener('mousemove', e => {
            if (!dragged) return
            const rect = canvas.value!.getBoundingClientRect()
            dragged.position.x = e.clientX - rect.left
            dragged.position.y = e.clientY - rect.top
        })


        window.addEventListener('mouseup', () => {
            if (dragged) dragged.isDragged = false
            dragged = null
        })
    })
</script>


<style scoped>
canvas {
    border: 1px solid #333;
    background: #ffffff;
}
</style>
