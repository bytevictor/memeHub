import React, {useState, useEffect} from 'react'

import '../../assets/css/draganddrop.css'
import {validateFile} from '../Helpers/FileHelpers'

const containerdragOver = (e) => {
    e.preventDefault()
}

const containerdragEnter = (e) => {
    e.preventDefault();
    e.target.classList.toggle('shake')
}

const containerdragLeave = (e) => {
    e.preventDefault();
    e.target.classList.toggle('shake')
}

export default function SecondaryDragandDrop(props) {

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [,updateState] = useState()

    let imgLoader = props.imgLoader

    let lastTarget = null

    useEffect(() => {
        let canvas_container = document.getElementById('canvas-container')
        let canvas = canvas_container.childNodes[2].firstChild.firstChild

        setWidth(canvas.clientWidth)
        setHeight(canvas.clientHeight)

        window.addEventListener('dragenter', dragEnter)
        window.addEventListener('dragleave', dragLeave)

        //when UnMounts
        return () => {
            window.removeEventListener('dragenter', dragEnter)
            window.removeEventListener('dragleave', dragLeave)
        }
    })
    
    const dragEnter = (e) => {
        e.preventDefault();
        
        updateState(1)
        
        lastTarget = e.target
        document.querySelector('#secondarydropbackground').style.visibility = ""
        document.querySelector('#secondarydropbackground').style.opacity = "0.8"
        document.querySelector('#secondarydropcontainer').style.visibility = ""
        document.querySelector('#secondarydropcontainer').style.opacity = "1"
    }
    
    const dragLeave = (e) => {
        e.preventDefault();

        if( e.target === lastTarget){
            hideDropzone()
        }
    }

    const hideDropzone = () => {
        document.querySelector('#secondarydropbackground').style.visibility = "hidden"
        document.querySelector('#secondarydropbackground').style.opacity = "0"
        document.querySelector('#secondarydropcontainer').style.visibility = "hidden"
        document.querySelector('#secondarydropcontainer').style.opacity = "0"
    }

    const fileDrop = (e) => {
        e.preventDefault()
        hideDropzone()
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
                        imgLoader(null, image)
                    }
                    
                }
            //File not valid
            } else {
        
            }
        }
    }

    return(
        <React.Fragment>
        <div id="secondarydropbackground"
                style={{visibility: 'hidden'}}
        ></div>
        <div className="drop-container"
            style={{width: width + 'px',
                    height: height + 'px',
                    visibility: 'hidden'}}
            id="secondarydropcontainer"
            onDragOver={containerdragOver}
            onDragEnter={containerdragEnter}
            onDragLeave={containerdragLeave}
            onDrop={fileDrop}
        >
                <div className="drop-message d-flex flex-column justify-content-center">
                    <div className="upload-icon m-4 align-self-center"></div>
                    <span className="w-100">Drop an image to add it to the canvas</span>
                </div>
            </div>
        </React.Fragment> 
    )
}