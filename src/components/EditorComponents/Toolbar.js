import React from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {createMuiTheme} from '@material-ui/core/styles'
import {ThemeProvider} from '@material-ui/styles'

import GestureIcon from '@material-ui/icons/Gesture';
import BrushIcon from '@material-ui/icons/Brush';
import Crop169Icon from '@material-ui/icons/Crop169';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';


export default function ToggleButtons(props) {
  const [selection, setSelection] = React.useState('SelectorAndText');
  const toolUpdater = props.toolUpdater

  const handleSelection = (event, newSelection) => {
    if (newSelection !== null) {
      setSelection(newSelection);
      toolUpdater(newSelection)
    }
  };

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  
  return (
    <ThemeProvider theme={darkTheme}>
    <ToggleButtonGroup
      value={selection}
      exclusive
      onChange={handleSelection}
      aria-label="text alignment"
      orientation="vertical"
      className="menuherramientas"
      
    >
      <ToggleButton value="SelectorAndText" aria-label="Selector">
        <FormatShapesIcon />
      </ToggleButton>
      <ToggleButton value="FreeLine" aria-label="FreeLine">
        <GestureIcon />
      </ToggleButton>
      <ToggleButton value="StraightLine" aria-label="StraightLine">
        <ShowChartIcon />
      </ToggleButton>
      <ToggleButton value="Rectangle" aria-label="Rectangle">
        <Crop169Icon />
      </ToggleButton>
      <ToggleButton value="Ellipse" aria-label="Ellipse">
        <RadioButtonUncheckedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
    </ThemeProvider>
  );
}