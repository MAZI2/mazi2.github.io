import { Vector2 } from './Vector2'

let neuronCounter = 0

export class Neuron {
  id: number
  position: Vector2
  velocity = new Vector2()
  radius = 16
  mass = 1
  isDragged = false

  firing = false
  firingTimer = 0
  firingRate = 1
  pulseTime = 0.1
  propagatedFiring = false
  propagationTimer = 0
  propagationDelay = 0.2
  receivedSignals: Set<number> = new Set()

  color: string = '#ffffff'
  outline: string = '#000000'

  neighbourIds: Set<number> = new Set()
  connections: number[] = []

  constructor(x: number, y: number) {
    this.id = neuronCounter++
    this.position = new Vector2(x, y)
    this.velocity = new Vector2(0, 0) // ensure proper instance
  }

  applyForce(force: Vector2) {
    if (!this.isDragged) this.velocity.add(force.scale(1 / this.mass))
  }

  update(dt: number, simNeurons?: Neuron[]) {
    if (!this.isDragged) {
      this.position.add(this.velocity.clone().scale(dt))
      this.velocity.scale(0.95)
    }

    // Dragged firing
    /*
    if (this.isDragged) {
      this.firingTimer += dt
      if (!this.firing && this.firingTimer >= this.firingRate) {
        this.firing = true
        this.firingTimer = 0
        if (simNeurons) {
          for (const n of simNeurons) n.receivedSignals.clear()
        }
      } else if (this.firing && this.firingTimer >= this.pulseTime) {
        this.firing = false
        this.firingTimer = 0
      }
    }
    */



    // Propagated firing
    if (this.propagatedFiring) {
      this.propagationTimer += dt
      if (this.propagationTimer >= this.propagationDelay) {
        this.firing = true
        this.firingTimer = 0
        this.propagatedFiring = false
        this.propagationTimer = 0
      }
    }

    // Auto-reset firing for non-dragged neurons
    if (this.firing && !this.isDragged) {
      this.firingTimer += dt
      if (this.firingTimer >= this.pulseTime) {
        this.firing = false
        this.firingTimer = 0
      }
    }
  }
}

