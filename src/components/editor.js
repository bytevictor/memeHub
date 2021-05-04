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

        this.canvasRef = createRef()
        this.contextRef = createRef()

        this.state = {
            image: null,
            shapeArray: [],

            isDrawing: false,
            startOffsetX: null,
            startOffsetY: null,
        }

        //
        this.stageRef = createRef()
        this.layerRef = createRef()
        this.kvImageRef = createRef()

        this.shapeRef = createRef()
        this.trRef = createRef()
        this.textRef = createRef()
        //
    }

    componentDidMount(){
        //context from canvas
        let context = this.canvasRef.current.getContext("2d");
        //assing context to reference to use it later
        this.contextRef.current = context;
        
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

        this.kvImageRef.current.setAttrs({
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

        let canvas = this.canvasRef.current
        let canvas_context = this.contextRef.current

        this.setState({shapeArray: []})

        canvas_context.putImageData(canvas_context.createImageData(canvas.width,canvas.height), 0, 0)
        canvas.width = 0;
        canvas.height = 0;
    }

    repaint(){
        let canvas = this.canvasRef.current
        let canvas_context = this.contextRef.current

        //clear the whole canvas
        canvas_context.clearRect(0,0, canvas.width, canvas.height)

        let image = new Image()
        image.src = this.state.imageData

        canvas_context.drawImage(image, 0,0, image.width,  image.height,
                                        0,0, canvas.width, canvas.height)

        this.state.shapeArray.forEach(element => {
            element.draw()
        });

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
                        <Layer ref={this.layerRef}>
                            <KonvaImage
                                ref={this.kvImageRef}
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
                        disabled={ (this.state.imageData == null) ? true : false }
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
