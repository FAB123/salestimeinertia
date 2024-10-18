import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { t } from "i18next";

export const FormWorkorderDropDown = ({ options, size, value, onSubmit }) => {
    return (
        <FormControl
            variant="outlined"
            sx={{ paddingRight: "10px", paddingLeft: "10px" }}
        >
            <InputLabel id="select-id">{t("common.status")}</InputLabel>
            <Select
                onChange={(e) => onSubmit(e.target.value)}
                value={value}
                labelId="select-id"
                label={t("common.status")}
                size={size ? size : "medium"}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {t(option.label)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
