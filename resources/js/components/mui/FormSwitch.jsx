import React from "react";
import { Controller } from "react-hook-form";
import {Stack, Switch, Typography, FormControl, FormLabel} from "@mui/material";

export const FormSwitch = ({ name, control, label, head }) => {
  return (
    <FormControl fullWidth component="fieldset">
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={0}
        alignItems="baseline"
      >
        {head && (
          <Typography gutterBottom variant="h6" component="div">
            {label}
          </Typography>
        )}
        {!head && <FormLabel>{label}</FormLabel>}

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
              spacing={0}
              alignItems="baseline"
            >
              <Switch color="secondary" checked={value} onChange={onChange} />
            </Stack>
          )}
        />
      </Stack>
    </FormControl>
  );
};
