import React, { createRef } from 'react'

import DragandDrop from './EditorComponents/DragandDrop'

import '../assets/css/editor.css'
import DeleteIcon from '@material-ui/icons/Delete'

import Toolbar from './EditorComponents/Toolbar'
import { Stage, Layer, Rect, Image as KonvaImage, Image, Transformer} from 'react-konva'
//shapes
import cvRectangle from './EditorComponents/ToolShapes/rectangle'
import CvText from './EditorComponents/canvas_text'


class Editor extends React.Component{
    constructor(props){
        super(props)

        this.stageRef = createRef()
        this.mainLayerRef = createRef()
        this.kvMainImageRef = createRef()
        this.transformerRef = createRef()

        this.state = {
            image: null,
            itemArray: [],

            isDrawing: false,
            startOffsetX: null,
            startOffsetY: null,
        }
    }

    componentDidMount(){

    }

    calculate_resize(correlation, width, height){
        //wide photo
        if( correlation <= 1 ){
            //image too small, dont correct
            width = (width > 400 ? width - 100 : width)
            //
            if( correlation * width < height ){
                height = (correlation * width) - 100
                width = width - 100
            } else {
                width = height * (1/correlation) - 100
                height = height - 100
            }

        //long photo
        } else {
            //image too small
            height = (height > 400 ? height - 100 : height)
            //
            if( height * (1/correlation) < width ){
                width = height * (1/correlation)
                //height = height
            } else {
                width = width - 100
                height = correlation * width - 100
            }
        }

        return {
            width: width,
            height: height
        }
    }

    imageLoader(image){

        this.setState({image: image});

        //For scaling the image to the canvas width
        //
        let correlation = image.height / image.width;
        console.log("correlation: " + correlation);

        let canvas_container = document.getElementById('canvas-container');
        console.log("width:" + canvas_container.clientWidth + " height: " + canvas_container.clientHeight)

        let width = canvas_container.clientWidth
        let height = canvas_container.clientHeight

        let size = this.calculate_resize(correlation, width, height)

        this.kvMainImageRef.current.setAttrs({
            image: image,
            width: size.width,
            height: size.height,
            x: 0,
            y: 0
        })

        this.stageRef.current.setAttrs({
            width: size.width,
            height: size.height
        })
    }

    imageUnloader(){
        this.setState({image: null})
        this.setState({shapeArray: []})

        let canvas_stage = this.stageRef.current

        canvas_stage.clear()
        canvas_stage.setAttrs({
            width: 0,
            height: 0
        }) 
    }

    createNewText(e){
        //if the background image is clicked
        if( e.target.className == "Image" ){
            let new_text = <CvText
                              stage={this.stageRef}
                              text='sample text'
                              x={e.evt.offsetX}
                              y={e.evt.offsetY}
                              fontFamily={'Impact'}
                              fontSize={70}
                              fill={'white'}
                              stroke={'black'}
                              strokeWidth={2}

                              draggable
                           />
            this.state.itemArray.push(new_text)
            //push doesn't update the state
            this.forceUpdate()
        }
    }

    //when canvas is clicked, select the item that is clicked,
    //or deselect if no item is clicked
    handleCanvasClick(e){
        let transformer = this.transformerRef.current

        if( e.target.className !== "Image" ){
            transformer.nodes([e.target])
        } else {
            transformer.nodes([])
        }
    }

    render(){
        return( 
            <div className='editor'>
                <div className='d-flex justify-content-center align-items-center' id='canvas-container'>

                    {//If there is no image, show draganddrop input
                    ( this.state.image == null ) ?
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> : null
                    }
                    
                    <Stage 
                      width={0} 
                      height={0} 
                      ref={this.stageRef}
                    >
                        <Layer
                          ref={this.mainLayerRef}
                          onClick={this.handleCanvasClick.bind(this)}
                          onDblClick={this.createNewText.bind(this)}
                        >
                            <KonvaImage
                            //Main image
                                ref={this.kvMainImageRef}
                                x={500}
                                y={500}>
                            </KonvaImage>

                            {this.state.itemArray.map(item => (
                                item
                            ))
                            }
                            <Transformer
                                ref={this.transformerRef}
                                rotateEnabled={true}
                                keepRatio={false}
                            />
                        </Layer>
                    </Stage>

                </div>
                <nav id="sidetoolbar" className="d-flex flex-column p-0">
                    
                    <button type='button' className='btn btn-danger my-1'
                        onClick={this.imageUnloader.bind(this)} 
                        variant="contained"
                        color="secondary"
                        disabled={ (this.state.image == null) ? true : false }
                    >
                        <DeleteIcon/>
                    </button>

                    <Toolbar></Toolbar>

                </nav>
                <div className='bottomtoolbar'>
                    more options over here
                </div>
            </div>
        );
    }

}

export default Editor;
