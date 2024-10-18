import { router } from "@inertiajs/react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Typography,
} from "@mui/material";
import React from "react";

function WelcomeInstaller() {
    const doInstall = () => {
        router.post("/do-install");
    };
    return (
        <Container
            style={{
                justifyItems: "center",
                alignContent: "center",
                height: "80vh",
            }}
        >
            <Card sx={{ mt: 5, p: 5 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Installer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome to SalesTime Installer, After Installation is
                        compleet you can login with new username and password.
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "right" }}>
                    <Button
                        // size="small"
                        variant="contained"
                        onClick={doInstall}
                    >
                        Continue
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
}

export default WelcomeInstaller;
