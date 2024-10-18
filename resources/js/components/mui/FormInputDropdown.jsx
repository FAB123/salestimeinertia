import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import { t } from "i18next";

export const FormInputDropdown = ({ name, control, label, options, size }) => {
    const generateSingleOptions = () => {
        return options.map((option) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {t(option.label)}
                </MenuItem>
            );
        });
    };

    return (
        <FormControl
            // variant="outlined"
            fullWidth
            sx={{ p: 0.8 }}
            // sx={{ paddingRight: "10px", paddingLeft: "10px", mt: 2 }}
        >
            <InputLabel id="select-id">{label}</InputLabel>
            <Controller
                render={({ field: { onChange, value, onBlur } }) => (
                    <Select
                        onChange={onChange}
                        value={value}
                        labelId="select-id"
                        label={label}
                        size={size ? size : "medium"}
                        onBlur={onBlur}
                    >
                        {generateSingleOptions()}
                    </Select>
                )}
                control={control}
                name={name}
            />
        </FormControl>
    );
};
