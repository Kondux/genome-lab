import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'normalize.css';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
	palette: {
		mode: 'dark',
	},
	typography: {
		fontFamily: [
			'Poppins',
			'Rubik',
			'-apple-system',
			'BlinkMacSystemFont',
			"'Segoe UI'",
			'Roboto',
			"'Helvetica Neue'",
			'Arial',
			'sans-serif',
		].join(', '),
	},
});

root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
