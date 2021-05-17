import React, { createRef, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Paper from '@material-ui/core/Paper'
import { ColorButton, ColorPicker, createColor } from 'material-ui-color'
import { Slider, TextField, Typography } from '@material-ui/core'
import FontSizeSelector from './TextComponents/FontSizeSelector'
import FontAlignmentSelector from './TextComponents/FontAlignmentSelector'
import FontFamilySelector from './TextComponents/FontFamilySelector'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { render } from '@testing-library/react'

const styles = theme => ({
    root: {
      flexGrow: 0,
    },
    paper: {
      padding: theme.spacing(0),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
})


class BottomToolbar extends React.Component{
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
          <Grid container spacing={0}>
          <Grid item xs={4}>
            <Paper className="m-3 d-flex flex-wrap justify-content-around" elevation={3}>
              <div className="m-3">
                <FontAlignmentSelector updater={this.props.alignmentUpdater}
                                       toolbarHandler={this.handleAlignmentChange.bind(this)}
                                       value={this.state.alignment}
                />
              </div>
  
              <FontFamilySelector updater={this.props.fontFamilyUpdater}
                                  toolbarHandler={this.handleFontFamilyChange.bind(this)}
                                  value={this.state.font}
              />
  
              <FontSizeSelector updater={this.props.fontSizeUpdater}
                                toolbarHandler={this.handleFontSizeChange.bind(this)}
                                value={this.state.fontSize}
              />  
            </Paper>
          </Grid>
          <Grid item xs={4} className="d-flex">
            <Paper className="m-3 pt-3 d-flex justify-content-center align-content-center flex-grow-1" 
                   elevation={3}>
              <ColorPicker 
                    defaultValue={this.state.fontColor} 
                    value={this.state.fontColor}
                    onChange={this.handleFontColorChange.bind(this)}
                    hideTextfield/>
            </Paper>
          </Grid>
          <Grid item xs={4} className="d-flex">
            <Paper className="d-flex m-3 flex-grow-1" elevation={3}>
              <Grid container spacing={0}>
                <Grid item xs={6} className="d-flex align-content-center justify-content-center mt-3">
                  <ColorPicker defaultValue={this.state.strokeColor} 
                               value={this.state.strokeColor}
                               onChange={this.handleStrokeColorChange.bind(this)}
                               hideTextfield
                  />
                </Grid>
  
                <Grid item xs={6} className="">
                  <div className="m-2 pr-2">
                  <Typography id="discrete-slider" gutterBottom>
                    Stroke
                  </Typography>
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
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
  
}

BottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomToolbar)



/*  OLD Functional component version

  export default function BottomToolbar(props) {
  const classes = useStyles(); 

  const [fontColor, setFontColor] = useState(createColor("#FFFFFF"));
  const handleFontColorChange = (value) => {
    setFontColor(value);
    props.fontColorUpdater(value)
  };

  const [strokeColor, setStrokeColor] = useState(createColor("#000000"));
  const handleStrokeColorChange = (value) => {
    setStrokeColor(value);
    props.strokeColorUpdater(value)
  };

  const handleStrokeSizeChange = (event, value) => {
    props.strokeSizeUpdater(value)
  }

  return (
    <div id='bottomtoolbar' className={classes.root}>
        <Grid container spacing={0}>
        <Grid item xs={4}>
          <Paper className="m-3 d-flex flex-wrap justify-content-around" elevation={3}>
            <div className="m-3">
              <FontAlignmentSelector updater={props.alignmentUpdater}/>
            </div>

            <FontFamilySelector updater={props.fontFamilyUpdater}/>

            <FontSizeSelector updater={props.sizeUpdater}/>

          </Paper>
        </Grid>
        <Grid item xs={4} className="d-flex">
          <Paper className="m-3 pt-3 d-flex justify-content-center align-content-center flex-grow-1" 
                 elevation={3}>
            <ColorPicker 
                  defaultValue={fontColor} 
                  value={fontColor}
                  onChange={handleFontColorChange}
                  hideTextfield/>
          </Paper>
        </Grid>
        <Grid item xs={4} className="d-flex">
          <Paper className="d-flex m-3 flex-grow-1" elevation={3}>
            <Grid container spacing={0}>
              <Grid item xs={6} className="d-flex align-content-center justify-content-center mt-3">
                <ColorPicker defaultValue={strokeColor} 
                             value={strokeColor}
                             onChange={handleStrokeColorChange}
                             hideTextfield/>
              </Grid>

              <Grid item xs={6} className="">
                <div className="m-2 pr-2">
                <Typography id="discrete-slider" gutterBottom>
                  Stroke
                </Typography>
                <Slider
                  defaultValue={0}
                  //getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={15}
                  onChange={handleStrokeSizeChange}
                />
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
} */