import React, { createRef, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import TextBottomToolbar from './BottomToolbars/TextBottomToolbar'
import LineBottomToolbar from './BottomToolbars/LineBottomToolbar'
import RectBottomToolbar from './BottomToolbars/RectBottomToolbar'
import ImageBottomToolbar from './BottomToolbars/ImageBottomToolbar'

class BottomToolbar extends React.Component{
  constructor(props){
    super(props)

    this.bottomToolbarRef = createRef()

    this.fontSizeUpdater=props.fontSizeUpdater
    this.fontColorUpdater=props.fontColorUpdater
    this.strokeColorUpdater=props.strokeColorUpdater
    this.strokeSizeUpdater=props.strokeSizeUpdater
    this.fontFamilyUpdater=props.fontFamilyUpdater
    this.alignmentUpdater=props.alignmentUpdater

    this.shadowColorUpdater=props.shadowColorUpdater
    this.shadowSizeUpdater=props.shadowSizeUpdater
    this.dashUpdater=props.dashUpdater

    this.cornerRadiusUpdater=props.cornerRadiusUpdater
    this.fillUpdater=props.fillUpdater

    this.blurValueUpdater=props.blurValueUpdater

    this.state = {
      selectedToolbar: "SelectorAndText"
    }
  }

  changeBottomToolbar(newToolbarName){
    this.setState({selectedToolbar: newToolbarName})
  }

  updateToolbar(){
    let bottomToolbar = this.bottomToolbarRef.current
    return bottomToolbar.updateToolbar.bind(bottomToolbar)
  }

  getBottomToolbar(){
    switch(this.state.selectedToolbar){
        case "SelectorAndText":
          return <TextBottomToolbar 
                    ref={this.bottomToolbarRef}

                    fontSizeUpdater    = {this.fontSizeUpdater}
                    fontColorUpdater   = {this.fontColorUpdater}
                    strokeColorUpdater = {this.strokeColorUpdater}
                    strokeSizeUpdater  = {this.strokeSizeUpdater}
                    fontFamilyUpdater  = {this.fontFamilyUpdater}
                    alignmentUpdater   = {this.alignmentUpdater}
                 />
        break
        case "FreeLine":
            return <LineBottomToolbar 
                    ref={this.bottomToolbarRef}

                    strokeColorUpdater = {this.strokeColorUpdater}
                    strokeSizeUpdater  = {this.strokeSizeUpdater}
                    shadowColorUpdater={this.shadowColorUpdater}
                    shadowSizeUpdater={this.shadowSizeUpdater}
                    dashUpdater={this.dashUpdater}
                   />
        break
        case "StraightLine":
            return <LineBottomToolbar 
                      ref={this.bottomToolbarRef}

                      strokeColorUpdater = {this.strokeColorUpdater}
                      strokeSizeUpdater  = {this.strokeSizeUpdater}
                      shadowColorUpdater={this.shadowColorUpdater}
                      shadowSizeUpdater={this.shadowSizeUpdater}
                      dashUpdater={this.dashUpdater}
                   />
        break
        case "Rectangle":
        case "Ellipse":
            return <RectBottomToolbar
                      ref={this.bottomToolbarRef}

                      //we can reuse the rectbottom toolbar but corner radius has no sense
                      disableCornerRadius={this.state.selectedToolbar == "Ellipse"}

                      strokeColorUpdater = {this.strokeColorUpdater}
                      strokeSizeUpdater  = {this.strokeSizeUpdater}
                      shadowColorUpdater={this.shadowColorUpdater}
                      shadowSizeUpdater={this.shadowSizeUpdater}
                      cornerRadiusUpdater={this.cornerRadiusUpdater}
                      fillUpdater={this.fillUpdater}
                   />
        case "KonvaImage":
          return <ImageBottomToolbar 
                      ref={this.bottomToolbarRef}

                      strokeColorUpdater = {this.strokeColorUpdater}
                      strokeSizeUpdater  = {this.strokeSizeUpdater}
                      shadowColorUpdater={this.shadowColorUpdater}
                      shadowSizeUpdater={this.shadowSizeUpdater}
                      blurValueUpdater={this.blurValueUpdater}
                 />
        break
    }
}

  render(){
    return (
      <React.Fragment>
        {
          this.getBottomToolbar()
        }
      </React.Fragment>
    );
  }
  
}

export default (BottomToolbar)