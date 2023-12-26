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
		mobile: 600,
		desktop: 1200,
	},
};

// https://mui.com/material-ui/customization/palette/
/** @type {Partial<ThemeOptions['palette']>} */
const palette = {
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
};

// https://mui.com/material-ui/customization/typography/
/** @type {Partial<ThemeOptions['typogra phy']>} */
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

// https://mui.com/material-ui/react-css-baseline/
/** @type {Partial<ThemeOptions['components']} */
const globalStyles = {
	MuiCssBaseline: {
		/**@type {Record<string, import('@mui/material').CSSObject>} */
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

			/**@type {Record<string, import('@mui/material').CSSObject>} */
			[`@media (min-width:${breakpoints.values.mobile}px)`]: {
				'#content-main': {
					paddingLeft: '20%',
					paddingRight: '20%',
				},
			},
		},
	},
};

// https://mui.com/material-ui/customization/theme-components/
const componentStyles = {
	MuiAppBar: {
		/**@type {Record<string, import('@mui/material').CSSObject>} */
		styleOverrides: {
			root: {
				backgroundColor: konduxColors['gradient-violet'],
			},
		},
	},

	MuiTabs: {
		/**@type {Record<string, import('@mui/material').CSSObject>} */
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
		/**@type {Record<string, import('@mui/material').CSSObject>} */
		styleOverrides: {
			root: {
				backgroundColor: '#ffffff',
				marginBottom: '6rem',
				'&:hover': {
					backgroundColor: '#d7d7d7',
				},
			},
		},
	},

	MuiFormControl: {
		/**@type {Record<string, import('@mui/material').CSSObject>} */
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
	components: { ...globalStyles, ...componentStyles },
});

export default theme;
