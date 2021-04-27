import React, { createRef } from 'react';

import DragandDrop from './EditorComponents/DragandDrop';

import '../assets/css/editor.css';
import mante from '../assets/img/mante.jpeg';

import Toolbar from './EditorComponents/Toolbar';
import { ThemeProvider } from 'styled-components';


class Editor extends React.Component{
    constructor(props){
        super(props);

        this.canvasRef = createRef();
        this.contextRef = createRef();

        this.state = {
            imageData: null,
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

        //start path on click
        context.beginPath();
        
        this.setState({startOffsetX: nativeEvent.offsetX,
                       startOffsetY: nativeEvent.offsetY} )
    }

    movingRectangleDraw({nativeEvent}){
        let context = this.contextRef.current;

        if(this.state.isDrawing){
            this.repaint()

            context.beginPath()

            context.rect(this.state.startOffsetX,this.state.startOffsetY, 
                nativeEvent.offsetX - this.state.startOffsetX ,  nativeEvent.offsetY - this.state.startOffsetY);

            context.stroke()
        }

        context.closePath()
    }

    endRectangleDraw({nativeEvent}){
        let context = this.contextRef.current;

        console.log(nativeEvent)
        console.log()

        context.rect(this.state.startOffsetX,this.state.startOffsetY, 
                     nativeEvent.offsetX - this.state.startOffsetX ,  nativeEvent.offsetY - this.state.startOffsetY);

        context.stroke();

        this.setState({isDrawing: false});

        context.closePath();
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
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> : <button onClick={this.imageUnloader.bind(this)} className='btn btn-danger'>Eliminar</button>
                    }
                    
                    <canvas id='canvas' width='0' height='0'
                        ref={this.canvasRef}
                        onMouseDown={this.startRectangleDraw.bind(this)}
                        onMouseMove={this.movingRectangleDraw.bind(this)}
                        onMouseUp={this.endRectangleDraw.bind(this)}
                    />

                </div>
                <nav id="sidetoolbar">
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
