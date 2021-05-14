import React, {useState} from 'react';
import { render } from "@testing-library/react"
import { createRef } from "react"

import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';

export default function FontAlignmentSelector(props){

    const alignmentUpdater = props.updater

    const [alignment, setAlignment] = useState('center')
    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
        alignmentUpdater(newAlignment)
    };

    return(
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
    );
}

