import React from "react";
import { FormControl, TextField, Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

export const FormInputSearch = ({ name, control, label, options }) => {
  return (
    <FormControl variant="outlined" fullWidth style={{ padding: "10px" }}>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error },
          // formState,
        }) => (
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={() => true}
            value={value ? value : null}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={error && error.message}
                error={!!error}
                label={label}
                // value={value.name}
              />
            )}
            onChange={(_, data) => {
              data && onChange(data);
            }}
          />
        )}
      />
    </FormControl>
  );
};
