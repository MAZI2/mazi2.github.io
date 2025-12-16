import { Neuron } from './Neuron'
import { Space } from './Space'
import { Viewport } from '../vue/Viewport'
import { Vector2 } from './Vector2'

const TILE_SIZE = 200

export class Simulation {
  neurons: Neuron[] = []
  tiles: Map<string, Neuron[]> = new Map()
  space = new Space()
  initialized = false

  constructor() {}

  private generateNeuronsInTile(tileX: number, tileY: number) {
    const neurons: Neuron[] = []
    const offsetX = tileX * TILE_SIZE
    const offsetY = tileY * TILE_SIZE
    const density = 10
    const padding = 20

    for (let i = 0; i < density; i++) {
      const x = offsetX + padding + Math.random() * (TILE_SIZE - 2 * padding)
      const y = offsetY + padding + Math.random() * (TILE_SIZE - 2 * padding)
      neurons.push(new Neuron(x, y))
    }
    return neurons
  }

  updateVisibleTiles(viewport: Viewport) {
    const visibleTiles = new Set<string>()
    const startX = Math.floor(viewport.offsetX / TILE_SIZE)
    const startY = Math.floor(viewport.offsetY / TILE_SIZE)
    const endX = Math.ceil((viewport.offsetX + viewport.width) / TILE_SIZE)
    const endY = Math.ceil((viewport.offsetY + viewport.height) / TILE_SIZE)

    for (let x = startX - 1; x <= endX + 1; x++) {
      for (let y = startY - 1; y <= endY + 1; y++) {
        const key = `${x},${y}`
        if (!this.tiles.has(key)) {
          const newNeurons = this.generateNeuronsInTile(x, y)
          this.tiles.set(key, newNeurons)
          this.neurons.push(...newNeurons)
        }
        visibleTiles.add(key)
      }
    }

    // Unload tiles outside viewport
    for (const key of this.tiles.keys()) {
      if (!visibleTiles.has(key)) {
        const toRemove = this.tiles.get(key)!
        toRemove.forEach(n => {
          const idx = this.neurons.indexOf(n)
          if (idx >= 0) this.neurons.splice(idx, 1)
        })
        this.tiles.delete(key)
      }
    }
  }

  update(dt: number) {
    const forceScale = this.initialized ? 1 : 0.1
    this.space.applyForces(this.neurons, dt, forceScale)

    for (const neuron of this.neurons) {
      neuron.update(dt, this.neurons)
    }

    if (!this.initialized) this.initialized = true
  }
}

