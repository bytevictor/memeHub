import React, {useState} from 'react'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core'

export default function FontFamilySelector(props){

    const [alignment, setAlignment] = useState('center')
    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return(
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
    );
}

