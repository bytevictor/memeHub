import {Rect} from 'react-konva'

export function handleRectangleMouseDown(e){
    let pos = this.stageRef.current.getPointerPosition()

    //get the bottomToolbar that is rendered
    let bottomToolbar = this.bottomToolbarRef.current.bottomToolbarRef.current

    let new_rect = <Rect
                    key={this.state.itemArray.length}
                    ref={this.lineRef}

                    x={pos.x}
                    y={pos.y}

                    width={0}
                    height={0}

                    fill={null}

                    stroke={'#'+bottomToolbar.state.strokeColor.hex}
                    strokeWidth={bottomToolbar.state.strokeWidth}

                    shadowColor={'#'+bottomToolbar.state.shadowColor.hex}
                    shadowBlur={bottomToolbar.state.shadowWidth}

                    cornerRadius={0}

                    draggable
                   />

    this.state.itemArray.push(new_rect)

    this.setState({isDrawing: true})
}

export function handleRectangleMouseMove(e){
    if( this.state.isDrawing ){
        let lastRectangle = this.lineRef.current
        let pos = this.stageRef.current.getPointerPosition()

        let rect_x = lastRectangle.getAttr('x')
        let rect_y = lastRectangle.getAttr('y')

        lastRectangle.setAttrs({ width : pos.x - rect_x ,
                                 height: pos.y - rect_y })

        //redraw the changed line
        this.stageRef.current.batchDraw()
    }
}

export function handleRectangleMouseUp(e){
    this.setState({isDrawing: false})
}