import { router } from "@inertiajs/react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

function SpotLightCard({ item }) {
    return (
        <Box borderColor="primary">
            <Card
                sx={{
                    minWidth: 275,
                    marginY: 1,
                    cursor: "pointer",
                }}
                onClick={() => router.get(item.location)}
            >
                <CardContent>
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                    >
                        {item.name}
                    </Typography>

                    <Typography variant="body1">{item.keywords}</Typography>
                    <Typography variant="body1">{item.keywords_ar}</Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default SpotLightCard;
