import React, { createRef } from 'react';

import DragandDrop from './EditorComponents/DragandDrop';

import '../assets/css/editor.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Toolbar from './EditorComponents/Toolbar';
import { ThemeProvider } from 'styled-components';

//shapes
import cvRectangle from './EditorComponents/ToolShapes/rectangle'
import { Button } from '@material-ui/core';


class Editor extends React.Component{
    constructor(props){
        super(props);

        this.canvasRef = createRef();
        this.contextRef = createRef();

        this.state = {
            imageData: null,
            shapeArray: [],

            isDrawing: false,
            startOffsetX: null,
            startOffsetY: null,
        }
    }

    componentDidMount(){
        //context from canvas
        let context = this.canvasRef.current.getContext("2d");
        //assing context to reference to use it later
        this.contextRef.current = context;
    }

    imageLoader(data){
        this.setState({imageData: data});
    }

    imageUnloader(){
        this.setState({imageData: null})

        let canvas = this.canvasRef.current
        let canvas_context = this.contextRef.current

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
        let context = this.contextRef.current;

        if(this.state.isDrawing){
            let rect = this.state.shapeArray[this.state.shapeArray.length - 1]

            rect.update(nativeEvent.offsetX - rect.startX ,
                        nativeEvent.offsetY - rect.startY )

                
            this.repaint()
        }
    }

    endRectangleDraw({nativeEvent}){
        this.state.isDrawing = false
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
                    ( this.state.imageData == null ) ?
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> : null
                    }
                    
                    <canvas id='canvas' width='0' height='0'
                        ref={this.canvasRef}
                        onMouseDown={this.startRectangleDraw.bind(this)}
                        onMouseMove={this.movingRectangleDraw.bind(this)}
                        onMouseUp={this.endRectangleDraw.bind(this)}
                    />

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
