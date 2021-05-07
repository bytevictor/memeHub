
import React, {useEffect, useState, createRef} from 'react';
import {Text, Transformer} from 'react-konva'

function CvText(props) {

    const transRef = createRef()
    const textRef = createRef()

    const [selected, setSelected] = useState(false)
    const select = () => {
        setSelected(true)
        
    }
    const deselect = () => {setSelected(false)}

    useEffect(() => {
        //show transformer if selected
        if(selected){
            transRef.current.nodes([textRef.current])
        }
        //
    })

    const editText = () => {
        let text = textRef.current

        console.log(text.getAbsolutePosition())

        let editarea = document.createElement('textarea')
        document.body.appendChild(editarea)

        //Area should look like the konva text
        editarea.value = text.text
        editarea.style.position = 'absolute'
        editarea.style.top = text.x + 'px'
        editarea.style.left = text.x + 'px'
        editarea.focus()

        editarea.addEventListener('focusout', (e) => {
            text.text = editarea.value
            document.body.removeChild(editarea)
        } )

        console.log(editarea)
    }

    return(
      <React.Fragment>
        <Text
            ref={textRef}
            x={100}
            y={100}
            text={props.text}
            fontSize={props.fontSize}
            fontFamily={props.fontFamily}
            draggable={props.draggable}

            onClick={select}

            onDblClick={editText}
            onDblTap={editText}
        />
        { selected ? 
            <Transformer
                ref={transRef}
                rotateEnabled={true}
                keepRatio={false}
            /> : null
         }
      </React.Fragment>
    );
}

export default CvText