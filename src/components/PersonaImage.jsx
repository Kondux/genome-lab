import React, { useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

function PersonaImage({ dna }) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const handleLoad = () => {
		setLoading(false);
	};

	const handleError = () => {
		setLoading(false);
		setError(true);
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
			{loading && <CircularProgress />}
			{error ? (
				<Typography color="error">Couldn't find persona photo</Typography>
			) : (
				<img
					src={`https://5x1vj0debk.execute-api.us-east-1.amazonaws.com/default/fetch_persona_photo_from_dna?dna=0x${dna}`}
					alt="Persona"
					onLoad={handleLoad}
					onError={handleError}
					style={{ display: loading ? 'none' : 'block', maxWidth: '100%', maxHeight: '100%' }}
				/>
			)}
		</Box>
	);
}

export default PersonaImage;
