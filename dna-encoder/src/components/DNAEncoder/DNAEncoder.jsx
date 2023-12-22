import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Slider, Typography, Switch } from '@mui/material';

// Import the color palette
import geneColorPalette from '../../data/gene_color_pallet.json';


// Encoder functions
const encodeId = (value, keyMapping) => {
    console.log(value, keyMapping);
    return keyMapping[value] || '00';
};

const encodeInt = (value, byteSize) => {
    return parseInt(value).toString(16).padStart(byteSize * 2, '0');
};

const encodeBool = (value) => {
    return value ? '01' : '00';
};

const encodeStr = (value) => {
    return value.split('').map(char => char.charCodeAt(0).toString(16)).join('');
};

const encodeColor = (value, colorPalette) => {
    return Object.keys(colorPalette).find(key => colorPalette[key] === value) || '00';
};

const encodePercentage = (value) => {
    return Math.round(value * 100).toString(16).padStart(2, '0');
};

function DNAEncoder() {
    const [protocolVersion] = useState('01'); // Fixed protocol version
    const [stakingBoost, setStakingBoost] = useState(0); // NFT boost determined by slider
    const [collectionType, setCollectionType] = useState('');
    const [dnaKey, setDnaKey] = useState(null);
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        if (collectionType) {
            import(`../../data/DNA_keys/${collectionType}_DNA_key_v1.json`)
                .then((key) => {
                    setDnaKey(key.default);
                    const initialValues = {};
                    Object.keys(key.default.genes).forEach(gene => {
                        initialValues[gene] = '';
                    });
                    setInputValues(initialValues);
                })
                .catch((error) => console.error("Error loading DNA key file:", error));
        }
    }, [collectionType]);

    const handleInputChange = (gene, value) => {
        setInputValues(prev => ({ ...prev, [gene]: value }));
    };

    const renderInputFields = () => {
        if (!dnaKey) return null;

        // Skip the first three genes (protocol version, NFT boost, collection type)
        const genesArray = Object.entries(dnaKey.genes).slice(3);

        return genesArray.map(([gene, length]) => {
            if (gene.endsWith('_id')) {
                const optionsKey = `${gene}s`;
                const options = dnaKey[optionsKey];
                return (
                    <FormControl key={gene} fullWidth margin="normal">
                        <InputLabel id={`${gene}-label`}>{gene}</InputLabel>
                        <Select
                            labelId={`${gene}-label`}
                            value={inputValues[gene]}
                            onChange={(e) => handleInputChange(gene, e.target.value)}
                        >
                            {Object.entries(options).map(([name, value]) => (
                                <MenuItem key={value} value={value}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            } else if (gene.endsWith('_int')) {
                return (
                    <TextField
                        key={gene}
                        label={gene}
                        type="number"
                        value={inputValues[gene]}
                        onChange={(e) => handleInputChange(gene, e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                );
            } else if (gene.endsWith('_color')) {
                return (
                    <FormControl key={gene} fullWidth margin="normal">
                        <InputLabel id={`${gene}-label`}>{gene}</InputLabel>
                        <Select
                            labelId={`${gene}-label`}
                            value={inputValues[gene]}
                            onChange={(e) => handleInputChange(gene, e.target.value)}
                        >
                            {Object.entries(geneColorPalette).map(([key, { name }]) => (
                                <MenuItem key={key} value={key}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            } else if (gene.endsWith('_bool')) {
                return (
                    <FormControl key={gene} fullWidth margin="normal">
                        <Typography>{gene}</Typography>
                        <Switch
                            checked={inputValues[gene] === '01'}
                            onChange={(e) => handleInputChange(gene, e.target.checked ? '01' : '00')}
                        />
                    </FormControl>
                );
            }
            // TODO: Add more conditions for other gene types

            return (
                <TextField
                    key={gene}
                    label={gene}
                    value={inputValues[gene]}
                    onChange={(e) => handleInputChange(gene, e.target.value)}
                    fullWidth
                    margin="normal"
                />
            );
        });
    };

    const encodeDNA = () => {
        if (!dnaKey) return '';

        let dnaString = protocolVersion; // Fixed protocol version
        dnaString += encodeInt(stakingBoost, 1); // Encoding staking boost

        // TODO: Make this dynamic based on collection type
        dnaString +=  (collectionType === "avatar") ? "01" : "02"; // Encoding collection type
        Object.entries(dnaKey.genes).slice(3).forEach(([gene, length]) => {
            const value = inputValues[gene];

            // If the value is not set yet, encode it as # for the length
            if (!value) {
                dnaString += '#'.repeat(length * 2);
                return;
            }

            // Encode the value
            if (gene.endsWith('_id') || gene.endsWith('_color') || gene.endsWith('_bool')) {
                // dnaString += encodeId(value, dnaKey[`${gene}s`]);
                dnaString += value;
            } else if (gene.endsWith('_int')) {
                dnaString += encodeInt(value, length);
            }
            // TODO: Add more conditions for other gene types
        });

        return dnaString.toUpperCase();
    };

    return (
        <div>
            <Typography variant="h6">Encoded DNA: {encodeDNA()}</Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel id="collection-type-label">Collection Type</InputLabel>
                <Select
                    labelId="collection-type-label"
                    value={collectionType}
                    label="Collection Type"
                    onChange={(e) => setCollectionType(e.target.value)}
                >
                    <MenuItem value="avatar">Avatar</MenuItem>
                    <MenuItem value="persona">Persona</MenuItem>
                </Select>
            </FormControl>

            <Typography gutterBottom>Staking Boost: {stakingBoost}%</Typography>
            <Slider
                value={stakingBoost}
                onChange={(e, val) => setStakingBoost(val)}
                min={0}
                max={100}
            />

            {renderInputFields()}
        </div>
    );
}

export default DNAEncoder;
