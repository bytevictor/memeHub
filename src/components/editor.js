import React from 'react';

import DragandDrop from './DragandDrop';

import '../assets/css/editor.css';
import mante from '../assets/img/mante.jpeg';


class Editor extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            imageData: null
        }
    }

    imageLoader(data){
        this.setState({imageData: data});
    }

    render(){
        return( 
            <div className='editor'>
                <div className='d-flex justify-content-center align-items-center' id='canvas-container'>

                    {//If there is no image, show draganddrop input
                    ( this.state.imageData == null ) ?
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> : null
                    }
                    
                    <canvas id='canvas' width='0' height='0'></canvas>

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
