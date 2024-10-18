import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";

import Button from "@mui/material/Button";

import AppTime from "./AppTime";
import GenerateMenu from "./GenerateMenu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { PosTooltip } from "../../Utils/Theming";
import { Divider } from "@mui/material";
import { toggleFullScreen } from "../../helpers/GeneralHelper";
import ShowCalcualtor from "./ShowCalcuator";
import AppSpotLight from "./SpotLight/AppSpotLight";
import { router, usePage } from "@inertiajs/react";
import { logout } from "../../helpers/Configuration";
import QuickMenu from "./QuickMenu";
import { IconNote } from "@tabler/icons-react";

import PosDrawer from "../../components/PosDrawer";
import AppToDo from "./SideBar/AppToDo";

const AppHeadToolbar = ({ handleDrawer }) => {
    const [showCalcualtor, setshowCalcualtor] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [type, setType] = useState(null);
    const [open, setOpen] = useState(false);
    const [showTodo, setShowTodo] = useState(false);
    const [spotlight, setSpotLight] = useState(false);
    const { urlPrevious } = usePage().props;

    const signOut = () => {
        logout();
        router.get("/logout");
    };

    const showLangMenu = (e) => {
        setAnchorEl(e.currentTarget);
        setType("lang");
        setOpen(true);
    };

    const handleMobileMenu = (e) => {
        setAnchorEl(e.currentTarget);
        setType("mobile");
        setOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const backPage = () => {
        router.visit(urlPrevious);
    };
    return (
        <AppBar
            position="fixed"
            color="secondary"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Container maxWidth="xl">
                <Toolbar variant="dense" disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { md: "flex" },
                            color: "inherit",
                        }}
                    >
                        SalesTime
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex" },
                        }}
                    >
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ p: 1 }}
                        />
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleDrawer}
                            color="inherit"
                            sx={{ display: { md: "none" } }}
                        >
                            <MenuIcon size="small" />
                        </IconButton>

                        <Button
                            onClick={backPage}
                            sx={{
                                my: 1,
                                // mx: 0,
                                color: "white",
                                display: "block",
                            }}
                        >
                            BACK
                        </Button>
                        <QuickMenu />
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <AppTime />
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        <PosTooltip title="To-do List">
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => setShowTodo(!showTodo)}
                            >
                                <IconNote stroke={2} />
                            </IconButton>
                        </PosTooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            // sx={{ p: 1 }}
                        />
                        <PosTooltip title="Show SpotLight">
                            <IconButton
                                size="large"
                                aria-label="show spotlight"
                                color="inherit"
                                onClick={() => setSpotLight(true)}
                            >
                                <SearchIcon />
                            </IconButton>
                        </PosTooltip>
                        <Divider
                            orientation="vertical"
                            flexItem
                            // sx={{ p: 1 }}
                        />
                        <PosTooltip title="Show Calcualtor">
                            <IconButton
                                size="large"
                                aria-label="show calculator"
                                color="inherit"
                                onClick={() => setshowCalcualtor(true)}
                            >
                                <CalculateRoundedIcon />
                            </IconButton>
                        </PosTooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            // sx={{ p: 1 }}
                        />

                        <PosTooltip title="Toggle fullscreen">
                            <IconButton
                                size="large"
                                aria-label="toggle fullscreen"
                                color="inherit"
                                onClick={toggleFullScreen}
                            >
                                <FullscreenRoundedIcon />
                            </IconButton>
                        </PosTooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            // sx={{ p: 1 }}
                        />

                        <PosTooltip title="Application Language">
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                //   aria-controls={langMenuId}
                                aria-haspopup="true"
                                onClick={showLangMenu}
                                color="inherit"
                            >
                                <LanguageRoundedIcon />
                            </IconButton>
                        </PosTooltip>

                        <Divider
                            orientation="vertical"
                            flexItem
                            // sx={{ p: 1 }}
                        />

                        <PosTooltip title="Sign Out">
                            <IconButton
                                size="large"
                                aria-label="user sign out"
                                color="inherit"
                                onClick={() => signOut()}
                            >
                                <LogoutRoundedIcon />
                            </IconButton>
                        </PosTooltip>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-haspopup="true"
                            onClick={handleMobileMenu}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
                <GenerateMenu
                    anchorEl={anchorEl}
                    open={open}
                    handleClose={handleClose}
                    type={type}
                />
                <ShowCalcualtor
                    show={showCalcualtor}
                    handleClose={() => setshowCalcualtor(false)}
                />
                <AppSpotLight
                    show={spotlight}
                    handleClose={() => setSpotLight(false)}
                />
                <PosDrawer
                    open={showTodo}
                    setOpen={setShowTodo}
                    theme={{
                        width: { md: "50%", xs: "100%" },
                    }}
                >
                    <AppToDo setShowTodo={() => setShowTodo(false)} />
                </PosDrawer>
            </Container>
        </AppBar>
    );
};
export default AppHeadToolbar;
