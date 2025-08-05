import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Vert nature
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8BC34A', // Vert clair
      light: '#AED581',
      dark: '#689F38',
      contrastText: '#fff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E3440',
      secondary: '#5E6472',
    },
    success: {
      main: '#66BB6A',
    },
    info: {
      main: '#42A5F5',
    },
    warning: {
      main: '#FFA726',
    },
    error: {
      main: '#EF5350',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 600,
      fontSize: '3.5rem',
      color: '#2E3440',
    },
    h2: {
      fontFamily: '"Dancing Script", cursive',
      fontWeight: 500,
      fontSize: '2.8rem',
      color: '#2E3440',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#2E3440',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#2E3440',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#2E3440',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#2E3440',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#5E6472',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(76, 175, 80, 0.1)',
    '0px 4px 8px rgba(76, 175, 80, 0.15)',
    '0px 8px 16px rgba(76, 175, 80, 0.2)',
    '0px 12px 24px rgba(76, 175, 80, 0.25)',
    ...Array(20).fill('0px 16px 32px rgba(76, 175, 80, 0.3)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '10px 30px',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(76, 175, 80, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;