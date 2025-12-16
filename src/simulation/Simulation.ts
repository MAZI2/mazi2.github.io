import { Neuron } from './Neuron'
import { Space } from './Space'


export class Simulation {
    neurons: Neuron[] = []
    space = new Space()


    constructor() {
        this.neurons.push(
            new Neuron(200, 200),
            new Neuron(300, 220),
            new Neuron(250, 300)
            )
    }


    update(dt: number) {
        this.space.applyForces(this.neurons, dt)
        this.neurons.forEach(n => n.update(dt))
    }


    findNeuronAt(x: number, y: number) {
        return this.neurons.find(n =>
            Math.hypot(n.position.x - x, n.position.y - y) < n.radius
        )
    }
}
