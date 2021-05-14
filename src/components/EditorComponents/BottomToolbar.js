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

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 0,
    },
    paper: {
      padding: theme.spacing(0),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));


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
              <FontAlignmentSelector/>
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
}
