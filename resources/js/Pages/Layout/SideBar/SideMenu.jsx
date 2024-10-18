import React, { memo, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { router } from "@inertiajs/react";

function SideMenu({ menu, auth }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { t } = useTranslation();
    const Icon = menu.icon;

    return (
        <div>
            <Stack
                direction="column"
                sx={{ alignItems: "center", margin: 0, padding: "0px" }}
                useFlexGap
                flexWrap="wrap"
                onClick={handleClick}
            >
                <IconButton aria-label="Example" color="inherit" size="small">
                    <Icon fontSize="inherit" />
                </IconButton>
                <Typography variant="h6" paragraph={true} fontSize={10} m="2px">
                    {t(`modules.${menu.label}`)}
                </Typography>
            </Stack>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                sx={{
                    marginX: 1,
                }}
            >
                {menu.menus.map(
                    (item, index) =>
                        auth.permissions.includes(item.label) && (
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    router.get(`/${menu.label}/${item.label}`);
                                }}
                                key={index}
                            >
                                <ListItemIcon>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t(`modules.${item.label}`)}
                                </ListItemText>
                            </MenuItem>
                        )
                )}
            </Menu>
        </div>
    );
}

export default memo(SideMenu);
