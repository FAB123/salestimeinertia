import React from "react";
import { Controller } from "react-hook-form";
import {
    FormControl,
    TextField,
    InputAdornment,
    Stack,
    IconButton,
} from "@mui/material";
import { postData } from "../../apis/apiCalls";
import { IconLanguage } from "@tabler/icons-react";
import { APPTRANSILATE } from "../../constants/apiUrls";

export const FormInputText = ({
    name,
    control,
    label,
    type,
    multiline,
    itemRef,
    size,
    helperText,
    preappend,
    postappend,
    postappendCount,
    onKeyDown,
    transilator,
}) => {
    return (
        <FormControl fullWidth sx={{ p: 0.8 }}>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                }) => (
                    <Stack direction={"row"}>
                        <TextField
                            helperText={error ? error.message : helperText}
                            error={!!error}
                            onChange={onChange}
                            inputRef={itemRef}
                            fullWidth={true}
                            size={size === "small" ? "small" : "medium"}
                            onKeyDown={onKeyDown}
                            id={name}
                            onBlur={onBlur}
                            value={value}
                            type={type ? type : "text"}
                            multiline={multiline ? true : false}
                            minRows={3}
                            maxRows={4}
                            label={label}
                            autoComplete="on"
                            variant="outlined"
                            InputProps={{
                                inputProps: {
                                    dir: "auto",
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {preappend
                                            ? preappend === true
                                                ? "SAR"
                                                : preappend
                                            : null}
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {postappend ? "0.00" : null}
                                        {postappendCount
                                            ? `Count: ${value.length}`
                                            : null}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {transilator && (
                            <IconButton
                                aria-label="language"
                                color="success"
                                onClick={() => {
                                    postData(APPTRANSILATE, {
                                        query: value,
                                    }).then((response) => {
                                        if (!response.error) {
                                            onChange(response.data);
                                        }
                                    });
                                }}
                            >
                                <IconLanguage string={2} />
                            </IconButton>
                        )}
                    </Stack>
                )}
            />
        </FormControl>
    );
};
