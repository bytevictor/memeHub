import React, { createRef } from 'react';

import DragandDrop from './DragandDrop';

import '../assets/css/editor.css';
import mante from '../assets/img/mante.jpeg';


class Editor extends React.Component{
    constructor(props){
        super(props);

        this.canvasRef = createRef();
        this.contextRef = createRef();

        this.state = {
            imageData: null,
            isDrawing: false
        }
    }

    componentDidMount(){
        //context from canvas
        let context = this.canvasRef.current.getContext("2d");
        
        //settings for the stroke
        context.lineWidth = 4;
        context.lineCap = "round";
        context.strokeStyle = "black";

        //assing context to reference to use it later
        this.contextRef.current = context;
    }

    imageLoader(data){
        this.setState({imageData: data});
    }

    imageUnloader(){
        this.setState({imageData: null})

        let canvas = document.getElementById('canvas');
        let canvas_context = canvas.getContext("2d");

        canvas_context.putImageData(canvas_context.createImageData(canvas.width,canvas.height), 0, 0);
        canvas.width = 0;
        canvas.height = 0;
    }

    startDraw({nativeEvent}){
        let context = this.contextRef.current;

        this.setState({isDrawing: true});

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
                        onMouseDown={this.startDraw.bind(this)}
                        onMouseUp={this.endDraw.bind(this)}
                        onMouseMove={this.movingDraw.bind(this)}
                    />

                </div>
                <nav id="sidetoolbar">
                    <ul className="list-unstyled components mb-5">
                        <li>
                            <a href="#">Action 1</a>
                        </li>
                        <li>
                            <a href="#">Action 2</a>
                        </li>
                        <li>
                            <a href="#">Action 3</a>
                        </li>
                        <li>
                            <a href="#">Action 4</a>
                        </li>
                        <li>
                            <a href="#">Action 5</a>
                        </li>
                    </ul>
                </nav>
                <div className='bottomtoolbar'>
                    more options over here
                </div>
            </div>
        );
    }

}

export default Editor;
