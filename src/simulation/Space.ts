import { Neuron } from './Neuron'
import { Vector2 } from './Vector2'

// Helper functions
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
  neighbourhoodDistance = 100
  stiffness = 0.05
  repulsionDistance = 40
  repulsionStrength = 120
  propagationDelay = 0.2 // seconds

  applyForces(neurons: Neuron[], dt: number) {
    // Update neighbourhoods and connections
    for (const neuron of neurons) {
      const prevNeighbourIds = new Set(neuron.neighbourIds)
      neuron.neighbourIds.clear()

      for (const other of neurons) {
        if (neuron.id === other.id) continue
        const dist = neuron.position.clone().sub(other.position).length()
        if (dist < this.neighbourhoodDistance) neuron.neighbourIds.add(other.id)
      }

      // Only recalc connections if neighbourhood changed
      const neighbourhoodChanged = !setsEqual(prevNeighbourIds, neuron.neighbourIds)
      if (neighbourhoodChanged) {
        neuron.connections = randomConnections(Array.from(neuron.neighbourIds), 1, 4)
      }
    }

    // Apply spring + repulsion forces
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const a = neurons[i]
        const b = neurons[j]
        const dir = b.position.clone().sub(a.position)
        const dist = dir.length() || 0.001
        dir.normalize()

        let forceMag = this.stiffness * (dist - this.restDistance)
        if (dist < this.repulsionDistance) {
          forceMag -= this.repulsionStrength * (1 - dist / this.repulsionDistance)
        }

        const force = dir.scale(forceMag)
        a.applyForce(force.clone())
        b.applyForce(force.clone().scale(-1))
      }
    }

    // Firing propagation
    // Step 1: process firing neurons (dragged or propagated)
    for (const neuron of neurons) {
      if (neuron.firing && neuron.connections.length > 0) {
        for (const targetId of neuron.connections) {
          const target = neurons.find(n => n.id === targetId)
          if (!target) continue

          // Only propagate if this neuron hasn't already sent a signal to target
          if (!target.receivedSignals.has(neuron.id)) {
            target.receivedSignals.add(neuron.id)
            target.propagatedFiring = true
            target.propagationTimer = 0
          }
        }
      }
    }


    // Step 2: update timers for propagated neurons
    for (const neuron of neurons) {
      if (neuron.propagatedFiring) {
        neuron.propagationTimer += dt
        if (neuron.propagationTimer >= this.propagationDelay) {
          neuron.firing = true        // show firing visually
          neuron.propagatedFiring = false
          neuron.propagationTimer = 0
        }
      }
    }

  }
}

