import { Neuron } from './Neuron'
import { Vector2 } from './Vector2'

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

export class Space {
  restDistance = 80
  stiffness = 0.01
  repulsionDistance = 40
  repulsionStrength = 20
  propagationDelay = 0.2

  applyForces(neurons: Neuron[], dt: number, forceScale = 1) {

    const localDistance = 120
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

