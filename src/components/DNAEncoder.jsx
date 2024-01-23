import React, { useState, useEffect } from 'react';
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Slider,
	Typography,
	Switch,
	IconButton,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import {
	snakeCaseToTitleCase,
	replaceDashesAndUnderscores,
	camelCaseToTitleCase,
	addSpaceBeforeNumbers,
	toTitleCase,
} from './util';

// Import the color palette
import geneColorPalette from '../data/gene_color_pallet.json';

// Encoder functions
const encodeInt = (value, byteSize) => {
	return parseInt(value)
		.toString(16)
		.padStart(byteSize * 2, '0');
};

function DNAEncoder() {
	const [protocolVersion] = useState(1); // Fixed protocol version
	const [stakingBoost, setStakingBoost] = useState(0); // NFT boost determined by slider
	const [collectionType, setCollectionType] = useState('');
	const [collectionTypes, setCollectionTypes] = useState({});
	const [dnaKey, setDnaKey] = useState(null);
	const [inputValues, setInputValues] = useState({});
	const [errorValues, setErrorValues] = useState({});

	useEffect(() => {
		if (protocolVersion)
			import('../data/protocol_versions.json').then((data) => {
				setCollectionTypes(data[`v${protocolVersion}`]);
			});
		if (collectionType) {
			import(`../../data/DNA_keys/${collectionType}_DNA_key_v1.json`)
				.then((key) => {
					setDnaKey(key.default);
					const initialInputValues = {};
					const initialErrorValues = {};
					Object.keys(key.default.genes).forEach((gene) => {
						initialInputValues[gene] = '';
						initialErrorValues[gene] = false;
					});
					setInputValues(initialInputValues);
					setErrorValues(initialErrorValues);
				})
				.catch((error) =>
					console.error('Error loading DNA key file:', error),
				);
		}
	}, [protocolVersion, collectionType]);

	const handleInputChange = (e, gene) => {
		// Specialized input parsing
		let temp = gene.split('_');
		let geneType = temp[temp.length - 1];
		let value;
		if (geneType === 'bool') {
			value = e.target.checked ? '01' : '00';
		} else {
			value = e.target.value;
		}

		// Specialized error checking
		let isError = false;
		if (geneType === 'int') {
			const numBytes = dnaKey.genes[gene];
			const minimum = 0;
			const maximum = Math.pow(2, numBytes * 8) - 1;

			const parsedValue = parseInt(value, 10);
			const isNonEmpty = value !== '';
			const isValidInteger =
				!isNaN(parsedValue) && parsedValue.toString() === value;
			const isInRange = parsedValue >= minimum && parsedValue <= maximum;

			isError = isNonEmpty && (!isValidInteger || !isInRange);
		}

		setErrorValues((prev) => ({ ...prev, [gene]: isError }));
		if (!isError) {
			setInputValues((prev) => ({ ...prev, [gene]: value }));
		} else {
			setTimeout(
				() => setErrorValues((prev) => ({ ...prev, [gene]: !isError })),
				500,
			);
		}
	};

	const renderInputFields = () => {
		if (!dnaKey) return null;

		// Skip the first three genes (protocol version, NFT boost, collection type)
		const genesArray = Object.entries(dnaKey.genes).slice(3);

		return genesArray.map(([gene, _]) => {
			if (gene.endsWith('_id')) {
				const optionsKey = `${gene}s`;
				const options = dnaKey[optionsKey];
				return (
					<FormControl key={gene} fullWidth margin='normal'>
						<InputLabel id={`${gene}-label`}>
							{snakeCaseToTitleCase(gene)}
						</InputLabel>
						<Select
							labelId={`${gene}-label`}
							value={inputValues[gene]}
							onChange={(e) => handleInputChange(e, gene)}
							label={snakeCaseToTitleCase(gene)}
						>
							{Object.entries(options).map(([name, value]) => (
								<MenuItem key={value} value={value}>
									{addSpaceBeforeNumbers(
										replaceDashesAndUnderscores(name),
									)}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				);
			} else if (gene.endsWith('_int')) {
				return (
					<TextField
						key={gene}
						label={snakeCaseToTitleCase(gene)}
						type='text'
						value={inputValues[gene]}
						onChange={(e) => handleInputChange(e, gene)}
						fullWidth
						margin='normal'
						error={errorValues[gene]}
					/>
				);
			} else if (gene.endsWith('_color')) {
				return (
					<FormControl key={gene} fullWidth margin='normal'>
						<InputLabel id={`${gene}-label`}>
							{snakeCaseToTitleCase(gene)}
						</InputLabel>
						<Select
							labelId={`${gene}-label`}
							value={snakeCaseToTitleCase(inputValues[gene])}
							onChange={(e) => handleInputChange(e, gene)}
							label={snakeCaseToTitleCase(gene)}
						>
							{Object.entries(geneColorPalette).map(
								([key, { name, hex }]) => (
									<MenuItem
									key={key}
									value={key}
									>
									<div
										style={{
											backgroundColor: hex,
											border: '2px white solid',
											aspectRatio: '1',
											height: '1rem',
											borderRadius: '50%',
											marginRight: '0.5rem',
										}}
									/>
										{addSpaceBeforeNumbers(
											camelCaseToTitleCase(
												replaceDashesAndUnderscores(
													name,
												),
											),
										)}
									</MenuItem>
								),
							)}
						</Select>
					</FormControl>
				);
			} else if (gene.endsWith('_bool')) {
				return (
					<FormControl key={gene} fullWidth margin='normal'>
						<Typography>{snakeCaseToTitleCase(gene)}</Typography>
						<Switch
							checked={inputValues[gene] === '01'}
							onChange={(e) => handleInputChange(e, gene)}
						/>
					</FormControl>
				);
			} else {
				return (
					<TextField
						key={gene}
						label={snakeCaseToTitleCase(gene)}
						value={inputValues[gene]}
						onChange={(e) => handleInputChange(e, gene)}
						fullWidth
						margin='normal'
					/>
				);
			}
		});
	};

	const encodeDNA = () => {
		if (!dnaKey) return '';

		let dnaString = '';
		dnaString += encodeInt(protocolVersion, 1); // Fixed protocol version
		dnaString += encodeInt(stakingBoost, 1); // Encoding staking boost

		dnaString += Object.keys(collectionTypes).find(
			(key) => collectionTypes[key] === collectionType,
		);

		// Encoding collection type
		Object.entries(dnaKey.genes)
			.slice(3)
			.forEach(([gene, length]) => {
				const value = inputValues[gene];

				// If the value is not set yet, encode it as # for the length
				if (!value) {
					dnaString += '#'.repeat(length * 2);
					return;
				}

				// Encode the value
				if (
					gene.endsWith('_id') ||
					gene.endsWith('_color') ||
					gene.endsWith('_bool')
				) {
					// dnaString += encodeId(value, dnaKey[`${gene}s`]);
					dnaString += value;
				} else if (gene.endsWith('_int')) {
					dnaString += encodeInt(value, length);
				} else {
					dnaString += encodeInt(value, length);
				}
			});

		return dnaString.toUpperCase();
	};

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(encodeDNA()).then(
			() => {
				// Handle successful copy
				console.log('DNA copied to clipboard');
			},
			(error) => {
				// Handle error
				console.error('Failed to copy DNA to clipboard: ', error);
			},
		);
	};

	return (
		<div>
			<Typography variant='h5'>
				{encodeDNA()}
				{collectionType ? (
					<IconButton
						onClick={handleCopyToClipboard}
						aria-label='copy'
						style={{ height: '100%' }}
					>
						<ContentCopy />
					</IconButton>
				) : null}
			</Typography>
			<FormControl fullWidth margin='normal'>
				<InputLabel id='collection-type-label'>
					Collection Type
				</InputLabel>
				<Select
					labelId='collection-type-label'
					value={collectionType}
					label='Collection Type'
					onChange={(e) => setCollectionType(e.target.value)}
				>
					{Object.values(collectionTypes)
						.reverse()
						.map((type) => {
							return (
								<MenuItem key={type} value={type}>
									{toTitleCase(type)}
								</MenuItem>
							);
						})}
				</Select>
			</FormControl>

			{collectionType ? (
				<>
					<Typography gutterBottom>
						Staking Boost: {stakingBoost}%
					</Typography>
					<Slider
						value={stakingBoost}
						onChange={(e, val) => setStakingBoost(val)}
						min={0}
						max={100}
					/>
				</>
			) : null}

			{renderInputFields()}
		</div>
	);
}

export default DNAEncoder;
