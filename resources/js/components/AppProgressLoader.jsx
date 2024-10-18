import { router } from "@inertiajs/react";
import { CircularProgress, Backdrop, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function AppProgressLoader() {
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false);

    router.on("start", () => setLoader(true));
    router.on("finish", () => setLoader(false));
    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loader}
        >
            <Stack gap={1} justifyContent="center" alignItems="center">
                <CircularProgress color="secondary" />
                <Typography>{t("common.loading")}</Typography>
            </Stack>
        </Backdrop>
    );
}

export default AppProgressLoader;
