'use client'
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Button, Box, Grid, Stack, Paper, Card, CardContent, CardActions, List, ListItem, ListItemText} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
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

const StyledList = styled(List)({
  padding: 0,
  margin: 0,
});

const StyledListItem = styled(ListItem)({
  padding: 0,
  margin: 0,
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
                Access your flashcards from any device, at any time. Study on the go with ease.
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
              <Button variant="contained" color="primary" sx={{mt:2, p: 2, px: 3}} href="/sign-up">Get Started</Button>
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
              <Button variant="contained" color="primary" sx={{mt:2, p: 2, px: 3}} href="/sign-up">Try Now</Button>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* pricing container */}
      <Box display="flex" flexDirection="column" alignItems="center" sx={{width: "100%", backgroundColor: teal[50], py: 12}}>
        <Box display='flex' flexDirection="row" justifyContent="space-between" sx={{width: '70%', maxWidth: "1300px", pb: 8}}>
          <Stack direction="column" display="flex" justifyContent='flex-start' sx={{width: "50%"}}>
            <Typography variant="h5" sx={{fontWeight: 'bold'}} gutterBottom>
              Invest in Your Learning Journey
            </Typography>
            <Typography sx={{my:1}}>Each plan offers a range of features to help you maximize your learning efficiency. Find the Perfect Plan for You.</Typography>
          </Stack>
          <Box display="flex" alignItems="center" justifyContent='flex-end'>
            <Button variant="text" endIcon={<ArrowOutwardIcon />}>Learn More</Button>
          </Box>
        </Box>
        <Box display='flex'  sx={{width: '75%', maxWidth: "1300px"}}>
          {/* basic pricing card */}
          <Grid container spacing = {4} display="flex">
            <Grid display="flex" item xs={12} md={6} >
              <Card sx={{ display: 'flex', flexDirection: 'column', p: 3, borderRadius: 5, flex: 1 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Basic</Typography>
                  <Typography gutterBottom>for newcomers</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 2 }} gutterBottom>Free</Typography>
                  <StyledList>
                    <StyledListItem>
                      <ListItemText primary="• Limited number of flashcard sets" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• Generate up to 10 flashcards per request" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• Limited flashcard content" />
                    </StyledListItem>
                  </StyledList>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" sx={{ mt: 2, width: "100%", borderRadius: '25px' }} href="/sign-up">
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            {/* pro pricing card */}
            <Grid display="flex" item xs={12} md={6} >
              <Card sx={{ display: 'flex', flexDirection: 'column', p: 3, borderRadius: 5, flex: 1 }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{fontWeight: 'bold'}}>Pro</Typography>
                  <Typography gutterBottom>for those who want more</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", my: 2}}gutterBottom>$10 / year</Typography>
                  <StyledList>  
                    <StyledListItem>
                      <ListItemText primary="• Unlimited number of flashcard sets" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• Generate up to 50 flashcards per request" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• Detailed analytics on study performance" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• Ability to review flashcards offline" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• Access to priority support with dedicated assistance" />
                    </StyledListItem>
                    <StyledListItem>
                      <ListItemText primary="• And many more +" />
                    </StyledListItem>
                  </StyledList>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" sx={{ mt: 2, width: "100%", borderRadius: '25px'}} onClick={handleSubmit}>
                    subscribe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* footer container */}
      <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
        <Typography>© 2024 SmartCardsAI. All rights reserved.</Typography>
      </Box>

    </Box>
    

    </ThemeProvider>
  );
}
