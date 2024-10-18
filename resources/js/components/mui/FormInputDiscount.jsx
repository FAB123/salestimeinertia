import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export const FormInputDiscount = ({ discount, setDiscount }) => {
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", width: "50%" }}>
        {t("common.adddisc")}
      </Typography>
      <TextField
        sx={{ width: "50%" }}
        onChange={(e) => {
          setDiscount(e.target.value);
        }}
        size="small"
        value={discount}
        type="text"
        onFocus={(e) => e.target.select()}
        variant="outlined"
        onBlur={(e) => {
          if (isNaN(parseFloat(e.target.value))) {
            setDiscount(0);
          }
        }}
        InputProps={{
          endAdornment: <InputAdornment position="start">SAR</InputAdornment>,
        }}
      />
    </Stack>
  );
};
