import React, { createRef, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import { ColorButton, ColorPicker, createColor } from 'material-ui-color';
import { Button, ButtonGroup, FormControl, FormHelperText, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import FontSizeSelector from './FontSizeSelector'

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';

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

  const [alignment, setAlignment] = React.useState('center')
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [fontColor, setFontColor] = useState(createColor("#FFFFFF"));
  const handleFontColorChange = (value) => {
    setFontColor(value);
    props.colorUpdater(value)
  };

  return (
    <div id='bottomtoolbar' className={classes.root}>
        <Grid container spacing={0}>
        <Grid item xs={4}>
          <Paper className="m-3 d-flex flex-wrap justify-content-around" elevation={3}>
            <div className="m-3">
            <ToggleButtonGroup
              value={alignment}
              exclusive
              size="small"
              onChange={handleAlignment}
              aria-label="text alignment"
            >
              <ToggleButton value="left" aria-label="left aligned">
                <FormatAlignLeftIcon />
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered">
                <FormatAlignCenterIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="right aligned">
                <FormatAlignRightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            </div>

            <FormControl className="mx-2 my-1 mt-4">
              <InputLabel>Font</InputLabel>
                <Select
                  //value={}
                  //onChange={}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10} style={{fontFamily: 'Impact'}}>Ten</MenuItem>
                  <MenuItem value={20}>Twentyyyyyyyyyyyyyyyyyyyyyy</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              <FormHelperText>Choose your font</FormHelperText>
            </FormControl>

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
                <ColorPicker defaultValue="black" hideTextfield/>
              </Grid>

              <Grid item xs={6} className="">
                <div className="m-2 pr-2">
                <Typography id="discrete-slider" gutterBottom>
                  Stroke
                </Typography>
                <Slider
                  defaultValue={30}
                  //getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={15}
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
