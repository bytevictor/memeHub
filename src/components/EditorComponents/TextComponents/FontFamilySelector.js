import React, {useState, useEffect} from 'react'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core'

export default function FontFamilySelector(props){

    const updateFont = props.updater

    const [fontFamily, setFontFamily] = useState('Impact')
    const [fontList, setFontList] = useState([]);

    const fontCheck = new Set([
        // Windows 10
        'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
        // macOS
        'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
        ].sort());

    useEffect(() => {
        //If fontlist not filled, request it
        if(fontList.length == 0){
            (async() => {
                await document.fonts.ready;
            
                const fontAvailable = new Set();
                for (const font of fontCheck.values()) {
                    if (document.fonts.check(`12px "${font}"`)) {
                        fontAvailable.add(font);
                    }
                }
                
                setFontList( Array.from(fontAvailable) )
            
                console.log('Available Fonts:', [...fontAvailable.values()]);
            })()
        }
    });

    const handleFontChange = (e) => {
        console.log(e.target.value)
        setFontFamily(e.target.value)
        updateFont(e.target.value)
    }

    return(
        <FormControl className="mx-2 my-1 mt-4">
            <InputLabel>Font</InputLabel>
            <Select
                  value={fontFamily}
                  onChange={handleFontChange}
                >
                    {fontList.map(font => (
                        <MenuItem value={font} style={{fontFamily: font}}>{font}</MenuItem>
                    ))
                    }
             </Select>
            <FormHelperText>Choose your font</FormHelperText>
        </FormControl>
    );
}

