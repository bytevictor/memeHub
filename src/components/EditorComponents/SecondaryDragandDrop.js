import React from 'react';

import '../../assets/css/draganddrop.css';
import {validateFile} from '../Helpers/FileHelpers'

const dragOver = (e) => {
    e.preventDefault();
}

const dragEnter = (e) => {
    e.preventDefault();
    e.target.classList.toggle('shake');
}

const dragLeave = (e) => {
    e.preventDefault();
    e.target.classList.toggle('shake');
}

export default function SecondaryDragandDrop(props) {
    
    //this.imgLoader = props.imgLoader.bind(this);

    const fileDrop = (e) => {
        e.preventDefault()
        console.log(e)
        e.target.classList.toggle('shake')
        const files = e.dataTransfer.files

        if (files.length) {
            //Nos quedamos solo con el primer archivo
            //Cambiar por un for si queremos tratar con multiselecciones
            if (validateFile(files[0])) {

                const reader = new FileReader()
                reader.readAsDataURL(files[0])
                reader.onload = (e) => {

                    //Create image from load
                    let image = new Image();
                    image.src = e.target.result

                    image.onload = () => {
                        //send image to editor
                        this.imgLoader(image)
                    }
                    
                }
            //File not valid
            } else {
        
            }
        }
    }

    return(
        <div className="drop-container position-fixed"
            id="secondarydropcontainer"
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
        >
            <div className="drop-message d-flex flex-column justify-content-center">
                <div className="upload-icon m-4 align-self-center"></div>
                <span className="w-100">Drop an image to add it to the canvas</span>
            </div>
        </div>
    )
    
}