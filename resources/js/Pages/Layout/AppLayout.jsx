import React, { useState, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import {
    ThemeProvider,
    createTheme,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AppDrawer from "./SideBar/AppDrawer";
import AppHeadToolbar from "./AppHeadToolbar";
import AppProgressLoader from "../../components/AppProgressLoader";

const openedMixin = (theme) => ({
    width: 0,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(10)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(11)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function AppLayout({ children }) {
    const matches = useMediaQuery("(max-width:600px)");

    const mtheme = useTheme();

    const theme = createTheme({
        palette: {
            primary: {
                main: mtheme.palette.secondary.main,
            },
        },
        shape: {
            borderRadius: 4, //8
        },
        typography: {
            fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
        },
    });

    const [open, setOpen] = useState(matches);

    const handleDrawer = useCallback(() => {
        setOpen(!open);
    }, [open]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
                {/* direction: "rtl" */}
                <CssBaseline />
                <AppHeadToolbar handleDrawer={handleDrawer} />
                <AppProgressLoader />
                <Drawer
                    variant="permanent"
                    open={open}
                    // anchor="right"
                    PaperProps={{
                        sx: {
                            backgroundColor: theme.palette.secondary.main,
                            color: "#fff",
                        },
                    }}
                >
                    <DrawerHeader />
                    <AppDrawer />
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 1,
                        pt: 6,
                        backgroundColor: "#f8f0fc",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
