import {Neuron} from './Neuron'
import {Vector2} from './Vector2'

function setsEqual(a: Set<any>, b: Set<any>) {
    if (a.size !== b.size) return false
    for (const val of a) if (!b.has(val)) return false
    return true
}

function randomConnections(ids: number[], min: number, max: number) {
    const n = Math.min(ids.length, min + Math.floor(Math.random() * (max - min + 1)))
    const shuffled = ids.slice().sort(() => 0.5 - Math.random())
    return shuffled.slice(0, n)
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v))
}


export class Space {
    restDistance = 160
    stiffness = 0.05
    repulsionDistance = 200
    repulsionStrength = 520
    propagationDelay = 0.2

    applyForces(neurons: Neuron[], dt: number, exclusionZones: ExclusionZone[] = [], viewport?: Viewport) {

        const localDistance = 220
        // Update neighbourhoods and connections
        for (const neuron of neurons) {
            const prevNeighbourIds = new Set(neuron.neighbourIds)
            neuron.neighbourIds.clear()

            for (const other of neurons) {
                if (neuron.id === other.id) continue
                const dist = neuron.position.clone().sub(other.position).length()
                if (dist < this.restDistance) neuron.neighbourIds.add(other.id)
            }

            const changed = !setsEqual(prevNeighbourIds, neuron.neighbourIds)
            if (changed) neuron.connections = randomConnections(Array.from(neuron.neighbourIds), 1, 4)
        }

        // Apply spring + repulsion with dt scaling
        for (let i = 0; i < neurons.length; i++) {
            const a = neurons[i]

            for (let j = i + 1; j < neurons.length; j++) {
                const b = neurons[j]

                const dir = b.position.clone().sub(a.position)
                const dist = dir.length() || 0.001
                if (dist > localDistance) continue  // skip neurons outside local radius
                dir.normalize()

                // Spring for neighbors
                let forceMag = 0
                if (a.connections.includes(b.id) || b.connections.includes(a.id)) {
                    forceMag += this.stiffness * (dist - this.restDistance)
                }

                // Local repulsion
                const repulsionDistance = 40
                if (dist < repulsionDistance) {
                    forceMag -= this.repulsionStrength * (1 - dist / repulsionDistance)
                }

                const force = dir.scale(forceMag * dt)
                a.applyForce(force.clone())
                b.applyForce(force.clone().scale(-1))
            }
        }

        for (const neuron of neurons) {
            for (const zone of exclusionZones) {
                const pad = zone.padding ?? 60

                // Zone position relative to viewport
                const left = zone.x + viewport.offsetX - pad
                const right = zone.x + viewport.offsetX + zone.width + pad
                const top = zone.y + viewport.offsetY - pad
                const bottom = zone.y + viewport.offsetY + zone.height + pad

                if (
                    neuron.position.x >= left &&
                    neuron.position.x <= right &&
                    neuron.position.y >= top &&
                    neuron.position.y <= bottom
                ) {
                    // nearest horizontal edge
                    let dx = 0
                    if (neuron.position.x - left < right - neuron.position.x) dx = neuron.position.x - left
                    else dx = neuron.position.x - right

                    // nearest vertical edge
                    let dy = 0
                    if (neuron.position.y - top < bottom - neuron.position.y) dy = neuron.position.y - top
                    else dy = neuron.position.y - bottom

                    // flip direction to point outward
                    dx = -dx
                    dy = -dy

                    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
                    const maxStrength = 50
                    const strength = Math.min(maxStrength, 100 / dist)

                    const zoneForceMultiplier = 3
                    const force = new Vector2((dx / dist) * strength * zoneForceMultiplier, (dy / dist) * strength * zoneForceMultiplier)
                    neuron.applyForce(force)
                }
            }
        }


        // Firing propagation with cycle prevention
        for (const neuron of neurons) {
            if (neuron.firing) {
                for (const targetId of neuron.connections) {
                    const target = neurons.find(n => n.id === targetId)
                    if (!target) continue

                    if (!target.receivedSignals.has(neuron.id)) {
                        target.receivedSignals.add(neuron.id)
                        target.propagatedFiring = true
                        target.propagationTimer = 0
                    }
                }
            }
        }
    }
}

