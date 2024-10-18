import React from "react";
import { useFieldArray, Controller } from "react-hook-form";

import { Grid, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormInputDropdown, FormInputText } from "../../../../../components/mui";

function Oneside({ control, name, options }) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      {fields.map((field, index) => (
        <div key={index}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <FormInputDropdown
                label={t("common.paymentType")}
                control={control}
                name={`accountList[${index}].account_id`}
                options={options}
              />
            </Grid>
            <Grid item xs={4}>
              <Stack sx={{ pt: 1 }}>
                <Controller
                  name={`accountList[${index}].amount`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormInputText
                      helperText={error && error.message}
                      error={!!error}
                      {...field}
                      control={control}
                      label={t("common.amount")}
                    />
                  )}
                />
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack sx={{ pt: 3 }}>
                <IconButton
                  color="error"
                  sx={{ p: "10px" }}
                  aria-label="directions"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </div>
      ))}

      <Grid container alignItems="center" justifyContent="center">
        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => {
            append({ account_id: null, amount: 0 });
          }}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Grid>
    </>
  );
}

export default Oneside;
