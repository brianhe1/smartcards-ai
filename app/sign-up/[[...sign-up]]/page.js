'use client'
import {AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import {SignUp} from "@clerk/nextjs";
import Link from 'next/link'

// theme imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { grey, teal, blue, cyan, green, orange, pink, lightBlue, red} from '@mui/material/colors';

// site theme
const theme = createTheme({
    typography: {
      fontFamily: '"Poppins", "Lato", "Arial", sans-serif',
    },
    palette: {
      background: {
        default: grey[100],  // set the default background color for the whole app
      },
      primary: {
        main: teal[500],    // primary color
      },
      secondary: {
        main: "#ffffff",    // secondary color
      },
    }
  });

export default function SignUpPage() {
    return (
    <ThemeProvider theme={theme}>
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} passHref>
                            SmartCardsAI
                        </Link>
                    </Typography>
                    <Button color="inherit" href="/sign-in">Log In</Button>
                    <Button color="inherit" href="/sign-up">Sign Up</Button>
                </Toolbar>
            </AppBar>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{height: "100vh"}}
            >
                <Typography variant="h4" sx={{fontWeight: "bold", mb: 4}}>Unlock Your Learning Potential! 🔓</Typography>
                <SignUp />
            </Box>
        </Box>
    </ThemeProvider>
    )
}