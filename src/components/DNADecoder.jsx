// DNADecoder.js
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

import geneColorPalette from '../data/gene_color_pallet.json';
import protocolVersions from '../data/protocol_versions.json';
import {
	replaceDashesAndUnderscores,
	addSpaceBeforeNumbers,
	camelCaseToTitleCase,
	snakeCaseToTitleCase,
} from '../util';

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
			// TODO: ADD TKN and function decode (function can wait)
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
		return color || 'Unknown';
	};

	const isValidDNA = (key) => {
		// Test if the DNA string is a number or hex value
		if (key === undefined) return false;
		return !isNaN(parseInt(key, 16));
	};

	const handleSubmit = () => {
		// Set the DNA key
		if (!dnaString) return;

		// Extract the collection gene (hardcoded position)
		const collectionGene = dnaString.slice(4, 6);

		// Determine the correct DNA key
		const collectionType = protocolVersions['v1'][collectionGene];
		if (collectionType) {
			import(`../../data/DNA_keys/${collectionType}_DNA_key_v1.json`)
				.then((key) => {
					// Proceed with decoding using the loaded DNA key
					const decodedResults = decodeDNA(key.default);
					setDecodedData(decodedResults);
				})
				.catch((error) =>
					console.error('Error loading DNA key file:', error),
				);
		}
	};

	const handleDnaStringChange = (event) => {
		setDnaString(event.target.value);
	};

	const renderDecodedData = (str) => {
		const arr = snakeCaseToTitleCase(str).split(' ');
		// arr.pop();
		return arr.join(' ');
	};

	const renderDNAMapping = (key) => {
		// Check thats it is a string and defined
		if (typeof key !== 'string' && key !== undefined) {
			return 'Unknown';
		}

		return (
			<div
				id='decoder-results'
				key={key}
				style={{
					display: 'flex',
					justifyContent: 'center',
					gap: '1rem',
				}}
			>
				<strong>{renderDecodedData(key)}: </strong>{' '}
				{key.endsWith('_color') ? (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								backgroundColor: decodedData[key].hex,
								border: '2px white solid',
								aspectRatio: '1',
								height: '1.5rem',
								borderRadius: '50%',
								marginRight: '0.5rem',
								marginTop: '0.7rem',
							}}
						/>
						{isValidDNA(decodedData[key])
							? addSpaceBeforeNumbers(
									camelCaseToTitleCase(decodedData[key].name),
								)
							: 'Unknown'}
					</div>
				) : isValidDNA(decodedData[key]) ? (
					snakeCaseToTitleCase(
						addSpaceBeforeNumbers(
							replaceDashesAndUnderscores(
								decodedData[key].toString(),
							),
						),
					)
				) : (
					'Unknown'
				)}
			</div>
		);
	};

	return (
		<div>
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
				<Typography
					variant='h4'
					id='decoded-data'
					style={{
						marginTop: '20px',
						fontSize: '1.75rem',
						lineHeight: '1.7',
						color: '#f5f4ff',
					}}
				>
					<div>
						{Object.keys(decodedData).map((key) =>
							renderDNAMapping(key),
						)}
					</div>
				</Typography>
			)}
		</div>
	);
}

export default DNADecoder;
