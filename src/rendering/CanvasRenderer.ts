import {Simulation} from '../simulation/Simulation'
import {Vector2} from '../simulation/Vector2'

export class CanvasRenderer {
    ctx: CanvasRenderingContext2D

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!
    }

    getCssVar(name: string): string | undefined | null {
        const appEl = document.querySelector('#app') as HTMLElement | null
        if (!appEl) return
        const theme = getComputedStyle(appEl)
            .getPropertyValue(name)
            .trim()
        return theme
    }


    draw(
        sim: Simulation,
        offset: Vector2,
        viewportWidth: number,
        viewportHeight: number
    ) {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // DEBUG: draw exclusion zones
        /*
    for (const zone of sim.exclusionZones) {
      const x = zone.x - offset.x
      const y = zone.y - offset.y

      this.ctx.save()
      this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)'
      this.ctx.lineWidth = 2
      this.ctx.setLineDash([6, 6])
      this.ctx.strokeRect(x, y, zone.width, zone.height)

      if (zone.padding) {
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)'
        this.ctx.strokeRect(
          x - zone.padding,
          y - zone.padding,
          zone.width + zone.padding * 2,
          zone.height + zone.padding * 2
        )
      }

      this.ctx.restore()
    }
    */

        // --- 1️⃣ Draw all connections first ---
        for (const neuron of sim.neurons) {
            const x = neuron.position.x - offset.x
            const y = neuron.position.y - offset.y

            if (neuron.connections.length === 0) continue

            const points = [new Vector2(x, y)]
            for (const id of neuron.connections) {
                const target = sim.neurons.find(n => n.id === id)
                if (target) points.push(new Vector2(target.position.x - offset.x, target.position.y - offset.y))
            }

            const centroid = new Vector2(
                points.reduce((sum, p) => sum + p.x, 0) / points.length,
                points.reduce((sum, p) => sum + p.y, 0) / points.length
            )

            // Line from neuron to centroid
            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(centroid.x, centroid.y)
            this.ctx.strokeStyle = this.getCssVar('--main-stroke')
            this.ctx.lineWidth = 2
            this.ctx.stroke()

            // Lines from centroid to connected neurons
            for (const id of neuron.connections) {
                const target = sim.neurons.find(n => n.id === id)
                if (!target) continue
                this.ctx.beginPath()
                this.ctx.moveTo(centroid.x, centroid.y)
                this.ctx.lineTo(target.position.x - offset.x, target.position.y - offset.y)
                this.ctx.strokeStyle = this.getCssVar('--main-stroke')
                this.ctx.lineWidth = 2
                this.ctx.stroke()
            }
        }

        // --- 2️⃣ Draw all neurons on top ---
        for (const neuron of sim.neurons) {
            const x = neuron.position.x - offset.x
            const y = neuron.position.y - offset.y

            // Skip neurons outside viewport
            if (x + neuron.radius < 0 || x - neuron.radius > viewportWidth) continue
            if (y + neuron.radius < 0 || y - neuron.radius > viewportHeight) continue

            // Draw main neuron
            this.ctx.beginPath()
            this.ctx.arc(x, y, neuron.radius, 0, Math.PI * 2)
            this.ctx.fillStyle = this.getCssVar('--main-background')
            this.ctx.fill()
            this.ctx.lineWidth = 2
            this.ctx.strokeStyle = this.getCssVar('--main-stroke')
            this.ctx.stroke()

            // Draw firing indicator as smaller black circle
            if (neuron.firing) {
                const indicatorRadius = neuron.radius * 0.4 // adjust size
                this.ctx.beginPath()
                this.ctx.arc(x, y, indicatorRadius, 0, Math.PI * 2)
                this.ctx.fillStyle = this.getCssVar('--main-stroke')
                this.ctx.fill()
            }
        }
    }
}
