
class cvRectangle{
    //left top corner of rectangle (px)
    constructor( canvas_context, startX, startY, height, width ){
        this.context = canvas_context
        this.x = startX
        this.y = startY
        this.height = height
        this.width = width
    }

    get startX(){ return this.x }
    get startY(){ return this.y }

    draw() {
        this.context.beginPath()
        this.context.rect(this.x, this.y, this.height, this.width)
        this.context.closePath()
        this.context.stroke()
    }

    update( x, y, height, width) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
    }

    update(height, width) {
        this.height = height
        this.width = width
    }
}

export default cvRectangle