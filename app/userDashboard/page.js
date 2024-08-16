'use client'

import { AppBar, Toolbar, Typography, Button, Box, Grid, CircularProgress} from "@mui/material";
import Head from "next/head";
import { useUser } from '@clerk/nextjs'; 
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { useState, useEffect } from "react";

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
    <Box maxWidth="100vw">
        {/* app bar */}
        <AppBar position="fixed">
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

        {/* user dashboard */}
        <Box
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 12}}
            height="100vh">
        <Typography variant="h2">Welcome Back{(', ' + user?.firstName || ' ')}!</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}} href="/generate">Generate Sets</Button>
        <Button variant="contained" color="primary" sx={{mt:2}} href="/flashcards">See my Sets</Button>
      </Box>
    </Box>
    )
}

export default UserDashboard