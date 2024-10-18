import { CircularProgress, Backdrop, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function ProgressLoader(props) {
  const { t } = useTranslation();
  const { open, status } = props;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Stack gap={1} justifyContent="center" alignItems="center">
        <CircularProgress color="secondary" />
        <Typography>{status ? status : t("common.loading")}</Typography>
      </Stack>
    </Backdrop>
  );
}

export default ProgressLoader;
