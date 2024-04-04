// App.js
import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';

import DNAEncoder from './components/DNAEncoder';
import DNADecoder from './components/DNADecoder';

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
					<Tab label='Decode DNA' />
					<Tab label='Encode DNA' />
				</Tabs>
			</AppBar>
			<Box id='content-main' p={3}>
				{tabValue === 0 && <DNADecoder />}
				{tabValue === 1 && <DNAEncoder />}
			</Box>
		</Box>
	);
}

export default App;
