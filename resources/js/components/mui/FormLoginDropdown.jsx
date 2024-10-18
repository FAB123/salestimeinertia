import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const FormLoginDropdown = ({ name, control, label, options }) => {
    return (
        <Controller
            render={({ field: { onChange, value, onBlur } }) => (
                <TextField
                    select
                    fullWidth
                    label={label}
                    value={value}
                    size="small"
                    style={{ paddingLeft: "10px", paddingRight: "10px" }}
                    onChange={onChange}
                    onBlur={onBlur}
                >
                    {options.map((option) => (
                        <MenuItem
                            key={option.location_id}
                            value={option.location_id}
                        >
                            [{option.location_name_en}]  -  [
                            {option.location_name_ar}]
                        </MenuItem>
                    ))}
                </TextField>
            )}
            control={control}
            name={name}
        />
    );
};
