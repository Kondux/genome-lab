// DNADecoder.js
import React, { useState } from 'react';
import {
	TextField,
	Button,
	Typography,
	InputAdornment,
	IconButton,
	Box,
	Paper,
	Grid,
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
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const GlowingPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: 'rgba(0, 0, 0, 0.6)',
	boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
	transition: 'box-shadow 0.3s ease-in-out',
	'&:hover': {
		boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
	},
}));

const FuturisticButton = styled(Button)(({ theme }) => ({
	background: 'linear-gradient(45deg, #00ffff 30%, #0088ff 90%)',
	border: 0,
	borderRadius: 3,
	boxShadow: '0 3px 5px 2px rgba(0, 255, 255, .3)',
	color: '#000000',
	height: 48,
	padding: '0 30px',
	transition: 'all 0.3s ease-in-out',
	'&:hover': {
		boxShadow: '0 6px 10px 4px rgba(0, 255, 255, .5)',
	},
}));

function DNADecoder() {
	const [dnaString, setDnaString] = useState('');
	const [localDecodedData, setLocalDecodedData] = useState(null);
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
		if (!dnaString) return;

		const collectionGene = dnaString.slice(4, 6).toLowerCase();
		setSubmittedDNA(dnaString);
		collectionGene === '01' ? setIsPersonaImageOpen(true) : setIsPersonaImageOpen(false);

		const collectionType = protocolVersions['v1'][collectionGene];
		if (collectionType) {
			import(`../data/DNA_keys/${collectionType}_DNA_key_v1.json`)
				.then((key) => {
					const decodedResults = decodeDNA(key.default);
					setLocalDecodedData(decodedResults);
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
							color={localDecodedData[key].hex}
							margin='0 0.5rem 0 0'
						/>
						{addSpaceBeforeNumbers(
							camelCaseToTitleCase(localDecodedData[key].name),
						) || 'Unknown'}
					</div>
				);
			case 'id':
				return (
					snakeCaseToTitleCase(
						addSpaceBeforeNumbers(
							replaceDashesAndUnderscores(
								localDecodedData[key].toString(),
							),
						),
					) || 'Unknown'
				);
			case 'int':
				return isNaN(localDecodedData[key]) ? 'Unknown' : localDecodedData[key];
			case 'bool':
				return localDecodedData[key] ? 'Yes' : 'No';
			default:
				return localDecodedData[key];
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
		<Box sx={{ maxWidth: 600, margin: '0 auto' }}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<TextField
					fullWidth
					label='DNA String'
					value={dnaString}
					onChange={handleDnaStringChange}
					margin='normal'
					variant='outlined'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onClick={handlePaste}
									edge='end'
									title='Paste'
									sx={{ color: '#00ffff' }}
								>
									<ContentPaste />
								</IconButton>
							</InputAdornment>
						),
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: '#00ffff',
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: '#0088ff',
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: '#00ffff',
							},
							color: '#00ffff',
						},
					}}
					InputLabelProps={{
						sx: { color: '#00ffff' },
					}}
				/>
				<FuturisticButton onClick={handleSubmit} fullWidth sx={{ mt: 2, mb: 4 }}>
					Decode DNA
				</FuturisticButton>
			</motion.div>

			{isPersonaImageOpen && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<Box sx={{ mt: 2, mb: 4 }}>
						<PersonaImage dna={submittedDNA} />
					</Box>
				</motion.div>
			)}

			{localDecodedData && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<GlowingPaper elevation={3} sx={{ p: 3 }}>
						<Typography variant='h5' gutterBottom sx={{ color: '#00ffff' }}>
							Decoded Data
						</Typography>
						<Grid container spacing={2}>
							{Object.keys(localDecodedData).map((key) => (
								<Grid item xs={12} sm={6} key={key}>
									{renderDNAMapping(key)}
								</Grid>
							))}
						</Grid>
					</GlowingPaper>
				</motion.div>
			)}
		</Box>
	);
}

export default DNADecoder;
