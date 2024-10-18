import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, TextField } from "@mui/material";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

export const FormInputDatePicker = ({
    name,
    control,
    label,
    size,
    onKeyDown,
}) => {
    return (
        <FormControl fullWidth sx={{ px: 1, py: "4px" }}>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                }) => (
                    <Flatpickr
                        data-enable-time
                        value={value}
                        options={{
                            // minDate: today,
                            dateFormat: "d-m-Y H:i",
                            // noCalendar:true,
                            time_24hr: true,
                            enableTime: true,
                            // defaultDate: purchaseDate,
                        }}
                        render={({ defaultValue, value, ...props }, ref) => {
                            return (
                                <TextField
                                    error={!!error}
                                    inputRef={ref}
                                    size={size === "small" ? "small" : "medium"}
                                    onKeyDown={onKeyDown}
                                    id={name}
                                    onBlur={onBlur}
                                    value={value}
                                    label={label}
                                />
                            );
                        }}
                        onChange={([date]) => {
                            onChange(date);
                        }}
                    />
                )}
            />
        </FormControl>
    );
};
