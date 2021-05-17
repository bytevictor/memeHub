import { Button, ButtonGroup, TextField } from "@material-ui/core"
import { render } from "@testing-library/react"
import { createRef } from "react"


export default function FontSizeSelector(props){
    const sizeRef = createRef()

    const updateText = props.updater

    const handleToolbarOnChange = props.toolbarHandler

    const handleIncrement = () => { 
        sizeRef.current.value = parseInt(sizeRef.current.value) + 1

        handleToolbarOnChange(sizeRef.current.value)
    }

    const handleDecrement = () => { 
        let value = sizeRef.current.value
        if(value > 1){ 
            sizeRef.current.value = value - 1

            handleToolbarOnChange(sizeRef.current.value)
        } 
    }

    const handleOnChange = (e) => {
        let value = e.target.value
        if( Number.isInteger(parseInt(value)) && parseInt(value) > 0){
            handleToolbarOnChange(parseInt(value))
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
              value={props.value}
              defaultValue={70}
              onChange={handleOnChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{style: {textAlign: 'center'}}}
              variant="outlined"
              style={{width: "60px"}}

            />
            <Button onClick={handleDecrement}>-</Button>
        </ButtonGroup>
    );
}

