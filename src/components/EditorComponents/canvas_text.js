
import React, {useEffect, useState, createRef} from 'react';
import {Stage, Text, Transformer} from 'react-konva'

function CvText(props) {

    const stageRef = props.stage
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

        let editarea = document.createElement('textarea')
        document.body.appendChild(editarea)

        //Making editarea look like the konva text
        var stageBox = stageRef.current.container().getBoundingClientRect();
        editarea.value = text.getAttr('text')
        editarea.style.position = 'absolute'
        let abs_pos = text.getAbsolutePosition()
        console.log(abs_pos)
        console.log(stageBox)
        editarea.style.top  = (stageBox.top + abs_pos.y) + 'px'
        editarea.style.left = (stageBox.left  + abs_pos.x) + 'px'
        console.log(editarea.style.top)
        editarea.focus()

        editarea.addEventListener('focusout', (e) => {
            text.setAttrs({text: editarea.value})
            document.body.removeChild(editarea)
        } )
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