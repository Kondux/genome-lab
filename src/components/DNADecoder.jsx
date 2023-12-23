// DNADecoder.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';

import geneColorPalette from '../data/gene_color_pallet.json';
import dnaKeyKey from '../data/DNA_key_key.json';

function DNADecoder() {
	const [dnaString, setDnaString] = useState('');
	const [decodedData, setDecodedData] = useState(null);

	const reverseMapping = (mapping) => {
		const reversed = {};
		Object.entries(mapping).forEach(([key, value]) => {
			reversed[value] = key;
		});
		return reversed;
	};

	const decodeDNA = (key) => {
		let decodedResults = {};
		let currentPosition = 0;

		// Iterate over each gene in the DNA key
		Object.entries(key.genes).forEach(([gene, length]) => {
			// Extract the part of the DNA string for this gene
			const startPos = currentPosition; // Calculate the start position for this gene
			const endPos = startPos + length * 2; // Calculate the end position
			const geneValue = dnaString.slice(startPos, endPos);

			// Update the current position
			currentPosition += length * 2;

			// Decode based on gene type
			if (gene.endsWith('_id')) {
				decodedResults[gene] = decodeId(geneValue, key[`${gene}s`]);
			} else if (gene.endsWith('_int')) {
				decodedResults[gene] = parseInt(geneValue, 16);
			} else if (gene.endsWith('_bool')) {
				decodedResults[gene] = geneValue === '01';
			} else if (gene.endsWith('_color')) {
				decodedResults[gene] = decodeColor(geneValue);
			}
			// TODO: Add more decoding logic for other gene types
		});

		return decodedResults;
	};

	// Example decoding functions
	const decodeId = (value, keyMapping) => {
		const reversedMapping = reverseMapping(keyMapping);
		return reversedMapping[value.toLowerCase()] || 'Unknown';
	};

	const decodeColor = (value) => {
		const color = geneColorPalette[value];
		return color ? color.name : 'Unknown';
	};

	const handleSubmit = () => {
		// Set the DNA key
		if (!dnaString) return;

		// Extract the collection gene (hardcoded position)
		const collectionGene = dnaString.slice(4, 6);

		// Determine the correct DNA key
		const collectionType = dnaKeyKey['v1'][collectionGene];
		if (collectionType) {
			import(`../data/DNA_keys/${collectionType}_DNA_key_v1.json`)
				.then((key) => {
					// Proceed with decoding using the loaded DNA key
					const decodedResults = decodeDNA(key.default);
					setDecodedData(JSON.stringify(decodedResults, null, 2));
				})
				.catch((error) =>
					console.error('Error loading DNA key file:', error),
				);
		}
	};

	//     // Decode the DNA string
	//     const decodedResults = decodeDNA();
	//     setDecodedData(JSON.stringify(decodedResults, null, 2));
	// };

	const handleDnaStringChange = (event) => {
		setDnaString(event.target.value);
	};

	return (
		<div>
			<Typography variant='h6'>Decode DNA String</Typography>
			<TextField
				fullWidth
				label='DNA String'
				value={dnaString}
				onChange={handleDnaStringChange}
				margin='normal'
			/>
			<Button variant='contained' onClick={handleSubmit}>
				Decode DNA
			</Button>
			{decodedData && (
				<Typography variant='body1' style={{ marginTop: '20px' }}>
					Decoded Data: <pre>{decodedData}</pre>
				</Typography>
			)}
		</div>
	);
}

export default DNADecoder;
