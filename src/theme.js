/**
 * @typedef {import('@mui/material/styles').ThemeOptions} ThemeOptions
 */

import { createTheme } from '@mui/material/styles';

const konduxColors = {
	'accent-blue': '#2DE4C1',
	'gradient-violet': '#300D50',
	'gradient-pink': '#E702BF',
	'gradient-orange': '#F47900',
	'gradient-red': '#EC5046',
};

// https://mui.com/material-ui/customization/breakpoints/
/** @type {Partial<ThemeOptions['breakpoints']>} */
const breakpoints = {
	values: {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1280,
		xl: 1920,
	},
};

// https://mui.com/material-ui/customization/palette/
/** @type {Partial<ThemeOptions['palette']>} */
const palette = {
	mode: 'dark',
	primary: {
		main: konduxColors['accent-blue'],
	},
};

// https://mui.com/material-ui/customization/typography/
/** @type {Partial<ThemeOptions['typography']>} */
const typography = {
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
};

// https://mui.com/material-ui/customization/theme-components/
/** @type {Partial<ThemeOptions['components']} */
const components = {
	// Global Styles
	MuiCssBaseline: {
		styleOverrides: {
			html: {
				height: '100%',
				textAlign: 'center',
			},
			body: {
				height: '100%',
				backgroundImage: `linear-gradient(${konduxColors['gradient-pink']}, ${konduxColors['gradient-violet']})`,
				backgroundRepeat: 'no-repeat',
				backgroundAttachment: 'fixed',
			},
		},
	},
	// Component Styles
	MuiAppBar: {
		styleOverrides: {
			root: {
				backgroundColor: konduxColors['gradient-violet'],
			},
		},
	},
	MuiTabs: {
		styleOverrides: {
			flexContainer: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-evenly',
			},

			indicator: {
				backgroundColor: 'white',
			},
		},
	},
	MuiButton: {
		styleOverrides: {
			root: {
				backgroundColor: konduxColors['accent-orange'],
			},
		},
	},
	MuiFormControl: {
		styleOverrides: {
			root: {
				textAlign: 'left',
			},
		},
	},
};

const theme = createTheme({
	breakpoints: breakpoints,
	palette: palette,
	typography: typography,
	components: components,
});

export default theme;
