// theme.js (or similar file)
import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: { // Targets the paper element of the Menu
          backgroundColor: '#1f2937', // Example: red background
          // You can also add other CSS properties here
        },
      },
    },
    MuiMenuItem: { // Targets individual menu items
      styleOverrides: {
        root: {
          color: 'white', // Example: white text
          fontSize: '14px',
          '&:hover': { // Style on hover
            backgroundColor: '#f4c40c',
            color: 'black', // Example: darker red on hover
          },
        },
      },
    },
  },
});

export default customTheme;