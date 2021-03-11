import React from 'react';

import '../assets/css/draganddrop.css';

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

const handleFiles = (files) => {
    //Nos quedamos solo con el primer archivo
    //Cambiar por un for si queremos tratar con multiselecciones
    if (validateFile(files[0])) {
        
    } else {

    }
}

const fileDrop = (e) => {
    e.preventDefault();
    e.target.classList.toggle('shake');
    const files = e.dataTransfer.files;
    if (files.length) {
        handleFiles(files);
    }
}

//

class DragandDrop extends React.Component{
    render(){
        return(
            <div className="container">
                <div className="drop-container"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                >
                    <div className="drop-message">
                        <div className="upload-icon"></div>
                        Drag & Drop to start memeing!
                    </div>
                </div>
            </div>
        );
    }

}

export default DragandDrop;