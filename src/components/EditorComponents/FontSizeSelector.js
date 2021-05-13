import { Button, ButtonGroup, TextField } from "@material-ui/core"
import { render } from "@testing-library/react"
import { createRef } from "react"




export default function FontSizeSelector(){

    const sizeRef = createRef()

    const handleIncrement = () => { 
        sizeRef.current.value = parseInt(sizeRef.current.value) + 1
    }

    const handleDecrement = () => { 
        let value = sizeRef.current.value
        if(value > 1){ 
            sizeRef.current.value = value - 1
        } 
    }

    return(
        <ButtonGroup className="my-2 d-flex flex-wrap" 
                         size="small" 
                         aria-label="small outlined button group" 
                         orientation='vertical'
                         >
            <Button onClick={handleIncrement}>+</Button>
            <TextField
              inputRef={sizeRef}
              label="Size"
              type="number"
              defaultValue={70}
              InputLabelProps={{ shrink: true }}
              inputProps={{style: {textAlign: 'center'}}}
              variant="outlined"
              style={{width: "60px"}}
            />
            <Button onClick={handleDecrement}>-</Button>
        </ButtonGroup>
    );
}

