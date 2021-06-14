import {Line} from 'react-konva'

export function handleStraightLineMouseDown(e){
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
                    points={[pos.x, pos.y, pos.x, pos.y]}

                    shadowColor={'#'+bottomToolbar.state.shadowColor.hex}
                    shadowBlur={bottomToolbar.state.shadowWidth}

                    dash={bottomToolbar.state.dashValue}

                    draggable
                   />

    this.state.itemArray.push(new_line)

    this.setState({isDrawing: true})
}

export function handleStraightLineMouseMove(e){
    if( this.state.isDrawing ){
        let lastLine = this.lineRef.current
        let pos = this.stageRef.current.getPointerPosition()

        let newLinePoints = lastLine.points()

        newLinePoints[2] = pos.x
        newLinePoints[3] = pos.y

        lastLine.points(newLinePoints)

        //redraw the changed line
        this.stageRef.current.batchDraw()
    }
}

export function handleStraightLineMouseUp(e){
    this.setState({isDrawing: false})
}