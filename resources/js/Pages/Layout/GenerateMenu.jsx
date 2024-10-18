import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";

import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { useTranslation } from "react-i18next";

import { logout } from "../../helpers/Configuration";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { router } from "@inertiajs/react";

function GenerateMenu(props) {
    const { anchorEl, open, handleClose, type } = props;
    const { t, i18n } = useTranslation();

    const signOut = () => {
        logout();
        router.get("/logout");
    };
    return (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {type === "lang" && (
                <Paper sx={{ width: 180, maxWidth: "100%" }}>
                    <MenuList dense>
                        <MenuItem
                            onClick={() => {
                                i18n.changeLanguage("en");
                                localStorage.setItem("language", "en");
                                handleClose();
                            }}
                        >
                            <ListItemIcon>
                                <LanguageRoundedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>English</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                i18n.changeLanguage("ar");
                                localStorage.setItem("language", "ar");
                                handleClose();
                            }}
                        >
                            <ListItemIcon>
                                <LanguageRoundedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Arabic</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                i18n.changeLanguage("ur");
                                localStorage.setItem("language", "ur");
                                handleClose();
                            }}
                        >
                            <ListItemIcon>
                                <LanguageRoundedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Urdu</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Paper>
            )}

            {type === "profile" && (
                <MenuList dense>
                    <MenuItem>
                        <ListItemIcon>
                            <MailIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText> {t("common.settings")}</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <MailIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{t("common.profile")}</ListItemText>
                    </MenuItem>
                </MenuList>
            )}
            {type === "mobile" && (
                <MenuList dense>
                    {/* <MenuItem>
            <ListItemIcon>
              <MailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText> {t("common.settings")}</ListItemText>
          </MenuItem> */}
                    <MenuItem>
                        <ListItemIcon>
                            <LogoutRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText onClick={() => signOut()}>
                            {t("common.logout")}
                        </ListItemText>
                    </MenuItem>
                </MenuList>
            )}
        </Menu>
    );
}

export default GenerateMenu;
