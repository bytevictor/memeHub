
export function handleSelectorMouseDown(e){
    //when canvas is clicked, select the item that is clicked,
    //or deselect if no item is clicked
    let transformer = this.transformerRef.current

    console.log(e.target.className)

    //Ignores event if we are transforming 
    if( !transformer.isTransforming() ){
        if( e.target.className === "Text" ){
            this.changeSelectedItem({type: 'CvText', item: e.target})

            let bottomtoolbar = this.bottomToolbarRef.current
            let text = e.target.getAttrs()

            bottomtoolbar.updateToolbar(    text.align,
                                            text.fontFamily,
                                            text.fontSize,
                                            text.fill,
                                            text.stroke,
                                            text.strokeWidth )

        } else if(e.target.className === "Line"){
            this.changeSelectedItem({type: 'Line', item: e.target})

            let bottomtoolbar = this.bottomToolbarRef.current
            let line = e.target.getAttrs()

            bottomtoolbar.updateToolbar(    line.stroke,
                                            line.strokeWidth,
                                            line.shadowColor,
                                            line.shadowBlur )
        } else if(e.target != this.kvMainImageRef.current){
            this.changeSelectedItem({type: 'KonvaImage', item: e.target})
        } else {
            this.changeSelectedItem([])
        }
    }
}