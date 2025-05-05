import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#708090', // Slate Gray
      light: '#8F9EAC',
      dark: '#566270',
      contrastText: '#FFFFFF' // White text for better readability
    },
    secondary: {
      main: '#E6B8B8', // Blush Pink
      light: '#F0D4D4',
      dark: '#D19C9C',
      contrastText: '#2D3748' // Dark grey for contrast
    },
    error: {
      main: '#D32F2F' // Standard red for errors
    },
    warning: {
      main: '#ED6C02' // Standard orange
    },
    info: {
      main: '#B399D4', // Soft Purple
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#9CAF88', // Sage Green
      contrastText: '#2D3748'
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#E0E0E0' // Light Grey
    },
    text: {
      primary: '#2D3748', // Dark grey for text
      secondary: '#4A5568' // Lighter grey
    },
    action: {
      active: '#708090' // Slate Grey for interactive elements
    }
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      color: '#708090', // Slate Grey
      fontWeight: 600
    },
    button: {
      textTransform: 'none' // Disable auto-uppercase
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px'
        }
      },
      variants: [
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {
            border: '2px solid #E6B8B8'
          }
        }
      ]
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #708090 0%, #8F9EAC 100%)'
        }
      }
    }
  },
  shape: {
    borderRadius: 8 // Rounded corners
  }
});

export default theme;