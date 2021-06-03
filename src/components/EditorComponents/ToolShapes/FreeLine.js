import {Line} from 'react-konva'

export function handleFreeLineMouseDown(e){
    //if( pincel seleccionado )
    console.log("EMPESAMOS A PINTAR")

    let pos = this.stageRef.current.getPointerPosition()
    let new_line = <Line
                    key={this.state.itemArray.length}
                    ref={this.lineRef}
                    stroke={'#df4b26'}
                    strokeWidth={5}
                    globalCompositeOperation={'source-over'}
                    points={[pos.x, pos.y]}

                    draggable
                   />

    this.state.itemArray.push(new_line)

    this.setState({isDrawing: true})
}

export function handleFreeLineMouseMove(e){
    if( this.state.isDrawing ){
        console.log("dibujando linea")
        let lastLine = this.lineRef.current
        let pos = this.stageRef.current.getPointerPosition()
        let newLinePoints = lastLine.points().concat([pos.x, pos.y])
        lastLine.points(newLinePoints)
        //redraw the changed line
        this.stageRef.current.batchDraw()
    }
}

export function handleFreeLineMouseUp(e){
    //if( pincel seleccionado )
    console.log("PAREAMOS DE  PINTAR")
    this.setState({isDrawing: false})
}