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
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginHelper } from "../../../helpers/FormHelper";
import { loginTransilationHelper } from "../../../helpers/FormTrasilationHelper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import ToasterContainer from "../../../components/ToasterContainer";
import { FormLoginDropdown, FormInputText } from "../../../components/mui";

import { IconLock, IconUser } from "@tabler/icons-react";

function ShowLogin() {
    const { flash, appName, stores, status } = usePage().props;

    const myTheme = useTheme();

    const theme = createTheme({
        palette: {
            primary: {
                main: myTheme.palette.secondary.main,
            },
        },
        // shape: {
        //     // borderRadius: 8,
        // },
        typography: {
            fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
        },
    });

    const { t } = useTranslation();
    const { handleSubmit, control } = useForm({
        defaultValues: loginHelper.initialValues,
        resolver: yupResolver(loginTransilationHelper),
        mode: "onBlur",
    });

    const onSubmit = (values) => {
        router.post("/login", values);
    };

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
        <ThemeProvider theme={theme}>
            <Grid sx={{ height: "100vh", position: "relative" }}>
                <Head title={`${appName} - Login`} />
                <Paper
                    sx={{
                        height: "50vh",
                        width: "100vw",
                        backgroundColor: myTheme.palette.secondary.main,
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
                                    // fontFamily: "Niconne",
                                }}
                            >
                                Hasib POS
                                {/* {appName} */}
                            </Typography>
                        </Grid>
                        <ToasterContainer />

                        <Grid align="center">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                autoComplete="off"
                            >
                                <FormInputText
                                    label={t("employee.username")}
                                    name="username"
                                    size="small"
                                    preappend={<IconUser fontSize={"small"} />}
                                    control={control}
                                />
                                <FormInputText
                                    label={t("employee.password")}
                                    name="password"
                                    type="password"
                                    size="small"
                                    preappend={<IconLock fontSize={"small"} />}
                                    control={control}
                                />

                                {stores.length > 0 && (
                                    <FormLoginDropdown
                                        label={t("common.stores")}
                                        name="store"
                                        size="small"
                                        control={control}
                                        options={stores}
                                    />
                                )}

                                {/* <FormControl
                                control={
                                    <Checkbox name="checkedB" color="primary" />
                                }
                                label="Remember me"
                            /> */}

                                <Typography color="error" sx={{ m: 3 }}>
                                    {flash.message}
                                </Typography>

                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    fullWidth
                                >
                                    {t("login.signin")}
                                </Button>
                                <Typography
                                    sx={{
                                        color:
                                            status === "Activated"
                                                ? "green"
                                                : "red",
                                        mt: 1,
                                    }}
                                >
                                    Status :
                                    {status === "Activated"
                                        ? "Activated"
                                        : `You are using Trial version of this program. ${status} days left to activate`}
                                </Typography>
                            </form>
                        </Grid>
                    </Paper>
                </Paper>
            </Grid>
        </ThemeProvider>
    );
}

export default ShowLogin;
