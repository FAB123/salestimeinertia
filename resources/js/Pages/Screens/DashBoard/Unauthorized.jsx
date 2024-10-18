import { Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import NoEncryptionGmailerrorredIcon from "@mui/icons-material/NoEncryptionGmailerrorred";

function Unauthorized() {
    const { t } = useTranslation();

    const goBack = () => {
        window.history.back();
    };
    return (
        <Stack>
            <Breadcrumb labelHead={t("modules.unauthrized")} labelSub="" />

            <Paper elevation={20} sx={{ mt: 2, height: "50vh" }}>
                <Stack
                    direction="column"
                    alignItems="center"
                    spacing={2}
                    justifyContent="center"
                    sx={{ minHeight: "50vh" }}
                >
                    <NoEncryptionGmailerrorredIcon
                        sx={{ fontSize: "100px" }}
                        color="error"
                    />
                    <Typography variant="h4">
                        {t("common.unauthrized")}
                    </Typography>
                    <Button onClick={goBack} variant="contained">
                        {t("common.back")}
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default Unauthorized;
