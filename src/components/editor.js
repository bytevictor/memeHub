import React, { createRef } from 'react'

import DragandDrop from './EditorComponents/DragandDrop'

import '../assets/css/editor.css'
import DeleteIcon from '@material-ui/icons/Delete'

import Toolbar from './EditorComponents/Toolbar'
import { Stage, Layer, Transformer, Text, Rect, Image as KonvaImage} from 'react-konva'
//shapes
import cvRectangle from './EditorComponents/ToolShapes/rectangle'


class Editor extends React.Component{
    constructor(props){
        super(props)

        this.stageRef = createRef()
        this.mainLayerRef = createRef()
        this.kvMainImageRef = createRef()

        this.state = {
            image: null,
            shapeArray: [],

            isDrawing: false,
            startOffsetX: null,
            startOffsetY: null,
        }

        //
        this.shapeRef = createRef()
        this.trRef = createRef()
        this.textRef = createRef()
        //
    }

    componentDidMount(){
        //
        this.trRef.current.nodes([this.textRef.current]);
        this.trRef.current.getLayer().batchDraw();
        //
    }

    imageLoader(image){

        this.setState({image: image});

        //For scaling the image to the canvas width
        //
        let correlation = image.height / image.width;
        console.log("correlation: " + correlation);

        let canvas_container = document.getElementById('canvas-container');
        console.log("width:" + canvas_container.clientWidth + " height: " + canvas_container.clientHeight)

        let width = canvas_container.clientWidth
        let height = canvas_container.clientHeight

        //wide photo
        if( correlation <= 1 ){
            //image too small, dont correct
            width = (width > 400 ? width - 100 : width)
            //
            if( correlation * width < height ){
                height = (correlation * width) - 100
                width = width - 100
            } else {
                width = height * (1/correlation) - 100
                height = height - 100
            }

        //long photo
        } else {
            //image too small
            height = (height > 400 ? height - 100 : height)
            //
            if( height * (1/correlation) < width ){
                width = height * (1/correlation)
                //height = height
            } else {
                width = width - 100
                height = correlation * width - 100
            }
        }
        //
        //

        console.log("canvas width: "+width+" canvas heigth: "+height)

        this.kvMainImageRef.current.setAttrs({
            image: image,
            width: width,
            height: height,
            x: 0,
            y: 0
        })

        this.stageRef.current.setAttrs({
            width: width,
            height: height
        })
        
    }

    imageUnloader(){
        this.setState({image: null})
        this.setState({shapeArray: []})

        let canvas_stage = this.stageRef.current

        canvas_stage.clear()
        canvas_stage.setAttrs({
            width: 0,
            height: 0
        }) 
        
    }

    //Square drawing events
    //
    startRectangleDraw({nativeEvent}){
        let context = this.contextRef.current;

        this.setState({isDrawing: true});

        //settings for the stroke
        context.lineWidth = 5;
        context.lineCap = "round";
        context.strokeStyle = "red";

        let rect = new cvRectangle(context, nativeEvent.offsetX, nativeEvent.offsetY,0,0)

        this.state.shapeArray.push(rect)
    }

    movingRectangleDraw({nativeEvent}){

        if(this.state.isDrawing){
            let rect = this.state.shapeArray[this.state.shapeArray.length - 1]

            rect.update(rect.startX,rect.startY, 
                        nativeEvent.offsetX - rect.startX ,
                        nativeEvent.offsetY - rect.startY )

                
            this.repaint()
        }
    }

    endRectangleDraw({nativeEvent}){
        this.setState({isDrawing: false})
    }
    //


    //Free drawing events
    //
    startDraw({nativeEvent}){
        let context = this.contextRef.current;

        this.setState({isDrawing: true});

        //settings for the stroke
        context.lineWidth = 5;
        context.lineCap = "round";
        context.strokeStyle = "red";

        //start path on click
        context.beginPath();
        context.moveTo(nativeEvent.offsetX, nativeEvent.offsetY);
    }

    endDraw(){
        let context = this.contextRef.current;

        this.setState({isDrawing: false});

        context.closePath();
    }

    movingDraw({nativeEvent}){
        let context = this.contextRef.current;

        if(this.state.isDrawing){

            context.lineTo(nativeEvent.offsetX, nativeEvent.offsetY);
            context.stroke();
        }
    }
    //


    render(){
        return( 
            <div className='editor'>
                <div className='d-flex justify-content-center align-items-center' id='canvas-container'>

                    {//If there is no image, show draganddrop input
                    ( this.state.image == null ) ?
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> : null
                    }
                    
                    <canvas id='canvas' width='0' height='0'
                        ref={this.canvasRef}
                        onMouseDown={this.startRectangleDraw.bind(this)}
                        onMouseMove={this.movingRectangleDraw.bind(this)}
                        onMouseUp={this.endRectangleDraw.bind(this)}
                    />
                    
                    <Stage width={0} height={0} ref={this.stageRef}>
                        <Layer ref={this.mainLayerRef}>
                            <KonvaImage
                                ref={this.kvMainImageRef}
                                x={500}
                                y={500}>
                            </KonvaImage>
                            <Rect
                                ref={this.shapeRef}
                                width={50}
                                height={50}
                                fill="red"
                                isSelected={true}
                            />
                            <Text
                                ref={this.textRef}
                                x={150}
                                y={150}
                                text='Simple Text'
                                fontSize={30}
                                fontFamily='Calibri'
                                fill='green'
                                onTransformEnd={
                                    (e) => {
                                        let texto = this.textRef.current
                                        console.log(texto)
                                        texto.text("cambio")
                                    }
                                }
                            />
                            <Transformer
                                ref={this.trRef}
                                rotateEnabled={false}
                                keepRatio={false}
                            />

                        </Layer>
                    </Stage>

                </div>
                <nav id="sidetoolbar" className="d-flex flex-column p-0">
                    
                    <button type='button' className='btn btn-danger my-1'
                        onClick={this.imageUnloader.bind(this)} 
                        variant="contained"
                        color="secondary"
                        disabled={ (this.state.image == null) ? true : false }
                    >
                        <DeleteIcon/>
                    </button>

                    <Toolbar></Toolbar>
                    
                </nav>
                <div className='bottomtoolbar'>
                    more options over here
                </div>
            </div>
        );
    }

}

export default Editor;
