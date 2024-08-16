import {AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import {SignUp} from "@clerk/nextjs";
import Link from 'next/link'

export default function SignUpPage() {
    return <Box>
        <AppBar position="static">
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
        >
            <Typography variant="h4">Sign Up</Typography>
            <SignUp />
        </Box>
    </Box>
}