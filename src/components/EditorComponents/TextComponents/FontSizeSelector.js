import { Button, ButtonGroup, TextField } from "@material-ui/core"
import { render } from "@testing-library/react"
import { createRef } from "react"


export default function FontSizeSelector(props){
    const sizeRef = createRef()

    const updateText = props.updater

    const handleIncrement = () => { 
        sizeRef.current.value = parseInt(sizeRef.current.value) + 1

        updateText(sizeRef.current.value)
    }

    const handleDecrement = () => { 
        let value = sizeRef.current.value
        if(value > 1){ 
            sizeRef.current.value = value - 1

            updateText(sizeRef.current.value)
        } 
    }

    const handleOnChange = (e) => {
        if( Number.isInteger(parseInt(e.target.value)) && parseInt(e.target.value) > 0){
            updateText(parseInt(e.target.value))
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

