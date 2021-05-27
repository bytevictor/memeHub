import React from 'react';

import { Button, Tooltip } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import Zoom from '@material-ui/core/Zoom';
import { wait } from '@testing-library/dom';


export default function CopytoClipboardButton(props) {
  
  let imageCopytoClipboard = props.copyHandler

  const [open, setOpen] = React.useState(false);

  const handleClick = (e) => {
    imageCopytoClipboard()
    
    setOpen(true)
    
    setTimeout(function(){setOpen(false)}, 1500)
  }
  
  return (
    <Tooltip title="Copied to clipboard!" 
             placement="left" 
             TransitionComponent={Zoom} 
             open={open}
             arrow 
             >
    <Button id="copybutton"
            className="ml-auto p-0" 
            color="grey"
            size='medium'
            variant={ (props.enabled) ? "outlined" : "contained" }
            disabled={ (props.enabled) ? true : false }
            onClick={handleClick}
            >
        <FileCopy/>
    </Button>
    </Tooltip>
  )
}