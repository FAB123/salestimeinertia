import React from "react";
import { useTranslation } from "react-i18next";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Avatar,
    Grid,
    Paper,
    Typography,
    Button,
    useTheme,
    Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { activateTransilationHelper } from "../../../helpers/FormTrasilationHelper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import ToasterContainer from "../../../components/ToasterContainer";
import { FormInputText } from "../../../components/mui";
import ActivationForm from "./ActivationForm";

function Activate() {
    const { appName } = usePage().props;
    const { t } = useTranslation();
    const theme = useTheme();

    const paperStyle = {
        padding: 30,
        minHeight: "25vh",
        // width: "15vw",
        borderRadius: 14,

        top: "50vh",
        left: "50vw",
        transform: "translate(-50%, -50%)",
    };

    return (
        <Grid sx={{ height: "100vh", position: "relative" }}>
            <Head title={`${appName} - Login`} />
            <Paper
                sx={{
                    height: "50vh",
                    width: "100vw",
                    backgroundColor: theme.palette.secondary.main,
                    position: "absolute",
                }}
            >
                <Paper
                    elevation={10}
                    style={paperStyle}
                    position="absolute"
                    sx={{
                        position: "absolute",
                        width: {
                            xs: "70vw",
                            md: "20vw",
                        },
                        maxWidth: "300px",
                    }}
                >
                    <Grid align="center">
                        <Avatar sx={{ backgroundColor: "#1bbd7e" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography>Sign In</Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                display: { xs: "none", md: "block" },
                                fontWeight: "700",
                            }}
                        >
                            Hasib POS
                        </Typography>
                    </Grid>
                    <ToasterContainer />
                    <Divider />

                    <ActivationForm type={"inertia"} />
                </Paper>
            </Paper>
        </Grid>
    );
}

export default Activate;
