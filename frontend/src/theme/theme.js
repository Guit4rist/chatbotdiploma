// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const darkBlue = '#0D1B2A';      // Deep navy
const lightBlue = '#1B263B';     // Slightly lighter for background
const accentBlue = '#415A77';    // Accent / primary
const softWhite = '#E0E1DD';     // Text on dark
const trueWhite = '#FFFFFF';     // For paper, contrast, etc.

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: accentBlue,
      contrastText: trueWhite,
    },
    background: {
      default: '#0c2749',
      paper: lightBlue,
    },
    text: {
      primary: softWhite,
      secondary: '#B0B4BA',
    },
    divider: '#2D3A4A',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkBlue,
          borderBottom: '1px solid #2D3A4A',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: lightBlue,
          color: softWhite,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: '#2D3A4A',
          },
        },
      },
    },
  },
});

export default theme;
