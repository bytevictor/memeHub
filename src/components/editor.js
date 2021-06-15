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
import TextBottomToolbar from './EditorComponents/BottomToolbars/TextBottomToolbar'
import LineBottomToolbar from './EditorComponents/BottomToolbars/LineBottomToolbar'
import CopytoClipboardButton from './EditorComponents/ToolShapes/CopytoClipboardButton'
import SecondaryDragandDrop from './EditorComponents/SecondaryDragandDrop'
import { Stage, Layer, Rect, Image as KonvaImage, Transformer, Line} from 'react-konva'
import {dataURLtoBlob} from './Helpers/FileHelpers'
//canvas items
import CvText, { handleTextDblClick } from './EditorComponents/ToolShapes/CvText'
import {validateFile} from './Helpers/FileHelpers'
import { handleSelectorMouseDown } from './EditorComponents/ToolShapes/Selector';
import { handleFreeLineMouseDown, handleFreeLineMouseMove, handleFreeLineMouseUp } from './EditorComponents/ToolShapes/FreeLine';
import { handleStraightLineMouseDown, handleStraightLineMouseMove, handleStraightLineMouseUp } from './EditorComponents/ToolShapes/StraightLine';
import { handleRectangleMouseDown, handleRectangleMouseMove, handleRectangleMouseUp } from './EditorComponents/ToolShapes/Rectangle';
import { handleEllipseMouseDown, handleEllipseMouseMove, handleEllipseMouseUp } from './EditorComponents/ToolShapes/Ellipse';

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
        this.rectRef = createRef()
        let lastRectAttrs = {}

        this.state = {
            image: null,
            itemArray: [],

            selectedTool: "SelectorAndText",
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

            let bottomToolbar = this.bottomToolbarRef.current
            let nodeattrs = node.item.getAttrs()
            switch( node.type ){
                case 'CvText':
                    //Change the toolbar
                    this.changeBottomToolbar("SelectorAndText")

                    bottomToolbar.updateToolbar()( nodeattrs.align,
                                                   nodeattrs.fontFamily,
                                                   nodeattrs.fontSize,
                                                   nodeattrs.fill,
                                                   nodeattrs.stroke,
                                                   nodeattrs.strokeWidth )
                    break
                case 'Line':
                    this.changeBottomToolbar("FreeLine")

                    bottomToolbar.updateToolbar()( nodeattrs.stroke,
                                                   nodeattrs.strokeWidth,
                                                   nodeattrs.shadowColor,
                                                   nodeattrs.shadowBlur,
                                                   nodeattrs.dash )
                    break
                case 'Rect':
                case 'Ellipse':
                    this.changeBottomToolbar("Rectangle")

                    bottomToolbar.updateToolbar()( nodeattrs.stroke,
                                                   nodeattrs.strokeWidth,
                                                   nodeattrs.shadowColor,
                                                   nodeattrs.shadowBlur,
                                                   nodeattrs.cornerRadius,
                                                   nodeattrs.fill )
                    break
                case 'KonvaImage':
                    //Image toolbar
                    break
            }
        }
    }

    changeBottomToolbar( bottomToolbarName ){
        let bottomToolbar = this.bottomToolbarRef.current
        console.log("bottomToolbar changed to: " + bottomToolbarName)
        bottomToolbar.changeBottomToolbar(bottomToolbarName)
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

    changeSelectedTool(newTool){
        if(newTool != null){
            console.log("changed to: ", newTool)
            //nothing should be selected when on change
            this.changeSelectedItem([])
            //change and update 
            this.setState({selectedTool: newTool})
            this.changeBottomToolbar(newTool)
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
    

    /**                                                                *
     *                                                                 *
     *                            HANDLERS                             *
     *                                                                 *
     *                                                                 */

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

    handleDelete(e){
        //delete and backspace
        if ( e.keyCode === 8 || e.keyCode === 46 ) {
            console.log("Stage delete event, Key: " + e.keyCode)
            this.deleteSelectedItem()
          }
    }

    /**                              MOUSE EVENTS                                  */

    handleCanvasMouseDown(e){
        switch(this.state.selectedTool){
            case 'SelectorAndText': 
                handleSelectorMouseDown.bind(this)(e)
            break

            case 'FreeLine':
                handleFreeLineMouseDown.bind(this)(e)
            break

            case 'StraightLine':
                handleStraightLineMouseDown.bind(this)(e)
            break

            case 'Rectangle':
                handleRectangleMouseDown.bind(this)(e)
            break

            case 'Ellipse':
                handleEllipseMouseDown.bind(this)(e)
            break
        }
    }

    handleCanvasMouseUp(e){
        switch(this.state.selectedTool){
            case 'FreeLine':
                handleFreeLineMouseUp.bind(this)(e)
            break

            case 'StraightLine':
                handleStraightLineMouseUp.bind(this)(e)
            break

            case 'Rectangle':
                handleRectangleMouseUp.bind(this)(e)
            break

            case 'Ellipse':
                handleEllipseMouseUp.bind(this)(e)
            break
        }
    }

    handleCanvasMouseMove(e){
        switch(this.state.selectedTool){
            case 'FreeLine':
                handleFreeLineMouseMove.bind(this)(e)
            break

            case 'StraightLine':
                handleStraightLineMouseMove.bind(this)(e)
            break

            case 'Rectangle':
                handleRectangleMouseMove.bind(this)(e)
            break

            case 'Ellipse':
                handleEllipseMouseMove.bind(this)(e)
            break
        }
    }

    handleCanvasMouseLeave(e){
        if(this.state.selectedTool == 'FreeLine'){
            //If leave, end line
            handleFreeLineMouseUp.bind(this)(e)
        }
    }

    handleCanvasDblClick(e){
        if(this.state.selectedTool == 'SelectorAndText'){
            console.log("dobleclick")
            handleTextDblClick.bind(this)(e)
        }
    }

    /** ************************************************************************** **/

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

    updateShadowColor( newColor ){
        let line = this.transformerRef.current.nodes()[0]

        if(line != null){
            line.setAttr('shadowColor', '#' + newColor.hex)
            line.getStage().batchDraw()
        }
    }

    updateDash( value ){
        let line = this.transformerRef.current.nodes()[0]

        if(line != null){
            line.setAttr('dash', value)
            line.getStage().batchDraw()
        }
    }

    updateShadowSize( newSize ){
        let line = this.transformerRef.current.nodes()[0]

        if(line != null){
            line.setAttr('shadowBlur', newSize)
            line.getStage().batchDraw()
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

    updateCornerRadius( newRadius ){
        let rect = this.transformerRef.current.nodes()[0]

        if(rect != null){
            console.log( newRadius )
            rect.setAttr('cornerRadius', newRadius)
            rect.getStage().batchDraw()
        }
    }

    updateFill( newColor ){
        let rect = this.transformerRef.current.nodes()[0]

        console.log(newColor)

        if(rect != null){
            if( newColor == null ){
                rect.setAttr('fill', '#' + newColor.hex)
            } else {
                rect.setAttr('fill', '#' + newColor.hex)
            }
            
            rect.getStage().batchDraw()
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
                      //onMouseDown={this.startCreateNewFreeLine.bind(this)}
                      //onMouseUp={this.endCreateNewFreeLine.bind(this)}
                      //onMouseLeave={this.endCreateNewFreeLine.bind(this)}
                      //onMouseMove={this.continueCreateNewFreeLine.bind(this)}
                    >
                        <Layer
                          ref={this.mainLayerRef}
                          onMouseDown={this.handleCanvasMouseDown.bind(this)}
                          onMouseMove={this.handleCanvasMouseMove.bind(this)}
                          onMouseUp={this.handleCanvasMouseUp.bind(this)}
                          onMouseLeave={this.handleCanvasMouseLeave.bind(this)}

                          onDblClick={this.handleCanvasDblClick.bind(this)}
                        >
                            <KonvaImage
                            //Main image
                                ref={this.kvMainImageRef}>
                            </KonvaImage>

                            { //Renders all items into the canvas
                            this.state.itemArray.map(Item => (
                                React.cloneElement(
                                    Item,
                                    { draggable: (this.state.selectedTool == "SelectorAndText") }
                                )
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

                    shadowColorUpdater={this.updateShadowColor.bind(this)}
                    shadowSizeUpdater={this.updateShadowSize.bind(this)}
                    dashUpdater={this.updateDash.bind(this)}

                    cornerRadiusUpdater={this.updateCornerRadius.bind(this)}
                    fillUpdater={this.updateFill.bind(this)}
                />

            </div>
            </ThemeProvider>
        );
    }

}

export default Editor;
