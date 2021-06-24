import React, { createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { ColorPicker, createColor } from 'material-ui-color'
import { Select, Slider, Typography, MenuItem } from '@material-ui/core'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

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

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

class ImageBottomToolbar extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      strokeColor: createColor("#000000"),
      strokeWidth: 0,
      shadowColor: createColor("#000000"),
      shadowWidth: 0,
      selectedFilter: "Blur",

      //To change slider depending on the selected filter
      sliderMin: 0,
      sliderStep: 1,
      sliderMax: 50,

      selectedFilterValue: 0,

      blurValue: 0,
      brightenValue: 0,
      pixelSizeValue: 1,
      noiseValue: 0,
      thresholdValue: 0
    }

  }

  /* /////////////// Change UI functions /////////////// */ 
  // changes the selector state to syncronize it with the text value

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

  //value should be a hex string not a color
  changeShadowColor( value ){
    if(this.state.shadowColor != value){
      this.setState({shadowColor: createColor(value)})
    }
  }

  changeShadowWidth( value ){
    if(this.state.shadowWidth != value){
      this.setState({shadowWidth: value})
    }
  }

  changeBlurValue( value ){
    if(this.state.blurValue != value){
      this.setState({blurValue: value})
    }
  }

  updateToolbar(strokeColor, strokeWidth, shadowColor, shadowWidth, 
                blurValue, brightenValue, pixelSizeValue, noiseValue, thresholdValue ){
    if( strokeColor != null)
      this.changeStrokeColor(strokeColor)

    if( strokeWidth != null)
      this.changeStroke(strokeWidth)

    if( shadowColor != null)
      this.changeShadowColor(shadowColor)

    if( shadowWidth != null)
      this.changeShadowWidth(shadowWidth)

    if( blurValue != null)
      this.changeBlurValue(blurValue)

    
  }

  /*  ////////////////////////////////////////////////  */

  /* /////////////// Handlers /////////////// */ 
  // updaters, update the canvas item
  // state updates toolbar elements


  handleStrokeColorChange = (value) => {
    this.setState({strokeColor: value})
    this.props.strokeColorUpdater(value)
  }

  handleShadowColorChange = (value) => {
    this.setState({shadowColor: value})
    this.props.shadowColorUpdater(value)
  }

  handleStrokeSizeChange = (event, value) => {
    //event triggers onmousemove, so it floods, change state
    //only when value changes (performance)
    if(this.state.strokeWidth != value){
      this.props.strokeSizeUpdater(value)
      this.setState({strokeWidth: value})
    }
  }

  handleShadowSizeChange = (event, value) => {
    //event triggers onmousemove, so it floods, change state
    //only when value changes (performance)
    if(this.state.shadowSize != value){
      this.props.shadowSizeUpdater(value)
      this.setState({shadowWidth: value})
    }
  }

  handleFilterChange = (event) => {
    let value = event.target.value
    console.log("Cambiando ", value)
    console.log(this.state)

    switch(value){
      case "Blur":
        this.setState({selectedFilter: value,
                       selectedFilterValue: this.state.blurValue,
                       sliderMin: 0,
                       sliderMax: 50,
                       sliderStep: 1})
      break
      case "Brightness":
        this.setState({selectedFilter: value,
                       selectedFilterValue: this.state.brightenValue,
                       sliderMin: -1,
                       sliderMax: 1,
                       sliderStep: 0.05})
      break
      case "Noise":
        this.setState({selectedFilter: value,
                       selectedFilterValue: this.state.noiseValue,
                       sliderMin: 0,
                       sliderMax: 5,
                       sliderStep: 0.2})
      break
      case "Pixelate":
        this.setState({selectedFilter: value,
                       selectedFilterValue: this.state.pixelSizeValue,
                       sliderMin: 1,
                       sliderMax: 50,
                       sliderStep: 1})
      break
      case "Mask":
        this.setState({selectedFilter: value,
                       selectedFilterValue: this.state.thresholdValue,
                       sliderMin: 0,
                       sliderMax: 300,
                       sliderStep: 1})
      break
    }

    console.log(this.state)
  }

  handleFilterValueChange = (event, value) => {
      if(this.state.selectedFilterValue != value){
        switch(this.state.selectedFilter){
          case "Blur":
            this.props.blurValueUpdater(value)
            this.setState({selectedFilterValue: value,
                           blurValue: value})
          break
          case "Brightness":
            this.props.brightnessValueUpdater(value)
            this.setState({selectedFilterValue: value,
                           brightenValue: value})
          break
          case "Noise":
            this.props.noiseValueUpdater(value)
            this.setState({selectedFilterValue: value,
                           noiseValue: value})
          break
          case "Pixelate":
            this.props.pixelValueUpdater(value)
            this.setState({selectedFilterValue: value,
                           pixelSizeValue: value})
          break
          case "Mask":
            this.props.maskValueUpdater(value)
            this.setState({selectedFilterValue: value,
                           thresholdValue: value})
          break
        }
          
      }
  }
  
  /*  ////////////////////////////////////////////////  */

  render(){
    const { classes } = this.props
    return (
      <div id='bottomtoolbar' className={classes.root}>
          <Grid container spacing={0} justify="space-evenly">
          <Grid item xs={12} sm={10} md={6} className="d-flex">
          <Paper className="m-3 p-2 d-flex justify-content-around align-items-center flex-grow-1" 
                   elevation={3}>
                <Paper className="p-2 w-75" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Image Filter
                  </Typography>
                  <div className="d-flex">
                    <div className="m-2 pr-2 flex-grow-1">
                    <Select
                      className="w-50"
                      id="dashSelector"
                      value={this.state.selectedFilter}
                      defaultValue={"Blur"}
                      onChange={this.handleFilterChange.bind(this)}
                      label="Age"
                    >
                        <MenuItem value={"Blur"}>Blur</MenuItem>
                        <MenuItem value={"Brightness"}>Brightness</MenuItem>
                        <MenuItem value={"Noise"}>Noise</MenuItem>
                        <MenuItem value={"Pixelate"}>Pixelate</MenuItem>
                        <MenuItem value={"Mask"}>Mask</MenuItem>
                      </Select>
                    </div>
                  <div className="m-2 pr-2 w-50">
                      <Slider
                        defaultValue={0}
                        value={this.state.selectedFilterValue}
                        //getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={this.state.sliderStep}
                        marks
                        min={this.state.sliderMin}
                        max={this.state.sliderMax}
                        onChange={this.handleFilterValueChange.bind(this)}
                      />
                  </div>
                  </div>
                </Paper>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
  
}

ImageBottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageBottomToolbar)


/**
 * <Grid item xs={4} sm={4} md={4} className="d-flex">
    <Paper className="m-3 p-2 d-flex justify-content-around align-items-center flex-grow-1" 
            elevation={3}>
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
              defaultValue={0}
              value={this.state.strokeWidth}
              //getAriaValueText={valuetext}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={30}
              onChange={this.handleStrokeSizeChange.bind(this)}
            />
          </div>
        </Paper>
    </Paper>
  </Grid>
 */