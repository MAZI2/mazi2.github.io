import {Neuron} from './Neuron'
import {Space} from './Space'
import {Viewport} from '../vue/Viewport'
import {Vector2} from './Vector2'
import type {ExclusionZone} from './ExclusionZone'

const TILE_SIZE = 400

export class Simulation {
    neurons: Neuron[] = []
    tiles: Map<string, Neuron[]> = new Map()
    space = new Space()
    initialized = false
    exclusionZones: ExclusionZone[] = [
        {
            x: 300,
            y: 200,
            width: 200,
            height: 150,
            padding: 10
        }
    ]

    constructor() {
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

    update(dt: number, viewport?: Viewport) {
        this.space.applyForces(
            this.neurons,
            dt,
            this.exclusionZones,
            viewport
        )

        for (const neuron of this.neurons) {
            // Random firing: small chance each frame
            const fireProbabilityPerSecond = 0.002; // 2% per second
            if (!neuron.firing && Math.random() < fireProbabilityPerSecond * dt) {
                neuron.firing = true;
                neuron.firingTimer = 0;
            }

            // Update firing timer
            if (neuron.firing) {
                neuron.firingTimer += dt;
                if (neuron.firingTimer > neuron.firingDuration) {
                    neuron.firing = false;
                    neuron.firingTimer = 0;
                }
            }

            neuron.update(dt, this.neurons); // your existing neuron update logic
        }
    }

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
}

