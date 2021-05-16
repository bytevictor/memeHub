
import React, {createRef, useEffect} from 'react';
import {Text} from 'react-konva'

function CvText(props) {
    //To get the bounds
    const stageRef = props.stage
    //To introduce the text inside on creation
    const transformerRef = props.transformer
    const textRef = createRef()

    //On creation, spawn the editor
    useEffect(() => {
        //Select the item
        transformerRef.current.nodes([textRef.current])
        //Spawn the editor
        editText()
    }, [])

    //by default the transformer only changes the scale
    //in this case we don't want the text to reescale so this method
    //recalculates width and resets scale to change the real width
    //so the text doesn't get distorted
    const scaleReset = () => {
        let text = textRef.current

        text.setAttrs({
            width: text.width() * text.scaleX(),
            scaleX: 1,
            height: text.height() * text.scaleY(),
            scaleY: 1
        })
    }

    const editText = () => {
        let text = textRef.current

        let editarea = document.createElement('textarea')
        document.body.appendChild(editarea)

        //Making editarea look like the konva text
        let stageBox = stageRef.current.container().getBoundingClientRect();
        editarea.value = text.getAttr('text')
        editarea.style.textAlign = text.align()
        editarea.style.position = 'absolute'
        let abs_pos = text.getAbsolutePosition()
        editarea.style.top  = (stageBox.top + abs_pos.y) + 'px'
        editarea.style.left = (stageBox.left  + abs_pos.x) + 'px'
        editarea.style.width = text.width() + 'px'
        editarea.style.height = text.height() + 'px'
        editarea.style.fontSize = text.fontSize() + 'px'
        editarea.style.color = text.fill()

        editarea.style.webkitTextStroke = text.stroke()
        editarea.style.webkitTextStrokeWidth = text.strokeWidth() + 'px'

        editarea.style.margin = '0px'
        editarea.style.padding = '0px'
        editarea.style.lineHeight = text.lineHeight()
        editarea.style.resize = 'none'
        editarea.style.background = 'none'
        editarea.style.border = 'none'
        editarea.style.outline = 'none'
        editarea.style.resize = 'none'
        editarea.style.lineHeight = text.lineHeight()
        editarea.style.fontFamily = text.fontFamily()
        editarea.style.transformOrigin = 'left top'
        let rotation = text.rotation()
        let rot_transformation = ''
        if( rotation ){ rot_transformation += 'rotateZ('+rotation+'deg)'}
        editarea.style.transform = rot_transformation

        //Hide original text set focus on the editable area
        text.hide()
        editarea.focus()
        editarea.setSelectionRange(0, editarea.value.length)
        stageRef.current.batchDraw()

        editarea.addEventListener('focusout', (e) => {
            //apply changes, show text again(repaint), delete textarea
            text.setAttrs({text: editarea.value})
            text.show()
            stageRef.current.batchDraw()
            document.body.removeChild(editarea)
        } )
    }


    return (
        <Text
            ref={textRef}
            x={props.x}
            y={props.y}
            width={ props.fontSize * 6 }
            height={ props.fontSize * 1 }
            text={props.text}
            
            align={props.align}
            fontSize={props.fontSize}
            fontFamily={props.fontFamily}
            fill={props.fill}
            stroke={props.stroke}
            strokeWidth={props.strokeWidth}

            draggable={props.draggable}

            onTransform={scaleReset}

            onDblClick={editText}
            onDblTap={editText}
        />
    )
}

export default CvText