import { createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const konduxColors = {
	'accent-blue': '#2DE4C1',
	'gradient-violet': '#300D50',
	'gradient-pink': '#E702BF',
	'gradient-orange': '#F47900',
	'gradient-red': '#EC5046',
};

// https://mui.com/material-ui/customization/typography/
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

// https://mui.com/material-ui/customization/palette/
const palette = {
	mode: 'dark',
	primary: {
		main: konduxColors['accent-blue'],
	},
};

// TODO: Figure out a way to add autocompletion here
const globalStyles = {
    '@global': {
        '@root':{
            alignItems: 'center',
            textAlign: 'center',
        } 
    }
};

// https://mui.com/material-ui/customization/theming/
const theme = createTheme({
	palette: palette,
	typography: typography,
	components: {
		MuiCssBaseline: {
			styleOverrides: globalStyles,
		},
	},
});

export default theme;
