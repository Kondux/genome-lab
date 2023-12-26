// App.js
import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';

import DNAEncoder from './components/DNAEncoder/DNAEncoder';
import DNADecoder from './components/DNADecoder/DNADecoder';

function App() {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='static'>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label='DNA tabs'
				>
					<Tab label='Encode DNA' />
					<Tab label='Decode DNA' />
				</Tabs>
			</AppBar>
			<Box id='content-main' p={3}>
				{tabValue === 0 && <DNAEncoder />}
				{tabValue === 1 && <DNADecoder />}
			</Box>
		</Box>
	);
}

export default App;
