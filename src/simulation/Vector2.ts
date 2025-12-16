export class Vector2 {
    constructor(public x = 0, public y = 0) {}


    clone() {
        return new Vector2(this.x, this.y)
    }


    add(v: Vector2) {
        this.x += v.x
        this.y += v.y
        return this
    }


    sub(v: Vector2) {
        this.x -= v.x
        this.y -= v.y
        return this
    }


    scale(s: number) {
        this.x *= s
        this.y *= s
        return this
    }


    length() {
        return Math.hypot(this.x, this.y)
    }


    normalize() {
        const len = this.length() || 1
        return this.scale(1 / len)
    }


    static distance(a: Vector2, b: Vector2) {
        return Math.hypot(a.x - b.x, a.y - b.y)
    }
}
