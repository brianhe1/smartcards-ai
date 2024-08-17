'use client'
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Button, Box, Grid, Stack, Paper} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { grey, teal, blue, cyan, green, orange, pink, lightBlue} from '@mui/material/colors';


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

const FeatureCard = styled(Paper)(({ theme, bgcolor }) => ({
  width: 310,
  height: 390,
  padding: theme.spacing(2),
  ...theme.typography.body2,  // body text types to match that defined in theme const
  textAlign: 'center',
  backgroundColor: bgcolor || '#ffffff',
  borderRadius: '25px',
  transition: 'transform 0.3s ease',  // smooth transition for scaling
  '&:hover': {
    transform: 'scale(1.05)',  // scale up the card by 5% on hover
  },
}));

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
        height="70vh">
        <Typography variant="h3" textAlign="center" sx={{maxWidth: "80vw", fontWeight: 'bold'}}gutterBottom>Tired of an endless cycle of creating flashcards?</Typography>
        <Typography variant="h5" textAlign="center">Let us do the hard part.</Typography>
        <Button variant="contained" color="primary" sx={{mt:2, pt:1, pb:1}} href="/sign-up">Get Started Today</Button>
      </Box>

      {/* features container */}
      <Box display="flex" justifyContent="center" sx={{width: "100%", my: 3, overflowX: "auto", mb: 8}}>
        <Stack direction="row" spacing={6} sx={{ m: 4, justifyContent: 'center', minWidth: 'max-content'}}>
            <FeatureCard bgcolor={pink[200]}>
              <Typography variant = "h6" sx={{ fontWeight: 'bold', my: 2 }} gutterBottom>Instant Flashcard Creation</Typography>
              <Typography>
                Provide a topic, and our AI instantly generates a set of flashcards, saving you hours of tedious work.
              </Typography>
            </FeatureCard>
         
            <FeatureCard bgcolor={cyan[400]}>
              <Typography variant = "h6" sx={{ fontWeight: 'bold', my: 2 }} gutterBottom>Smart Learning</Typography>
              <Typography>
                Our AI intelligently structures the flashcards to maximize learning efficiency, focusing on key concepts.
              </Typography>
            </FeatureCard>
          
            <FeatureCard bgcolor={orange[100]}>
              <Typography variant = "h6" sx={{ fontWeight: 'bold', my: 2 }} gutterBottom>Customized Experience</Typography>
              <Typography>
                Tailor flashcards to your specific needs with easy-to-use tools, ensuring your study material is exactly how you want it.
              </Typography>
            </FeatureCard>
          
            <FeatureCard bgcolor={lightBlue[100]}>
              <Typography variant = "h6" sx={{ fontWeight: 'bold', my: 2 }} gutterBottom>Accessible Anywhere</Typography>
              <Typography>
                Access you flashcards from any device, at any time. Study on the go with ease.
              </Typography>
            </FeatureCard>
        </Stack>
      </Box>

      {/* call to action container */}
      <Box display="flex" justifyContent="center" sx={{width: "100%", backgroundColor: '#ffffff', py: 12}}>
        <Stack direction="column" spacing={12} sx={{maxWidth: "1100px", width: "70%"}}>
          <Stack direction="row" spacing={4} sx={{width: "100%", my: 4}} >
            <Box sx={{flex:1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', py: 4}}>
              <Typography variant="h5" align="center" sx={{fontWeight: 'bold'}} gutterBottom>Revolutionize Your Study Routine</Typography>
              <Typography sx={{my: 1}}>Unlock a new way to study with AI-generated flashcards. Simply enter a topic, and let us create personalized flashcards tailored to your learning needs.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2, p: 2}} href="/sign-up">Get Started</Button>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', width: '100%', pl: 6}}>
                <Box sx={{ width: '410px', height: '290px', backgroundColor: '#8c9eff'}} />
            </Box>
          </Stack>
          <Stack direction="row" display="flex" sx={{width: "100%", my: 3}}>
            <Box sx={{ flex: 1, display: 'flex', width: '100%', pr: 6}}>
                <Box sx={{ width: '410px', height: '290px', backgroundColor: '#8c9eff'}} />
            </Box>
            <Box sx={{flex:1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', py: 4}}>
              <Typography variant="h5" align="center" sx={{fontWeight: 'bold'}} gutterBottom>Transform How You Learn</Typography>
              <Typography sx={{my:1}}>Experience the future of studying with our cutting-edge flashcard generator. Make studying simpler and more efficient today.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2, p: 2}} href="/sign-up">Try Now</Button>
            </Box>
          </Stack>
        </Stack>
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
