'use client'

import {useUser} from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, deleteDoc, query, setDoc, updateDoc } from 'firebase/firestore'
import { writeBatch } from 'firebase/firestore'
import { useRouter, useSearchParams} from 'next/navigation';
import { db } from '@/firebase'
import Link from 'next/link'
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { red, lightBlue, orange, grey } from '@mui/material/colors';
import ReactMarkdown from 'react-markdown'
import {AppBar, Toolbar, IconButton, Box, Typography, Paper, TextField, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, Divider, DialogContent, DialogTitle, DialogContentText, Grid} from '@mui/material'
export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();  // clerk authentication variables
    const [flashcards, setFlashcards] = useState([])
    const [flippedCard, setFlippedCard] = useState([])
    const [open, setOpen] = useState(false)  // modals

    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()  // initialize useRouter

    // opening and closing the modals (dialog)
    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }


    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlippedCard((prev) => ({
            ...prev,
            [id]: !prev[id],      
        }))
    }

    const handleCollectionDelete = async (search) => {
        try {
            // reference to the user's document
            const userDocRef = doc(collection(db, 'users'), user.id)
            // fetch the user's document
            const userDocSnap = await getDoc(userDocRef)
            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                const collections = data.flashcards || []
                // remove the collection name from the flashcards array
                const updatedCollections = collections.filter(flashcard => flashcard.name !== search);
                // create a batch to perform multiple operations
                const batch = writeBatch(db);
                // reference to collection to be deleted
                const colRef = collection(userDocRef, search);
                // fetch all the documents in the collection
                const colDocs = await getDocs(colRef);
                // loop through each document and delete
                await Promise.all(
                    colDocs.docs.map(docSnap => deleteDoc(doc(colRef, docSnap.id)))  // transform e/ document snapshot into a promise by calling deleteDoc
                );  // once all docs in a collection are deleted, firestore removes the collection
                // update the flashcards array in the user's document
                batch.set(userDocRef, { flashcards: updatedCollections }, { merge: true });
                // commit the batch
                await batch.commit();
                // redirect to the parent page after successful deletion
                router.push('/flashcards')
            } else {
                console.error('User document does not exist.');
            }
        } catch (error) {
            console.error("Error deleting collection", error)
        }
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
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
            <Box display="flex" justifyContent="space-between" sx={{width: "90vw", pb: 4, pt: 3, mt:10}}>
                <Typography variant="h4">{search}</Typography>
                <IconButton 
                    aria-label="delete" 
                    onClick={handleOpen}
                    sx={{color: red[600]}}
                >
                    <DeleteOutlineIcon/>
                </IconButton>
            </Box>
            <Divider sx={{ width: "90vw", mx: "auto" }} />
            <Box sx={{ width: "90vw", mt: 5}}>
                <Grid container spacing={4}>
                    {flashcards.map((flashcard, index) => {
                        return (
                        <Grid item xs={12} sm={6} md={4} key = {index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                        <Box sx={{
                                            perspective: "1000px",
                                            '& > div': {
                                                    transformStyle: "preserve-3d",
                                                    transition: "transform 0.6s",
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "200px",
                                                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                    transform: flippedCard[index] 
                                                        ? 'rotateY(180deg)' 
                                                        : "rotateY(0deg)"
                                                },
                                                '& > div > div': {
                                                    position: "absolute",
                                                    width: "100%",
                                                    height: "100%",
                                                    backfaceVisibility: "hidden",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: 2,
                                                    boxSizing: "border-box",
                                                }, 
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)'
                                                }
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant = "h6" component = "div">
                                                        <ReactMarkdown>{flashcard.front}</ReactMarkdown>
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant = "h6" component = "div">
                                                        <ReactMarkdown>{flashcard.back}</ReactMarkdown>
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        )
                    })}
                </Grid>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this set? It will be lost forever.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleCollectionDelete(search)}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}