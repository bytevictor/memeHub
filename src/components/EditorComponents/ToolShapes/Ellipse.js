import {Ellipse} from 'react-konva'

export function handleEllipseMouseDown(e){
    let pos = this.stageRef.current.getPointerPosition()

    //get the bottomToolbar that is rendered
    let bottomToolbar = this.bottomToolbarRef.current.bottomToolbarRef.current

    let new_rect = <Ellipse
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

export function handleEllipseMouseMove(e){
    if( this.state.isDrawing ){
        let lastRectangle = this.rectRef.current
        let pos = this.stageRef.current.getPointerPosition()

        let lrData = this.lastRectangle

        lrData.width  = pos.x - lrData.x
        lrData.height = pos.y - lrData.y

        lastRectangle.setAttrs({
            x: (lrData.width < 0)  ? lrData.x + (lrData.width/2)  
                                    : lrData.x + (lrData.width / 2),
            y: (lrData.height < 0) ? lrData.y + (lrData.height/2) 
                                    : lrData.y + (lrData.height / 2),
            width: Math.abs(lrData.width),
            height: Math.abs(lrData.height)
        })

        //redraw the changed line
        this.stageRef.current.batchDraw()
    }
}

export function handleEllipseMouseUp(e){
    if(this.state.isDrawing){
        this.setState({isDrawing: false})
    }
}
