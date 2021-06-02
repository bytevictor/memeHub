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
import FileCopyIcon from '@material-ui/icons/FileCopy';

import Toolbar from './EditorComponents/Toolbar'
import BottomToolbar from './EditorComponents/BottomToolbar'
import CopytoClipboardButton from './EditorComponents/ToolShapes/CopytoClipboardButton'
import SecondaryDragandDrop from './EditorComponents/SecondaryDragandDrop'
import { Stage, Layer, Rect, Image as KonvaImage, Transformer, Line} from 'react-konva'
import {dataURLtoBlob} from './Helpers/FileHelpers'
//canvas items
import CvText from './EditorComponents/canvas_text'
import {validateFile} from './Helpers/FileHelpers'


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

        this.lineRef = createRef()

        this.state = {
            image: null,
            itemArray: [],

            selectedTool: "",
            isDrawing: false,
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
    //Note: should pass a {type: string, item: object} object
    changeSelectedItem( node ){
        //Nothing selected or incorrect
        if(node.item == null || node.type == null){
            console.log("Deselected")
            this.transformerRef.current.nodes([])
        //Node is correct, select it
        } else {
            console.log("Selecting: " + node.type)
            console.log(node.item)

            this.transformerRef.current.nodes([node.item])

            switch( node.type ){
                case 'CvText':
                    let bottomToolbar = this.bottomToolbarRef.current
                    let nodeattrs = node.item.getAttrs()
    
                    bottomToolbar.updateToolbar( nodeattrs.align,
                                                 nodeattrs.fontFamily,
                                                 nodeattrs.fontSize,
                                                 nodeattrs.fill,
                                                 nodeattrs.stroke,
                                                 nodeattrs.strokeWidth )
                    break
                case 'KonvaImage':
                    //Image toolbar
                    break
            }
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

    handleMainPaste(e, pasted_file){
        if(validateFile(pasted_file)){
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

    handleSecondaryPaste(e, pasted_file){
        if(validateFile(pasted_file)){
            const reader = new FileReader();
            reader.readAsDataURL(pasted_file);
            reader.onload = (e) => {
                //Create image from load
                let image = new window.Image();
                image.src = e.target.result;

                image.onload = () => {
                    //send image to editor
                    this.createNewSecondaryImage(e, image)
                }
            }
        }
    }

    handlePaste(e){
        console.log(e)

        let pasted_file = e.clipboardData.files[0]

        console.log( pasted_file )

        //Do nothing if there is no file
        if(pasted_file == null) return false

        //Main is already loaded or not?
        if( this.state.image == null ){
            this.handleMainPaste(e, pasted_file)
        } else{
            this.handleSecondaryPaste(e, pasted_file)
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

    imageCopytoClipboard(){
        //Unselect any item (the transform box would be printed otherwise)
        this.changeSelectedItem([])
        //pixel ratio 1,same resolution as screen
        let data = this.stageRef.current.toDataURL({pixelRatio: 1})
        let blob = dataURLtoBlob(data)

        try {
            navigator.clipboard.write([
                new ClipboardItem({'image/png': blob})
            ]);
        } catch (error) { console.error(error) }
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

    changeSelectedTool(newTool){
        if(newTool != null){
            console.log("changed to: ", newTool)
            this.state.selectedTool = newTool
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

    createNewSecondaryImage(e, image){
        const reduction = 0.7

        let correlation = image.height / image.width
        let mainimage = this.kvMainImageRef.current
        let width  = mainimage.getAttr('width')
        let height = mainimage.getAttr('height')

        let new_size = this.calculate_resize(correlation, width, height)

        let newImageRef = createRef()
        let new_image = <KonvaImage 
                            ref={newImageRef}
                            key={this.state.itemArray.length}
                            image={image}
                            width={new_size.width * reduction}
                            height={new_size.height * reduction}
                            x={ (width / 2 ) - (new_size.width * reduction / 2)}
                            y={ (height / 2) - (new_size.height * reduction / 2)}
                            draggable
                        />

        this.state.itemArray.push(new_image)
        //push doesn't update the state
        this.forceUpdate()
        //After its rendered we get the ref (if not rendered, new_image is not a valid node)
        let item = {type: 'KonvaImage', item: newImageRef.current}
        this.changeSelectedItem(item)
    }
    
    startCreateNewFreeLine(){
        //if( pincel seleccionado )
        console.log("EMPESAMOS A PINTAR")

        let pos = this.stageRef.current.getPointerPosition()
        let new_line = <Line
                        key={this.state.itemArray.length}
                        ref={this.lineRef}
                        stroke={'#df4b26'}
                        strokeWidth={5}
                        globalCompositeOperation={'source-over'}
                        points={[pos.x, pos.y]}
                       />

        this.state.itemArray.push(new_line)

        this.setState({isDrawing: true})
    }

    continueCreateNewFreeLine(){
        if( this.state.isDrawing ){
            let lastLine = this.lineRef.current
            let pos = this.stageRef.current.getPointerPosition()
            let newLinePoints = lastLine.points().concat([pos.x, pos.y])
            lastLine.points(newLinePoints)
            //redraw the changed line
            this.stageRef.current.batchDraw()
        }
    }

    endCreateNewFreeLine(){
        //if( pincel seleccionado )

        this.setState({isDrawing: false})
    }

    //when canvas is clicked, select the item that is clicked,
    //or deselect if no item is clicked
    handleCanvasMouseDown(e){
        let transformer = this.transformerRef.current

        //Ignores event if we are transforming 
        if( !transformer.isTransforming() ){
            if( e.target.className !== "Image" ){
                this.changeSelectedItem({type: 'CvText', item: e.target})

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

            } else if(e.target != this.kvMainImageRef.current){
                this.changeSelectedItem({type: 'KonvaImage', item: e.target})
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
                        <DragandDrop imgLoader={this.imageLoader.bind(this)}/> 
                        : 
                        <SecondaryDragandDrop 
                            imgLoader={this.createNewSecondaryImage.bind(this)}
                        />
                    }
                    
                    <Stage 
                      width={0} 
                      height={0} 
                      ref={this.stageRef}
                      style={{outline: 'none'}}
                      onMouseDown={this.startCreateNewFreeLine.bind(this)}
                      onMouseUp={this.endCreateNewFreeLine.bind(this)}
                      onMouseLeave={this.endCreateNewFreeLine.bind(this)}
                      onMouseMove={this.continueCreateNewFreeLine.bind(this)}
                    >
                        <Layer
                          ref={this.mainLayerRef}
                          onMouseDown={this.handleCanvasMouseDown.bind(this)}
                          onDblClick={this.createNewText.bind(this)}
                        >
                            <KonvaImage
                            //Main image
                                ref={this.kvMainImageRef}>
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

                    <Toolbar
                        toolUpdater={this.changeSelectedTool.bind(this)}
                    />
                    </div>
                    
                    <div className="d-flex flex-column">
                    
                    <CopytoClipboardButton
                        copyHandler={this.imageCopytoClipboard.bind(this)}
                        enabled={(this.state.image == null) ? true : false}
                    />

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
                    </div>
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
