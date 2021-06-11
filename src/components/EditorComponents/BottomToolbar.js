import React, { createRef, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import TextBottomToolbar from './BottomToolbars/TextBottomToolbar'
import LineBottomToolbar from './BottomToolbars/TextBottomToolbar'

const styles = theme => ({
    root: {
      flexGrow: 0,
    },
    paper: {
      padding: theme.spacing(0),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    title: {
      fontSize: 14,
    },
})

class BottomToolbar extends React.Component{
  constructor(props){
    super(props)

    this.strokeSliderRef = createRef()
  }

  render(){
    const { classes } = this.props

    let bottomToolbar;

    switch(this.props.tool){
      case 'SelectorAndText':
        bottomToolbar=<TextBottomToolbar 
                        ref={this.bottomToolbarRef}
                        fontSizeUpdater={this.props.fontSizeUpdater.bind(this)}
                        fontColorUpdater={this.props.fontColorUpdater.bind(this)}
                        strokeColorUpdater={this.props.strokeColorUpdater.bind(this)}
                        strokeSizeUpdater={this.props.strokeSizeUpdater.bind(this)}
                        fontFamilyUpdater={this.props.fontFamilyUpdater.bind(this)}
                        alignmentUpdater={this.props.alignmentUpdater.bind(this)}
                      />
      break
      case 'FreeLine':
        bottomToolbar=<LineBottomToolbar

                      />
      break
    }

    return (
      <React.Fragment>
        {bottomToolbar}
      </React.Fragment>
    );
  }
  
}

BottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomToolbar)