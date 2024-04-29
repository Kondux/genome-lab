// DNADecoder.js
import React, { useState } from 'react';
import {
	TextField,
	Button,
	Typography,
	InputAdornment,
	IconButton,
} from '@mui/material';
import ContentPaste from '@mui/icons-material/ContentPaste';
import geneColorPalette from '../data/gene_color_pallet.json';
import protocolVersions from '../data/protocol_versions.json';
import {
	replaceDashesAndUnderscores,
	addSpaceBeforeNumbers,
	camelCaseToTitleCase,
	snakeCaseToTitleCase,
} from '../util';
import ColorIndicator from './ColorIndicator';
import PersonaImage from './PersonaImage';

function DNADecoder() {
	const [dnaString, setDnaString] = useState('');
	const [decodedData, setDecodedData] = useState(null);
	const [submittedDNA, setSubmittedDNA] = useState('');
	const [isPersonaImageOpen, setIsPersonaImageOpen] = useState(false);

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
		let lastIsVoidCascade = false;

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
				if (!lastIsVoidCascade) {
					lastIsVoidCascade = false;
					decodedResults[gene] = decodeColor(geneValue.toUpperCase());
				}
			} else if (gene.endsWith('_cascade')) {
				const result = decodeCascade(
					geneValue,
					key[`${gene}`],
					decodedResults,
				);
				if (result !== 'Unknown') {
					decodedResults[gene] = result;
				} else {
					lastIsVoidCascade = true;
				}
			} else if (gene.endsWith('_tkn')) {
				// For now, just decode as int
				decodedResults[gene] = parseInt(geneValue, 16);
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

	const decodeCascade = (value, keyMapping, decodedResults) => {
		// First, get the reference gene for the cascade
		const refGenes = keyMapping['reference_genes'];
		const cascadeType = keyMapping['cascade_type'];
		let currentKey = keyMapping;
		// itterate over the reference genes
		for (let i = 0; i < refGenes.length; i++) {
			const refGene = refGenes[i];
			const refGeneValue = decodedResults[refGene];
			if (refGeneValue) {
				currentKey = currentKey[refGeneValue];
			}
		}
		// Now you should be at the end cascade
		// TODO: seperate this out from both decode DNA and decode Cascade as a seperate function
		if (cascadeType === 'id') {
			return decodeId(value, currentKey);
		} else if (cascadeType === 'int') {
			return parseInt(value, 16);
		} else if (cascadeType === 'bool') {
			return value === '01';
		} else if (cascadeType === 'color') {
			return decodeColor(value.toUpperCase());
		}
	};

	const handleSubmit = () => {
		// Set the DNA key
		if (!dnaString) return;

		// Extract the collection gene (hardcoded position)
		const collectionGene = dnaString.slice(4, 6).toLowerCase();

		// Set the DNA key to avoid re-renders before decoding
		setSubmittedDNA(dnaString);
		// probably should be somewhere else and done a different way but for now this works
		// basically if the collection gene is 01 then it's a persona, and we need to display the persona image
		collectionGene === '01'? setIsPersonaImageOpen(true) : setIsPersonaImageOpen(false);

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
		let inputValue = event.target.value;
		// Check if the input starts with "0x" and remove it
		if (inputValue.startsWith('0x')) {
			inputValue = inputValue.substring(2);
		}
		setDnaString(inputValue);
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

	const handlePaste = async () => {
		try {
			let text = await navigator.clipboard.readText();
			// Remove "0x" from the start of the text if present
			if (text.startsWith('0x')) {
				text = text.substring(2);
			}
			setDnaString(text);
		} catch (error) {
			console.error('Failed to read clipboard contents:', error);
		}
	};
	

	return (
		<div>
			<TextField
				fullWidth
				label='DNA String'
				value={dnaString}
				onChange={handleDnaStringChange}
				margin='normal'
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton
								onClick={handlePaste}
								edge='end'
								title='Paste'
							>
								<ContentPaste />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<Button variant='contained' onClick={handleSubmit}>
				Decode DNA
			</Button>
			{/* If the DNA is a persona, display persona image*/}
			{
				isPersonaImageOpen ? (
					<PersonaImage dna={submittedDNA} />
				) : null
			}
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
