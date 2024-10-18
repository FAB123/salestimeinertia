import { CircularProgress, Drawer, Fade, Stack, styled } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { PurpleButton } from "../Utils/Theming";

function PosDrawer(props) {
    const { t } = useTranslation();
    const DrawerHeader = styled("div")(({ theme }) => ({
        ...theme.mixins.toolbar,
    }));
    return (
        <Drawer
            anchor="right"
            open={props.open}
            onKeyDown={(e) => {
                e.key === "Escape" && props.setOpen(false);
            }}
            PaperProps={{
                sx: {
                    ...props.theme,
                    borderRadius: 1,
                },
            }}
        >
            <DrawerHeader />

            <Stack sx={{ p: 1 }}>
                {props.children}
                <PurpleButton
                    sx={{ mx: "auto", mt: 2, width: "25%" }}
                    onClick={() => props.setOpen(false)}
                >
                    {t("common.cancel")}
                </PurpleButton>
            </Stack>
        </Drawer>
    );
}

export default PosDrawer;
