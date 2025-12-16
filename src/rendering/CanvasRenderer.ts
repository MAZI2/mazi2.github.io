import { Simulation } from '../simulation/Simulation'

export class CanvasRenderer {
  ctx: CanvasRenderingContext2D

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!
  }

  draw(sim: Simulation) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw connections first
    for (const neuron of sim.neurons) {
      if (neuron.connections.length === 0) continue

      // Compute centroid of neuron + connections
      const points = [neuron.position.clone()]
      for (const id of neuron.connections) {
        const target = sim.neurons.find(n => n.id === id)
        if (target) points.push(target.position.clone())
      }

      const centroid = {
        x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
        y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
      }

      // Draw line from neuron to centroid
      this.ctx.beginPath()
      this.ctx.moveTo(neuron.position.x, neuron.position.y)
      this.ctx.lineTo(centroid.x, centroid.y)
      this.ctx.strokeStyle = '#000000'
      this.ctx.lineWidth = 2
      this.ctx.stroke()

      // Draw lines from centroid to each connected neuron
      for (const id of neuron.connections) {
        const target = sim.neurons.find(n => n.id === id)
        if (!target) continue
        this.ctx.beginPath()
        this.ctx.moveTo(centroid.x, centroid.y)
        this.ctx.lineTo(target.position.x, target.position.y)
        this.ctx.strokeStyle = '#000000'
        this.ctx.lineWidth = 2
        this.ctx.stroke()
      }
    }

    // Draw neurons on top
    for (const neuron of sim.neurons) {
      this.ctx.beginPath()
      this.ctx.arc(neuron.position.x, neuron.position.y, neuron.radius, 0, Math.PI * 2)

      // Fill neurons when firing (dragged or propagated)
      this.ctx.fillStyle = neuron.firing ? '#000000' : neuron.color
      this.ctx.fill()

      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = neuron.outline || '#000000'
      this.ctx.stroke()
    }
  }
}

