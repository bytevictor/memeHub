import React from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {createMuiTheme} from '@material-ui/core/styles'
import {ThemeProvider} from '@material-ui/styles'

import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import GestureIcon from '@material-ui/icons/Gesture';
import Crop169Icon from '@material-ui/icons/Crop169';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';


export default function Toolbar(props) {
  //const [selection, setSelection] = React.useState('SelectorAndText');
  const toolUpdater = props.toolUpdater

  const handleSelection = (event, newSelection) => {
    if (newSelection !== null) {
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
      value={props.tool}
      exclusive
      onChange={handleSelection}
      aria-label="text alignment"
      orientation="vertical"
      className="menuherramientas"
      
    >
      
      <ToggleButton value="SelectorAndText" aria-label="Selector">
        <Tooltip title="Selector and Text creator" placement="left" TransitionComponent={Zoom} arrow>
          <FormatShapesIcon/>
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="FreeLine" aria-label="FreeLine">
        <Tooltip title="Free Line" placement="left" TransitionComponent={Zoom} arrow>
          <GestureIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="StraightLine" aria-label="StraightLine">
        <Tooltip title="Straight Line" placement="left" TransitionComponent={Zoom} arrow>
          <ShowChartIcon />
        </Tooltip>
      </ToggleButton>    
      <ToggleButton value="Rectangle" aria-label="Rectangle">
        <Tooltip title="Rectangle" placement="left" TransitionComponent={Zoom} arrow>
        <Crop169Icon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="Ellipse" aria-label="Ellipse">
        <Tooltip title="Ellipse" placement="left" TransitionComponent={Zoom} arrow>
          <RadioButtonUncheckedIcon />
        </Tooltip>
      </ToggleButton>
      
    </ToggleButtonGroup>
    </ThemeProvider>
  );
}