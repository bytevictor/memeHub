import React from 'react';

import '../../assets/css/draganddrop.css';

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

//* FILE MANIPULATION */

const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }
    return true;
}

//

class DragandDrop extends React.Component{
    
    constructor(props){
        super(props);

        this.imgLoader = props.imgLoader.bind(this);
    }

    fileDrop(e) {
        e.preventDefault();
        e.target.classList.toggle('shake');
        const files = e.dataTransfer.files;

        if (files.length) {
            //Nos quedamos solo con el primer archivo
            //Cambiar por un for si queremos tratar con multiselecciones
            if (validateFile(files[0])) {

                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = (e) => {

                    //Create image from load
                    let image = new Image();
                    image.src = e.target.result;

                    image.onload = () => {
                        //send image to editor
                        this.imgLoader(image);
                    }
                    
                }
            //File not valid
            } else {
        
            }
        }
    }

    render(){
        return(
            <div className="drop-container "
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={this.fileDrop.bind(this)}
            >
                <div className="drop-message">
                    <div className="upload-icon"></div>
                    Drag & Drop to start editing!
                </div>
            </div>
        );
    }

}

export default DragandDrop;