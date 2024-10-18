import { Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";

function SalesComments({ savedDatas, setSavedDatas }) {
    const { t } = useTranslation();
    return (
        <Stack pb={1}>
            <TextField
                onChange={(e) => {
                    setSavedDatas({ ...savedDatas, comments: e.target.value });
                }}
                size="small"
                value={savedDatas.comments}
                type="text"
                multiline={true}
                minRows={3}
                maxRows={4}
                label={t("common.comments")}
                autoComplete="on"
                variant="outlined"
            />
        </Stack>
    );
}

export default SalesComments;
