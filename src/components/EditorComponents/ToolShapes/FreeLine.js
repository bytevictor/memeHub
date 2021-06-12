import {Line} from 'react-konva'

export function handleFreeLineMouseDown(e){
    let pos = this.stageRef.current.getPointerPosition()

    //get the bottomToolbar that is rendered
    let bottomToolbar = this.bottomToolbarRef.current.bottomToolbarRef.current

    let new_line = <Line
                    key={this.state.itemArray.length}
                    ref={this.lineRef}

                    lineCap={"round"}

                    stroke={'#'+bottomToolbar.state.strokeColor.hex}
                    strokeWidth={bottomToolbar.state.strokeWidth}
                    
                    globalCompositeOperation={'source-over'}
                    points={[pos.x, pos.y]}

                    shadowColor={'#'+bottomToolbar.state.shadowColor.hex}
                    shadowBlur={bottomToolbar.state.shadowWidth}

                    dash={bottomToolbar.state.dashValue}

                    draggable
                   />

    this.state.itemArray.push(new_line)

    this.setState({isDrawing: true})
}

export function handleFreeLineMouseMove(e){
    if( this.state.isDrawing ){
        let lastLine = this.lineRef.current
        let pos = this.stageRef.current.getPointerPosition()
        let newLinePoints = lastLine.points().concat([pos.x, pos.y])
        lastLine.points(newLinePoints)
        //redraw the changed line
        this.stageRef.current.batchDraw()
    }
}

export function handleFreeLineMouseUp(e){
    this.setState({isDrawing: false})
}