import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, TextField,  Grid } from "@mui/material";
// import { styled } from "@mui/material/styles";

// const CustomizedPrepend = styled(InputAdornment)`
//   & .css-1pnmrwp-MuiTypography-root {
//     background-color: #9c27b0;
//     color: #fff;
//   }
// `;

export const FormTextMultiInput = ({
  name,
  name2,
  control,
  label,
  label2,
  type,
  multiline,
}) => {
  return (
    <FormControl fullWidth>
      <Grid
        container
        spacing={0.5}
        sx={{
          m: 0.7,
        }}
      >
        <Grid item xs={6}>
          <Controller
            name={name}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextField
                helperText={error ? error.message : null}
                fullWidth
                error={!!error}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                type={type ? type : "text"}
                multiline={multiline ? true : false}
                minRows={3}
                maxRows={4}
                label={label}
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name={name2}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextField
                fullWidth
                helperText={error ? error.message : null}
                error={!!error}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                type={type ? type : "text"}
                multiline={multiline ? true : false}
                minRows={3}
                maxRows={4}
                label={label2}
                variant="outlined"
              />
            )}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};
