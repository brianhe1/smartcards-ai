'use client'

import {useUser} from '@clerk/nextjs'
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {useEffect, useState} from 'react'
import { collection, doc, getDoc, setDoc, onSnapshot} from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter, useSearchParams} from 'next/navigation';
import {Box, Grid, Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, Button} from '@mui/material'
import Link from 'next/link'

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    const getFlashcards = async () => {
        if (!user) return
        const docRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            console.log(collections)
            setFlashcards(collections)
        } else {
            await setDoc(docRef, {flashcards: []})
        }
     }

    useEffect(() => {
        getFlashcards()
    }, [user])


    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Box
            sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: "100vw"}}>
            {/* app bar */}
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        <Link href="/userDashboard" style={{ textDecoration: 'none', color: 'inherit' }} passHref>
                            SmartCardsAI
                        </Link>
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
            <Grid container spacing={3} sx={{mt: 10}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={()=>(handleCardClick(flashcard.name))}>
                                <CardContent>
                                    <Typography variant = 'h6'>
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}