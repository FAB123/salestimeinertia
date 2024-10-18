import { Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import Moment from "react-moment";

function AppTime() {
    return (
        <Typography variant="body1" sx={{ fontFamily: "Orbitron, sans-serif" }}>
            <Moment
                locale="en"
                interval={15000}
                format="DD-MM-YYYY hh:mm A"
            ></Moment>
        </Typography>
    );
}

export default memo(AppTime);
