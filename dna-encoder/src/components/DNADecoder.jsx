// DNADecoder.js
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography } from '@mui/material';

function DNADecoder() {
    const [dnaString, setDnaString] = useState('');
    const [decodedData, setDecodedData] = useState(null);

    const handleDnaStringChange = (event) => {
        setDnaString(event.target.value);
    };

    const handleSubmit = () => {
        // Logic to decode the DNA string based on the selected DNA type
        // For now, let's assume it just displays the input string
        setDecodedData(`Decoded Data for ${dnaString}`);
    };

    return (
        <div>
            <Typography variant="h6"> NOT YET IMPLEMENTED</Typography>
            <TextField
                fullWidth
                label="DNA String"
                value={dnaString}
                onChange={handleDnaStringChange}
                margin="normal"
            />
            <Button variant="contained" onClick={handleSubmit}>Decode DNA</Button>
            {decodedData && <Typography variant="body1" style={{ marginTop: '20px' }}>{decodedData}</Typography>}
        </div>
    );
}

export default DNADecoder;
