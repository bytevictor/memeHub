import React, { createRef, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Paper from '@material-ui/core/Paper'
import { ColorButton, ColorPicker, createColor } from 'material-ui-color'
import { Card, Slider, TextField, Tooltip, Typography, Zoom } from '@material-ui/core'
import FontSizeSelector from '../TextComponents/FontSizeSelector'
import FontAlignmentSelector from '../TextComponents/FontAlignmentSelector'
import FontFamilySelector from '../TextComponents/FontFamilySelector'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { render } from '@testing-library/react'
import createTypography from '@material-ui/core/styles/createTypography'

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


class TextBottomToolbar extends React.Component{
  constructor(props){
    super(props)

    this.strokeSliderRef = createRef()

    this.state = {
      alignment: 'center',
      font: 'Impact',
      fontSize: 70,
      fontColor: createColor("#FFFFFF"),
      strokeColor: createColor("#000000"),
      strokeWidth: 0,
    }
  }

  /* /////////////// Change UI functions /////////////// */ 
  // changes the selector state to syncronize it with the text value

  changeAlignment( value ){
    if(this.state.alignment != value){
      this.setState({alignment: value})
    }
  }
  
  changeFont( value ){
    if(this.state.font != value){
      this.setState({font: value})
    }
  }

  changeFontSize( value ){
    if(this.state.fontSize != value){
      this.setState({fontSize: value})
    }
  }
  //value should be a hex string not a color
  changeFontColor( value ){
    if(this.state.fontColor != value){
      this.setState({fontColor: createColor(value)})
    }
  }
  //value should be a hex string not a color
  changeStrokeColor( value ){
    if(this.state.strokeColor != value){
      this.setState({strokeColor: createColor(value)})
    }
  }

  changeStroke( value ){
    if(this.state.strokeWidth != value){
      this.setState({strokeWidth: value})
    }
  }

  updateToolbar( alignment, font, fontSize, fontColor, strokeColor, strokeWidth){
    if( alignment != null)
      this.changeAlignment(alignment)

    if( font != null)
      this.changeFont(font)

    if( fontSize != null)
      this.changeFontSize(fontSize)

    if( fontColor != null)
      this.changeFontColor(fontColor)

    if( strokeColor != null)
      this.changeStrokeColor(strokeColor)

    if( strokeWidth != null)
      this.changeStroke(strokeWidth)
  }

  /*  ////////////////////////////////////////////////  */

  /* /////////////// Handlers /////////////// */ 
  // updaters, update the canvas item
  // state updates toolbar elements

  handleAlignmentChange = (event, value) => {
    if(value != null){
      this.setState({alignment: value})
      this.props.alignmentUpdater(value)
    }
  }

  handleFontFamilyChange = (value) => {
    this.setState({font: value})
    this.props.fontFamilyUpdater(value)
  }

  handleFontSizeChange = (value) => {
    this.setState({fontSize: value})
    this.props.fontSizeUpdater(value)
  }

  handleFontColorChange = (value) => {
    this.setState({fontColor: value})
    this.props.fontColorUpdater(value)
  }

  handleStrokeColorChange = (value) => {
    this.setState({strokeColor: value})
    this.props.strokeColorUpdater(value)
  }

  handleStrokeSizeChange = (event, value) => {
    //event triggers onmousemove, so it floods, change state
    //only when value changes (performance)
    if(this.state.strokeWidth != value){
      this.props.strokeSizeUpdater(value)
      this.setState({strokeWidth: value})
    }
  }

  /*  ////////////////////////////////////////////////  */

  render(){
    const { classes } = this.props
    return (
      <div id='bottomtoolbar' className={classes.root}>
          <Grid container spacing={0} justify="space-evenly">
          <Grid item xs={7} sm={6} md={4}>
            <Paper className="m-3 d-flex justify-content-around align-items-center" elevation={3}>
              <FontAlignmentSelector //updater={this.props.alignmentUpdater}
                                      toolbarHandler={this.handleAlignmentChange.bind(this)}
                                      value={this.state.alignment}
              />
              
              <div className="">
              <FontFamilySelector //updater={this.props.fontFamilyUpdater}
                                  className="w-100"
                                  toolbarHandler={this.handleFontFamilyChange.bind(this)}
                                  value={this.state.font}
              />
              </div>

              <FontSizeSelector //updater={this.props.fontSizeUpdater}
                                toolbarHandler={this.handleFontSizeChange.bind(this)}
                                value={this.state.fontSize}
              />  
            </Paper>
          </Grid>
          <Grid item xs={5} sm={6} md={5} className="d-flex">
            <Paper className="m-3 p-2 d-flex justify-content-around align-items-center flex-grow-1" 
                   elevation={3}>
                <Paper className="p-2 d-flex flex-column justify-content-around align-items-center" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Font Color
                  </Typography>
                  <ColorPicker 
                        defaultValue={this.state.fontColor} 
                        value={this.state.fontColor}
                        onChange={this.handleFontColorChange.bind(this)}
                        hideTextfield/>
                </Paper>
                <Paper className="p-2 d-flex flex-column justify-content-around align-items-center" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Stroke Color
                  </Typography>
                  <ColorPicker 
                        defaultValue={this.state.strokeColor} 
                        value={this.state.strokeColor}
                        onChange={this.handleStrokeColorChange.bind(this)}
                        hideTextfield
                  />
                </Paper>
                <Paper className="p-2 w-50" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Stroke Width
                  </Typography>
                  <div className="m-2 pr-2">
                    <Slider
                      ref={this.strokeSliderRef}
                      defaultValue={0}
                      value={this.state.strokeWidth}
                      //getAriaValueText={valuetext}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={0}
                      max={15}
                      onChange={this.handleStrokeSizeChange.bind(this)}
                    />
                  </div>
                </Paper>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
  
}

TextBottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextBottomToolbar)
