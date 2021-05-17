import React, { createRef, fordwardRef } from 'react'

import DragandDrop from './EditorComponents/DragandDrop'

import '../assets/css/editor.css'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';
import Button from '@material-ui/core/Button';
//Icons
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save';

import Toolbar from './EditorComponents/Toolbar'
import BottomToolbar from './EditorComponents/BottomToolbar'
import { Stage, Layer, Rect, Image as KonvaImage, Image, Transformer} from 'react-konva'
//canvas items
import CvText from './EditorComponents/canvas_text'
import {validateFile} from './EditorComponents/DragandDrop'


//Colors for the Mui
const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: purple,
    },
});

class Editor extends React.Component{
    constructor(props){
        super(props)

        this.stageRef = createRef()
        this.mainLayerRef = createRef()
        this.kvMainImageRef = createRef()
        this.transformerRef = createRef()
        this.bottomToolbarRef = createRef()

        this.state = {
            image: null,
            itemArray: [],

            isDrawing: false,
            startOffsetX: null,
            startOffsetY: null,
        }
    }

    componentDidMount(){
        //ctrl + v event
        document.body.addEventListener('paste', this.handlePaste.bind(this))
        
        //make stage focusable
        this.stageRef.current.container().tabIndex = 1
        //delete event for the canvas items when stage onfocus
        this.stageRef.current.container().addEventListener('keydown', this.handleDelete.bind(this))
    }

    //This should be called instead of transformer.nodes([])
    //To change the selected item and syncronize the Toolbar 
    //with the new item props at the same time
    changeSelectedItem( nodes ){
        this.transformerRef.current.nodes(nodes)

        let bottomToolbar = this.bottomToolbarRef.current
        if( nodes[0] != null){
            let nodeattrs = nodes[0].getAttrs()

            bottomToolbar.updateToolbar( nodeattrs.align,
                                         nodeattrs.fontFamily,
                                         nodeattrs.fontSize,
                                         nodeattrs.fill,
                                         nodeattrs.stroke,
                                         nodeattrs.strokeWidth )
        }
        
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

    handlePaste(e){
        console.log(e)
        
        let pasted_file = e.clipboardData.files[0]

        console.log( pasted_file )

        if( this.state.image == null 
            && pasted_file != null 
            && validateFile(pasted_file)){

            const reader = new FileReader();
            reader.readAsDataURL(pasted_file);
            reader.onload = (e) => {
                //Create image from load
                let image = new window.Image();
                image.src = e.target.result;

                image.onload = () => {
                    //send image to editor
                    this.imageLoader(image)
                }
            }
        }
    }

    imageUnloader(){
        this.setState({image: null})
        this.setState({itemArray: []})

        this.changeSelectedItem([])

        let canvas_stage = this.stageRef.current

        canvas_stage.clear()
        canvas_stage.setAttrs({
            width: 0,
            height: 0
        }) 
    }

    imageDownloader(){
        //Unselect any item (the transform box would be printed otherwise)
        this.changeSelectedItem([])
        //pixel ratio 1,same resolution as screen
        let data = this.stageRef.current.toDataURL({pixelRatio: 1})
        let download_link = document.createElement('a')
        download_link.download = 'edit_memehub'
        download_link.href = data
        download_link.click()
    }

    deleteSelectedItem(){
        let transformer = this.transformerRef.current

        //transformer onScreen & something is selected
        if(transformer != null && transformer.nodes()[0] != null){
            transformer.nodes()[0].destroy()
            this.changeSelectedItem([])
            this.stageRef.current.batchDraw()
        }
    }

    handleDelete(e){
        //delete and backspace
        if ( e.keyCode === 8 || e.keyCode === 46 ) {
            console.log("Stage delete event, Key: " + e.keyCode)
            this.deleteSelectedItem()
          }
    }

    createNewText(e){
        //if the background image is clicked
        if( e.target.className == "Image" ){
            let new_text = <CvText
                              key={this.state.itemArray.length}
                              stage={this.stageRef}
                              selectedItemChanger={this.changeSelectedItem.bind(this)}
                              text='sample text'
                              //fontsize * 3 is the half of the width
                              //so it spawns on the center
                              x={e.evt.offsetX - 70 * 3}
                              y={e.evt.offsetY - 35}
                              align={'center'}
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
    handleCanvasMouseDown(e){
        let transformer = this.transformerRef.current

        //Ignores event if we are transforming 
        if( !transformer.isTransforming() ){
            if( e.target.className !== "Image" ){
                this.changeSelectedItem([e.target])

                let bottomtoolbar = this.bottomToolbarRef.current
                let text = e.target.getAttrs()
                /*let textAlign       = text.getAttr('align')
                let textFont        = text.getAttr('fontFamily')
                let textSize        = text.getAttr('fontSize')
                let textColor       = text.getAttr('fill')
                let textStrokeColor = text.getAttr('stroke')
                let textStrokeWidth = text.getAttr('strokeWidth')*/

                bottomtoolbar.updateToolbar( text.align,
                                             text.fontFamily,
                                             text.fontSize,
                                             text.fill,
                                             text.stroke,
                                             text.strokeWidth )

            } else {
                this.changeSelectedItem([])
            }
        }
    }

    updateTextSize( newSize ){
        let text = this.transformerRef.current.nodes()[0]
        
        if(text != null && parseInt(newSize) > 0){
            text.setAttr('fontSize', parseInt(newSize))
            text.getStage().batchDraw()
        }
    }

    updateTextColor( newColor ){
        let text = this.transformerRef.current.nodes()[0]

        if(text != null){
            text.setAttr('fill', '#' + newColor.hex)
            text.getStage().batchDraw()
        }
    }

    updateStrokeColor( newColor ){
        let text = this.transformerRef.current.nodes()[0]

        if(text != null){
            text.setAttr('stroke', '#' + newColor.hex)
            text.getStage().batchDraw()
        }
    }

    updateStrokeSize( newSize ){
        let text = this.transformerRef.current.nodes()[0]

        if(text != null){
            text.setAttr('strokeWidth', newSize)
            text.getStage().batchDraw()
        }
    }

    updateFontFamily( newFont ){
        let text = this.transformerRef.current.nodes()[0]

        if(text != null){
            console.log(newFont)
            text.setAttr('fontFamily', newFont)
            text.getStage().batchDraw()
        }
    }

    updateFontAlignment( newAlignment ){
        let text = this.transformerRef.current.nodes()[0]

        if(text != null){
            console.log( newAlignment )
            text.setAttr('align', newAlignment)
            text.getStage().batchDraw()
        }
    }

    render(){
        return( 
            <ThemeProvider theme={theme}>
            <div className='editor d-flex flex-column'>
                <div className='d-flex flex-fill'>
                <div id='canvas-container' className='d-flex justify-content-center align-items-center w-100' >

                    {//If there is no image, show draganddrop input
                    ( this.state.image == null ) ?
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> : null
                    }
                    
                    <Stage 
                      width={0} 
                      height={0} 
                      ref={this.stageRef}
                      style={{outline: 'none'}}
                    >
                        <Layer
                          ref={this.mainLayerRef}
                          onMouseDown={this.handleCanvasMouseDown.bind(this)}
                          onDblClick={this.createNewText.bind(this)}
                        >
                            <KonvaImage
                            //Main image
                                ref={this.kvMainImageRef}
                                x={500}
                                y={500}>
                            </KonvaImage>

                            { //Renders all items into the canvas
                            this.state.itemArray.map(item => (
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
                <nav id="sidetoolbar" className="d-flex flex-column p-0 justify-content-between">
                    <div className="d-flex flex-column">
                    <button type='button' id="deletemainbutton" className='btn btn-danger'
                        style={{width: "50px", height: "45px"}}
                        onClick={this.imageUnloader.bind(this)} 
                        variant="contained"
                        color="secondary"
                        disabled={ (this.state.image == null) ? true : false }
                    >
                        <DeleteIcon/>
                    </button>

                    <Toolbar></Toolbar>
                    </div>
                    
                    <Button id="downloadbutton"
                            className="ml-auto p-0 my-0" 
                            color="primary"
                            size='medium'
                            variant={ (this.state.image == null) ? "outlined" : "contained" }
                            disabled={ (this.state.image == null) ? true : false }
                            onClick={this.imageDownloader.bind(this)}
                            >
                        <SaveIcon/>
                    </Button>
                </nav>
                </div>

                <BottomToolbar 
                    ref={this.bottomToolbarRef}
                    fontSizeUpdater={this.updateTextSize.bind(this)}
                    fontColorUpdater={this.updateTextColor.bind(this)}
                    strokeColorUpdater={this.updateStrokeColor.bind(this)}
                    strokeSizeUpdater={this.updateStrokeSize.bind(this)}
                    fontFamilyUpdater={this.updateFontFamily.bind(this)}
                    alignmentUpdater={this.updateFontAlignment.bind(this)}
                />

            </div>
            </ThemeProvider>
        );
    }

}

export default Editor;
