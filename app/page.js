'use client'
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Button, Box, Grid, Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, teal } from '@mui/material/colors';


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

export default function Home() {

  const router = useRouter();
  const {isLoaded, isSignedIn} = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // if the user is signed in, redirect to another user dashboard page
      router.push("/userDashboard"); 
    }
  }, [isLoaded, isSignedIn, router]);


  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',  // change once site is deployed
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  } 

  

  return (
    <ThemeProvider theme={theme}>
    <Box maxWidth="100vw" sx={{ backgroundColor: theme.palette.background.default}}>
      <Head>
        <title>SmartCardsAI</title>
        <meta name = "description" content = 'Create flashcard from your text' />
      </Head>
      <AppBar position="sticky" color="secondary" sx={{ boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            SmartCardsAI
          </Typography>
          {/* if signed out, display log in or sign up button */}
          <SignedOut>
            <Stack direction="row" spacing={2}>
              <Button color="inherit" href="/sign-in">Log In</Button>
              <Button variant="contained" color="primary" href="/sign-up">Sign Up</Button>  
            </Stack>
          </SignedOut>
          {/* if signed in, display user icon */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* hero/landing page container */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}
        height="75vh">
        <Typography variant="h3" textAlign="center" sx={{maxWidth: "80vw", fontWeight: 'bold'}}gutterBottom>Tired of an endless cycle of creating flashcards?</Typography>
        <Typography variant="h5" textAlign="center">Let us do the hard part.</Typography>
        <Button variant="contained" color="primary" sx={{mt:2, pt:1, pb:1}} href="/sign-up">Get Started Today</Button>
      </Box>

      {/* features container */}
      <Box sx={{my: 6}}> 
        <Typography variant="h6" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing = {4}>
          <Grid item xs={12} md={4} >
            <Typography variant = "h6">Easy Text Input</Typography>
            <Typography>
              {'  '}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} >
            <Typography variant = "h6">Smart Flashcards</Typography>
            <Typography>
              {'  '}
              Our Ai intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} >
            <Typography variant = "h6">Accessible Anywhere</Typography>
            <Typography>
              {'  '}
              Access you flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* pricing container */}
      <Box sx={{ textAlign: 'center'}}>
        <Typography variant="h4" align="center" gutterBottom>
            Pricing
        </Typography>
        <Grid container spacing = {4} display="flex">
          <Grid item xs={12} md={6} >
            <Box sx={{p: 3, border: "1px solid", borderRadius: 2}}>
              <Typography variant = "h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography>
                {'  '}
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} >
            <Box sx={{p: 3, border: "1px solid", borderRadius: 2}}>
                <Typography variant = "h5" gutterBottom>Pro</Typography>
                <Typography variant="h6" gutterBottom>$10 / month</Typography>
                <Typography>
                  {'  '}
                  Simply input your text and let our software do the rest. Creating flashcards has never been easier.
                </Typography>
                <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleSubmit}>Choose Pro</Button>
              </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </ThemeProvider>
  );
}
