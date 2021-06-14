import {Rect} from 'react-konva'

export function handleRectangleMouseDown(e){
    let pos = this.stageRef.current.getPointerPosition()

    //get the bottomToolbar that is rendered
    let bottomToolbar = this.bottomToolbarRef.current.bottomToolbarRef.current

    let new_rect = <Rect
                    key={this.state.itemArray.length}
                    ref={this.rectRef}

                    x={pos.x}
                    y={pos.y}

                    width={0}
                    height={0}

                    fill={'#'+bottomToolbar.state.fill.hex}

                    stroke={'#'+bottomToolbar.state.strokeColor.hex}
                    strokeWidth={bottomToolbar.state.strokeWidth}

                    shadowColor={'#'+bottomToolbar.state.shadowColor.hex}
                    shadowBlur={bottomToolbar.state.shadowWidth}

                    cornerRadius={bottomToolbar.state.cornerRadius}

                    draggable
                   />

    //Data saving for creating the rectangle (width and height should be positive)
    this.lastRectangle = {x: pos.x, y: pos.y,
                          width: 0, height: 0}

    this.state.itemArray.push(new_rect)

    this.setState({isDrawing: true})
}

export function handleRectangleMouseMove(e){
    if( this.state.isDrawing ){
        let lastRectangle = this.rectRef.current
        let pos = this.stageRef.current.getPointerPosition()

        let lrData = this.lastRectangle

        lrData.width  = pos.x - lrData.x
        lrData.height = pos.y - lrData.y

        lastRectangle.setAttrs({
            x: (lrData.width < 0) ? lrData.x + lrData.width : lrData.x,
            y: (lrData.height < 0) ? lrData.y + lrData.height : lrData.y,
            width: Math.abs(lrData.width),
            height: Math.abs(lrData.height)
        })

        /*  Still not working like this
        let rect_width = lastRectangle.getAttr('width')
        let rect_height = lastRectangle.getAttr('height')

        //Width and Height cannot be negative for the rectangle to
        //work properly so we have to calculate the whole rectangle
        //depending on witch direction the user moves the mouse
        if( pos.x - rect_x + rect_width > 0 && pos.y - rect_y + rect_height > 0){
            //From top-left to bottom-right
            console.log("Es top-left")
            lastRectangle.setAttrs({ width : pos.x - rect_x ,
                                     height: pos.y - rect_y })
        } else if( pos.y - rect_y + rect_width >= 0 ){
            //From top-right to bottom-left
            let w = rect_x - pos.x + rect_width
            lastRectangle.setAttrs({ 
                                     x: pos.x,
                                     width : w,
                                     height: pos.y - rect_y })
            console.log("Es top-right")
            console.log("x: ", rect_x)
            console.log("new x: ", rect_x - pos.x)
            console.log("y: ", rect_y)
            console.log("w: ", w)
        } */
        
        //lastRectangle.setAttrs({ width : pos.x - rect_x,
        //                         height: pos.y - rect_y })

        //redraw the changed line
        this.stageRef.current.batchDraw()
    }
}

export function handleRectangleMouseUp(e){
    if(this.state.isDrawing){
        this.setState({isDrawing: false})
    }
}
