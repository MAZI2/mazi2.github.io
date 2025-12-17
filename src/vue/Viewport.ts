export class Viewport {
    offsetX = 0
    offsetY = 0
    targetOffsetY = 0 // target scroll position for smoothness
    width = window.innerWidth
    height = window.innerHeight
    scrollSpeed = 1
    smoothFactor = 0.1 // lower = smoother but slower

    constructor() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
        })
    }

    // Accumulate scroll input
    onScroll(deltaY: number) {
        this.targetOffsetY += deltaY * this.scrollSpeed
    }

    // Call every frame to smoothly interpolate
    update() {
        this.offsetY += (this.targetOffsetY - this.offsetY) * this.smoothFactor
    }
}

