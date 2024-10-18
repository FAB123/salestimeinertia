import React, { memo } from "react";
import { router } from "@inertiajs/react";
import { IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function MenuButton({ Icon, label }) {
    const { t } = useTranslation();
    return (
        <Stack
            direction="column"
            sx={{ alignItems: "center", margin: 0, padding: "0px" }}
            useFlexGap
            flexWrap="wrap"
            onClick={() => router.get(`/${label}`)}
        >
            <IconButton aria-label="Example" color="inherit" size="small">
                <Icon fontSize="inherit" />
            </IconButton>
            <Typography variant="h6" paragraph={true} fontSize={10} m="2px">
                {t(`modules.${label}`)}
            </Typography>
        </Stack>
    );
}

export default memo(MenuButton);
