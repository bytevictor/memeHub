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

class LineBottomToolbar extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      strokeColor: createColor("#000000"),
      strokeWidth: 6,
      shadowColor: createColor("#000000"),
      shadowWidth: 0,
      dashValue: false
    }
    
    this.dashValues = {
      continuous  : false,
      dashLine    : [35, 30],
      dotLine     : [0.001, 30],
      dashAndDots : [29, 25, 0.001, 25]
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

  changeDash( value ){
    if(this.state.dashValue != value){
      this.setState({dashValue: value})
    }
  }

  updateToolbar(strokeColor, strokeWidth, shadowColor, shadowWidth, dashValue){
    if( strokeColor != null)
      this.changeStrokeColor(strokeColor)

    if( strokeWidth != null)
      this.changeStroke(strokeWidth)

    if( shadowColor != null)
      this.changeShadowColor(shadowColor)

    if( shadowWidth != null)
      this.changeShadowWidth(shadowWidth)

    //Selector value should be the same object to work properly so
    //here we compare to the object and replace value with it
    if( dashValue != null){
      if(dashValue == this.dashValues.continuous){
        this.changeDash(this.dashValues.continuous)
      } else if( arrayEquals(dashValue, this.dashValues.dashLine) ){
        this.changeDash(this.dashValues.dashLine)
      } else if( arrayEquals(dashValue, this.dashValues.dotLine) ){
        this.changeDash(this.dashValues.dotLine)
      } else if( arrayEquals(dashValue, this.dashValues.dashAndDots) ){
        this.changeDash(this.dashValues.dashAndDots)
      } 
    }
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

  handleDashChange = (event) => {
    let value = event.target.value
    console.log("Cambiando ", value)
    if(this.state.dash != value){

      this.setState({dashValue: value})
      this.props.dashUpdater(value)
    }
  }

  /*  ////////////////////////////////////////////////  */

  render(){
    const { classes } = this.props
    return (
      <div id='bottomtoolbar' className={classes.root}>
          <Grid container spacing={0} justify="space-evenly">
          <Grid item xs={4} sm={4} md={4} className="d-flex">
          <Paper className="m-3 p-2 d-flex justify-content-around align-items-center flex-grow-1" 
                   elevation={3}>
                <Paper className="p-2 d-flex flex-column justify-content-around align-items-center" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Shadow Color
                  </Typography>
                  <ColorPicker 
                        defaultValue={this.state.shadowColor} 
                        value={this.state.shadowColor}
                        onChange={this.handleShadowColorChange.bind(this)}
                        hideTextfield
                  />
                </Paper>
                <Paper className="p-2 w-50" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Shadow Width
                  </Typography>
                  <div className="m-2 pr-2">
                    <Slider
                      value={this.state.shadowWidth}
                      //getAriaValueText={valuetext}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={2}
                      marks
                      min={0}
                      max={30}
                      onChange={this.handleShadowSizeChange.bind(this)}
                    />
                  </div>
                </Paper>
            </Paper>
          </Grid>
          <Grid item xs={4} sm={4} md={4} className="d-flex">
          <Paper className="m-3 p-2 d-flex justify-content-around align-items-center flex-grow-1" 
                   elevation={3}>
                <Paper className="p-2 w-50" variant="outlined">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Line Type
                  </Typography>
                  <div className="m-2 pr-2">
                  <Select
                    className="w-100"
                    id="dashSelector"
                    value={this.state.dashValue}
                    defaultValue={false}
                    onChange={this.handleDashChange.bind(this)}
                    label="Age"
                  >
                      <MenuItem value={this.dashValues.continuous}>Continuous</MenuItem>
                      <MenuItem value={this.dashValues.dashLine}>Dashed</MenuItem>
                      <MenuItem value={this.dashValues.dotLine}>Dots</MenuItem>
                      <MenuItem value={this.dashValues.dashAndDots}>Dash & Dots</MenuItem>
                    </Select>
                  </div>
                </Paper>
            </Paper>
          </Grid>
          <Grid item xs={4} sm={4} md={4} className="d-flex">
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
                      defaultValue={6}
                      value={this.state.strokeWidth}
                      //getAriaValueText={valuetext}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={30}
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

LineBottomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LineBottomToolbar)
