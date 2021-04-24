import React from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {createMuiTheme} from '@material-ui/core/styles'
import {ThemeProvider} from '@material-ui/styles'

import GestureIcon from '@material-ui/icons/Gesture';
import BrushIcon from '@material-ui/icons/Brush';
import Crop169Icon from '@material-ui/icons/Crop169';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';


export default function ToggleButtons() {
  const [alignment, setAlignment] = React.useState('freehand');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  
  return (
    <ThemeProvider theme={darkTheme}>
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      orientation="vertical"
      className="menuherramientas"
    >
      <ToggleButton value="freehand" aria-label="freehand">
        <GestureIcon />
      </ToggleButton>
      <ToggleButton value="square" aria-label="square">
        <Crop169Icon />
      </ToggleButton>
      <ToggleButton value="circle" aria-label="circle">
        <RadioButtonUncheckedIcon />
      </ToggleButton>
      <ToggleButton value="brush" aria-label="brush">
        <BrushIcon />
      </ToggleButton>
    </ToggleButtonGroup>
    </ThemeProvider>
  );
}