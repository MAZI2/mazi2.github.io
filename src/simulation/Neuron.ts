import { Vector2 } from './Vector2'

let neuronCounter = 0

export class Neuron {
  id: number
  position: Vector2
  velocity = new Vector2()
  radius = 12
  mass = 1
  isDragged = false

  // Firing properties
  firing = false          // visual firing (colored)
firingTimer = 0         // duration to show firing
firingRate = 0.5
propagatedFiring = false
propagationTimer = 0
pulseTime = 0.5         // seconds to stay visually firing
  

  // Styling
  color: string = '#ffffff'
  outline: string = '#000000'
  glow: boolean = false

  // Network connections
  neighbourIds: Set<number> = new Set()
  connections: number[] = []

  receivedSignals: Set<number> = new Set()

  constructor(x: number, y: number) {
    this.id = neuronCounter++
    this.position = new Vector2(x, y)
  }

  applyForce(force: Vector2) {
    if (this.isDragged) return
    this.velocity.add(force.scale(1 / this.mass))
  }

  update(dt: number) {
  // Physics
  if (!this.isDragged) {
    this.position.add(this.velocity.clone().scale(dt))
    this.velocity.scale(0.95)
  }

  // Dragged firing
  if (this.isDragged) {
    this.firingTimer += dt
    if (!this.firing && this.firingTimer >= this.firingRate) {
      this.firing = true
      this.firingTimer = 0
    } else if (this.firing && this.firingTimer >= this.pulseTime) {
      this.firing = false
      this.firingTimer = 0
    }
  }

  // Propagated firing
  if (this.propagatedFiring) {
    this.propagationTimer += dt
    if (this.propagationTimer >= this.propagationDelay) {
      this.firing = true          // visual firing for neighbours
      this.propagatedFiring = false
      this.propagationTimer = 0
      this.firingTimer = 0        // start visual pulse timer
    }
  }

  // Update visual firing duration
  if (this.firing && !this.isDragged) {
    this.firingTimer += dt
    if (this.firingTimer >= this.pulseTime) {
      this.firing = false
      this.firingTimer = 0
    }
  }
}

}

