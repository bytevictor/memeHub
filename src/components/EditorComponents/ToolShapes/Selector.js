
export function handleSelectorMouseDown(e){
    //when canvas is clicked, select the item that is clicked,
    //or deselect if no item is clicked
    let transformer = this.transformerRef.current

    //Ignores event if we are transforming 
    if( !transformer.isTransforming() ){
        if( e.target.className !== "Image" ){
            this.changeSelectedItem({type: 'CvText', item: e.target})

            let bottomtoolbar = this.bottomToolbarRef.current
            let text = e.target.getAttrs()

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