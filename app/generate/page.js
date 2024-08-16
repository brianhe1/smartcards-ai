'use client'

import { useUser } from "@clerk/nextjs";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { writeBatch, doc, collection, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs"
import Link from 'next/link'
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { red, lightBlue, orange, grey } from '@mui/material/colors';
import ReactMarkdown from 'react-markdown'
import {Box, Typography, Paper, TextField, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Grid, AppBar, Toolbar} from '@mui/material'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();  // clerk authentication variables
    const [flashcards, setFlashcards] = useState([])
    const [flippedCard, setFlippedCard] = useState([])
    const [text, setText] = useState('')
    const [savedText, setSavedText] = useState(''); // new state to store the current topic, for replacing unwanted cards
    const [numCards, setNumCards] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)  // modals
    const router = useRouter()

    // API call 
    const handleSubmit = async () => {
        // if input text is empty, show alert
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }
        // if quantity is empty, show alert
        if (!numCards.trim()) {
            alert('Please enter the number of cards in the new set.')
            return
        }

        try {
            const response = await fetch('api/generate', {  // sends a POST request to server at api/generate endpoint with input text
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // ensure you are sending JSON if needed
                },
                body: JSON.stringify({
                    text: text,
                    quantity: numCards,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to generate flashcards. Status: ${response.status}`)
            }
            const data = await response.json()   // receives response from server (Promise) --> parses it
            setFlashcards(data.flashcards)   // updates flashcards state

            // save the topic for replacing cards
            setSavedText(text);

            console.log(data.flashcards)
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            alert('An error occurred while generating flashcards. Please try again.');
        }
        setText('')
        setNumCards('')
    }

    const handleReplaceCard = async (index) => {
        try {
            const response = await fetch('/api/generate', {  
                method: 'POST',
                body: JSON.stringify({
                    text: savedText,
                    quantity: 1,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to replace flashcard. Status: ${response.status}`);
            }
    
            const data = await response.json();
            const newFlashcard = data.flashcards[0];
    
            setFlashcards((prevFlashcards) => {
                const updatedFlashcards = [...prevFlashcards];
                updatedFlashcards[index] = newFlashcard;
                return updatedFlashcards;
            });
        } catch (error) {
            console.error('Error replacing flashcard:', error.message || error);
            alert('An error occurred while replacing the flashcard. Please try again.');
        }
    };

    const handleDeleteCard = (index) => {
        setFlashcards((prevFlashcards) => 
            prevFlashcards.filter((_, i) => i !== index)
        );
    };
    

    const handleCardClick = (id) => {
        setFlippedCard((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    // opening and closing the modals (dialog)
    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name.trim()) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
            const collections = userDocSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return
            }
            else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        alert('Flashcards saved successfully!')
        handleClose()
        setName('')
        router.push('/flashcards')
    }

    return ( 
        <Box 
            sx={{
                display: "flex",
                justifyContent: "center",
                width: "100vw", 
            }}
        >
            <Box 
                sx={{
                    width: "100%", 
                    maxWidth: "80vw", 
                    mt: 12, 
                    mb: 6, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
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
                <Typography variant="overline" sx={{ fontSize: '2rem'}} gutterBottom>Generate New Flashcard Set</Typography>
                <Paper sx={{p: 4, width: '100%'}}>
                    <TextField value = {text} 
                        onChange = {(e) => setText(e.target.value)} 
                        label = "New Set Topic"
                        fullWidth
                        variant="outlined"
                        sx={{
                            mb: 2,
                        }}
                    />
                     <TextField value = {numCards} 
                        onChange = {(e) => setNumCards(e.target.value)} 
                        label = "New Set Quantity"
                        fullWidth
                        variant="outlined"
                        sx={{
                            mb: 2,
                        }}
                    />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                >
                    Submit
                </Button>
                </Paper>
            
            {flashcards.length > 0 && (
                <Box 
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        mt: 4,
                        width: "100%", 
                        maxWidth: "80vw", 
                    }} 
                >
                    <Typography variant="overline" sx={{ fontSize: '1.25rem', mt: 1 }} gutterBottom>Flashcard Set Preview</Typography>
                    <Grid container spacing={3} sx={{ mt: 0}}>
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
                                                <div style={{ textAlign: 'center' }}>
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
                                    <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{pb:1, pr:1.25}}>
                                        <IconButton 
                                            aria-label="replace"
                                            onClick={() => handleReplaceCard(index)}
                                            sx={{color: orange[800]}}
                                        >
                                            <FindReplaceIcon/>
                                        </IconButton>
                                        <IconButton 
                                            aria-label="delete" 
                                            onClick={() => handleDeleteCard(index)}
                                            sx={{color: red[600]}}
                                        >
                                            <DeleteOutlineIcon/>
                                        </IconButton>
                                    </Box>
                                    
                                </Card>
                            </Grid>
                            )
                        })}
                        
                    </Grid>
                    <Box
                        sx={{
                            mt: 4,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                        variant="contained"
                        color="primary"
                        endIcon={<AddIcon/>}
                        onClick={handleOpen}
                        >
                            Create and practice
                        </Button>
                    </Box>
                </Box>
            )}
            </Box>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        align="center" 
                        fontWeight="bold"
                    >Create a new flashcard set
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Flashcard Set Title"
                        placeholder='Enter a title, like "Computer Science - Chapter 3: Data Structures"'
                        type="text"
                        fullWidth
                        variant="standard"
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}