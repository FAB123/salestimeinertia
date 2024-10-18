import React from "react";
import {
    FormControl,
    FormLabel,
    Stack,
    Typography,
    Switch,
} from "@mui/material";
import { Controller } from "react-hook-form";

export const FormInputSwitch = ({ name, control, label, OffText, onText }) => {
    return (
        <FormControl fullWidth component="fieldset">
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={0}
                margin={1}
                alignItems="baseline"
            >
                <FormLabel>{label}</FormLabel>
                <Controller
                    name={name}
                    control={control}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                        formState,
                    }) => (
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            // spacing={1}
                            // margin={1}
                            alignItems="baseline"
                        >
                            <Typography variant="body1">{OffText}</Typography>
                            <Switch
                                size="small"
                                color="secondary"
                                checked={value}
                                onChange={onChange}
                            />
                            <Typography>{onText}</Typography>
                        </Stack>
                    )}
                />
            </Stack>
        </FormControl>
    );
};
