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
		mobile: 800,
		desktop: 1200,
	},
};

const theme = createTheme({
	breakpoints: breakpoints,
	// https://mui.com/material-ui/customization/palette/
	palette: {
		mode: 'dark',
		primary: {
			main: konduxColors['accent-blue'],
		},
		warning: {
			main: konduxColors['gradient-orange'],
		},
		error: {
			main: konduxColors['gradient-red'],
		},
	},
	// https://mui.com/material-ui/customization/typography/
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
	components: {
		// https://mui.com/material-ui/react-css-baseline/
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

				[`@media (max-width:${breakpoints.values.mobile}px)`]: {
					'#decoder-results': {
						fontSize: '80%',
					},
				},
				[`@media (min-width:${breakpoints.values.mobile}px)`]: {
					'#content-main': {
						paddingLeft: '20%',
						paddingRight: '20%',
					},
				},
			},
		},
		MuiAppBar: {
			/**@type {Record<string, import('@mui/material').CSSObject>} */
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
					justifyContent: 'center',
					gap: '7rem',
				},
				indicator: {
					backgroundColor: 'white',
				},
			},
		},

		MuiButton: {
			styleOverrides: {
				root: {
					backgroundColor: konduxColors['accent-blue'],
					color: '#000000',
					fontWeight: 'bold',
					'&:hover': {
						backgroundColor: '#1BC3A1',
					},
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
		MuiSelect: {
			styleOverrides: {
				select: {
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: 'rgba(255, 255, 255, 0.23)',
						},
						'&:hover fieldset': {
							borderColor: 'rgba(255, 255, 255, 0.5)',
						},
						'&.Mui-focused fieldset': {
							borderColor: konduxColors['accent-blue'],
						},
					},
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					fontSize: '1rem',
					fontWeight: 'bold',
					'&.Mui-selected': {
						color: konduxColors['accent-blue'],
					},
				},
			},
		},
	},
});

export default theme;
