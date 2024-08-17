'use client'

import { AppBar, Toolbar, Typography, Button, Box, Grid, CircularProgress, IconButton} from "@mui/material";
import { useUser } from '@clerk/nextjs'; 
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { useState, useEffect } from "react";

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CssBaseline from '@mui/material/CssBaseline';

import HomeIcon from '@mui/icons-material/Home';
import StyleIcon from '@mui/icons-material/Style';
import QueueIcon from '@mui/icons-material/Queue';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { grey, teal, blue, cyan, green, orange, pink, lightBlue} from '@mui/material/colors';

const drawerWidth = 70;

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

const UserDashboard = () => {
    const { user, isLoaded, isSignedIn } = useUser(); // Get the current user and loading status
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false); // set loading to false once the user data is loaded
        }
    }, [isLoaded]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
      <ThemeProvider theme={theme}>
    <Box maxWidth="100vw">
        {/* app bar */}
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1}}>
              SmartCardsAI
            </Typography>
            {/* if signed out, display log in or sign up button */}
            <SignedOut>
              <Button color = "inherit" href="/sign-in">Log In</Button>
              <Button color = "inherit" href="sign-up">Sign Up</Button>
            </SignedOut>
            {/* if signed in, display user icon */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        {/* menu drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none' },
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', display: "flex", flexDirection: "column", alignItems: "center"}}>
            <List>
              <ListItem disablePadding>
                <IconButton aria-label="home" size="large" color="primary">
                  <HomeIcon fontSize="inherit" />
                </IconButton>
              </ListItem>
              <ListItem disablePadding>
                <IconButton aria-label="library" size="large" color="primary">
                  <StyleIcon fontSize="inherit" />
                </IconButton>
              </ListItem>
              <ListItem disablePadding>
                <IconButton aria-label="library" size="large" color="primary">
                  <QueueIcon fontSize="inherit" />
                </IconButton>
              </ListItem>
            </List>
            <Divider/>
          </Box>
        </Drawer>

        {/* user dashboard */}
        <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 12}}
            height="100vh">
        <Typography variant="h2">Welcome Back{(', ' + user?.firstName || ' ')}!</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}} href="/generate">Generate Sets</Button>
        <Button variant="contained" color="primary" sx={{mt:2}} href="/flashcards">See my Sets</Button>
      </Box>
    </Box>
    </ThemeProvider>
    )
}

export default UserDashboard