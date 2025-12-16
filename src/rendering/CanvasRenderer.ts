import { Simulation } from '../simulation/Simulation'
import { Vector2 } from '../simulation/Vector2'

export class CanvasRenderer {
  ctx: CanvasRenderingContext2D

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
  }

  draw(sim: Simulation, offset: Vector2, viewportWidth: number, viewportHeight: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (const neuron of sim.neurons) {
      const x = neuron.position.x - offset.x
      const y = neuron.position.y - offset.y

      // Skip neurons outside viewport + padding
      if (x + neuron.radius < 0 || x - neuron.radius > viewportWidth) continue
      if (y + neuron.radius < 0 || y - neuron.radius > viewportHeight) continue

      // Draw connections as centroid lines
      if (neuron.connections.length > 0) {
        const points = [new Vector2(x, y)]
        for (const id of neuron.connections) {
          const target = sim.neurons.find(n => n.id === id)
          if (target) points.push(new Vector2(target.position.x - offset.x, target.position.y - offset.y))
        }

        const centroid = new Vector2(
          points.reduce((sum, p) => sum + p.x, 0) / points.length,
          points.reduce((sum, p) => sum + p.y, 0) / points.length
        )

        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(centroid.x, centroid.y)
        this.ctx.strokeStyle = '#fdcb6e'
        this.ctx.lineWidth = 2
        this.ctx.stroke()

        for (const id of neuron.connections) {
          const target = sim.neurons.find(n => n.id === id)
          if (!target) continue
          this.ctx.beginPath()
          this.ctx.moveTo(centroid.x, centroid.y)
          this.ctx.lineTo(target.position.x - offset.x, target.position.y - offset.y)
          this.ctx.strokeStyle = '#fdcb6e'
          this.ctx.lineWidth = 2
          this.ctx.stroke()
        }
      }

      // Draw neuron
      this.ctx.beginPath()
      this.ctx.arc(x, y, neuron.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = neuron.firing ? '#ff7675' : neuron.color
      this.ctx.fill()
      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = neuron.outline
      this.ctx.stroke()
    }
  }
}

