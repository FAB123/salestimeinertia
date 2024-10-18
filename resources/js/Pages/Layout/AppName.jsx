import { Button, Divider, Typography } from "@mui/material";
import React from "react";

function AppName() {
    return (
        <>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    flexGrow: 1,
                    display: { xs: "block" },
                }}
            >
                SalesTime
            </Typography>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Button variant="text" color="secondary">
                SalesTime
            </Button>
        </>
    );
}

export default AppName;
