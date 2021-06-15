
export function handleSelectorMouseDown(e){
    //when canvas is clicked, select the item that is clicked,
    //or deselect if no item is clicked
    let transformer = this.transformerRef.current

    console.log(e.target.className)

    //Ignores event if we are transforming 
    if( !transformer.isTransforming() ){
        if( e.target.className === "Text" ){
            this.changeSelectedItem({type: 'CvText', item: e.target})

        } else if(e.target.className === "Line"){
            this.changeSelectedItem({type: 'Line', item: e.target})

        } else if(e.target.className === "Rect" || e.target.className === "Ellipse") {
            this.changeSelectedItem({type: 'Rect', item: e.target})

        } else if(e.target != this.kvMainImageRef.current){
            this.changeSelectedItem({type: 'KonvaImage', item: e.target})
            
        } else {
            this.changeSelectedItem([])
        }
    }
}