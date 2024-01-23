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
import ColorIndicator from './ColorIndicator';

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

	const handleSubmit = () => {
		// Set the DNA key
		if (!dnaString) return;

		// Extract the collection gene (hardcoded position)
		const collectionGene = dnaString.slice(4, 6);

		// Determine the correct DNA key
		const collectionType = protocolVersions['v1'][collectionGene];
		if (collectionType) {
			import(`../data/DNA_keys/${collectionType}_DNA_key_v1.json`)
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

	const renderGeneByKey = (key) => {
		const geneType = key.split('_').pop();
		switch (geneType) {
			case 'color':
				return (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<ColorIndicator
							color={decodedData[key].hex}
							margin='0 0.5rem 0 0'
						/>
						{addSpaceBeforeNumbers(
							camelCaseToTitleCase(decodedData[key].name),
						) || 'Unknown'}
					</div>
				);
			case 'id':
				return (
					snakeCaseToTitleCase(
						addSpaceBeforeNumbers(
							replaceDashesAndUnderscores(
								decodedData[key].toString(),
							),
						),
					) || 'Unknown'
				);
			case 'int':
				return isNaN(decodedData[key]) ? 'Unknown' : decodedData[key];
			case 'bool':
				return decodedData[key] ? 'Yes' : 'No';
			default:
				return decodedData[key];
		}
	};

	const renderDNAMapping = (key) => {
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
				<strong>{snakeCaseToTitleCase(key)}: </strong>{' '}
				{renderGeneByKey(key)}
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
