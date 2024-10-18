import { Stack, ThemeProvider, Typography, createTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function InfoRow({ label, value, valueRef }) {
    const { t } = useTranslation();

    const theme = createTheme({
        typography: {
            subtitle1: {
                fontSize: 14,
                fontWeight: 700,

                fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
            },
            body1: {
                fontWeight: 600,
                fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="subtitle1" align="left">
                    {t(label)}
                </Typography>
                <Typography variant="subtitle1" align="right" ref={valueRef}>
                    {value}
                </Typography>
            </Stack>
        </ThemeProvider>
    );
}

export default InfoRow;
