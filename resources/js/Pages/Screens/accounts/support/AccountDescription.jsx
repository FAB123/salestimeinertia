import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

function AccountDescription(props) {
  const { title, description } = props;
  return (
    <Paper elevation={24} sx={{ p: 1, ml: 1 }}>
      <Stack sx={{ p: 2 }}>
        <Typography
          align="center"
          sx={{
            fontFamily: "Cairo",
            fontStyle: "bold",
            fontWeight: "bold",
            lineHeight: "24px",
            fontSize: "26px",
            textDecoration: "underline",
          }}
          display="inline"
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{
            top: "104px",
            fontFamily: "Cairo",
            fontStyle: "normal",
            fontWeight: "normal",
            lineHeight: "24px",
            fontSize: "18px",
            letterSpacing: "0.18px",
            color: "#172B4D",
            margin: "16px 0px",
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default AccountDescription;
