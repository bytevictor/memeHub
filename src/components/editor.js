import React from 'react';

import '../assets/css/editor.css';


class Editor extends React.Component{

    render(){
        return(
            <div className='editor'>
                <div className='canvas'>
                    
                </div>
                <nav id="sidetoolbar">
                    <ul class="list-unstyled components mb-5">
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
                <div className='bottomtoolbar'></div>
            </div>
        );
    }

}

export default Editor;
