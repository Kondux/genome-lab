// App.js
import React, { useState, useCallback, Suspense, lazy } from 'react';
import { AppBar, Tabs, Tab, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';

// Use lazy loading for DNAEncoder and DNADecoder
const LazyDNAEncoder = lazy(() => import('./components/DNAEncoder'));
const LazyDNADecoder = lazy(() => import('./components/DNADecoder'));

// Create a custom theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Cyan color
    },
    background: {
      default: '#000000', // Black background
      paper: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black for paper elements
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#00ffff', // Cyan for secondary text
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#00ffff',
          '&.Mui-selected': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 255, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 255, 0.7)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ffff',
            },
          },
        },
      },
    },
  },
});

const tabVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

function App() {
	const [tabValue, setTabValue] = useState(0);
	const [particleColor, setParticleColor] = useState('#00ffff'); // Default cyan color

	const handleTabChange = useCallback((event, newValue) => {
		setTabValue(newValue);
	}, []);

	const handleCollectionTypeChange = useCallback((newColor) => {
		setParticleColor(newColor);
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Box sx={{ 
				flexGrow: 1, 
				height: '100vh', 
				display: 'flex', 
				flexDirection: 'column', 
				position: 'relative', 
				overflow: 'hidden',
				background: 'linear-gradient(to bottom, #000000, #001a33)', // Dark gradient background
			}}>
				<ParticleBackground color={particleColor} />
				<AppBar position='static' sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						aria-label='DNA tabs'
						centered
						TabIndicatorProps={{
							style: {
								backgroundColor: '#00ffff',
								height: '3px',
								boxShadow: '0 0 10px #00ffff',
							},
						}}
					>
						<Tab label='Decode DNA' />
						<Tab label='Encode DNA' />
					</Tabs>
				</AppBar>
				<Box 
					id='content-main' 
					p={4} 
					sx={{ 
						flexGrow: 1, 
						overflow: 'auto', 
						zIndex: 1, 
						position: 'relative',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'flex-start',
					}}
				>
					<Box 
						sx={{ 
							maxWidth: '800px', 
							width: '100%', 
							backgroundColor: 'rgba(0, 0, 0, 0.7)',
							backdropFilter: 'blur(10px)',
							borderRadius: '10px',
							padding: '20px',
							boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
						}}
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={tabValue}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ duration: 0.5 }}
							>
								<Suspense fallback={<div>Loading...</div>}>
									{tabValue === 0 && <LazyDNADecoder />}
									{tabValue === 1 && (
										<LazyDNAEncoder onCollectionTypeChange={handleCollectionTypeChange} />
									)}
								</Suspense>
							</motion.div>
						</AnimatePresence>
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default React.memo(App);
