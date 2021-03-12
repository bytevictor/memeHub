import React from 'react';

import DragandDrop from './DragandDrop';

import '../assets/css/editor.css';
import mante from '../assets/img/mante.jpeg';


class Editor extends React.Component{
    render(){
        return(
            <div className='editor'>
                <div id='canvas' className='canvas'>
                    CANVAS

                    <DragandDrop/>

                    <img id='canvas-img' src={mante}></img>
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
