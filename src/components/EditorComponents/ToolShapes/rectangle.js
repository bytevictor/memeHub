
class cvRectangle{
    //left top corner of rectangle (px)
    constructor( canvas_context, startX, startY, height, width ){
        this.context = canvas_context
        this.x = startX
        this.y = startY
        this.height = height
        this.width = width
    }

    draw() {
        this.context.beginPath()
        this.context.rect(this.x, this.y, this.height, this.width)
    }

    update( x, y, height, width) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
    }
}

addEventListener( 'click', (event) => {
    console.log("click")
})