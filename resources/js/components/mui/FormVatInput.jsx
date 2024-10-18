import React from "react";
import { useFieldArray, Controller } from "react-hook-form";

import { Grid, TextField, InputAdornment, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export const FormVatInput = ({ control, editable }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vatList",
  });

  return (
    <>
      {fields.map((field, index) => (
        <Stack direction={"row"} spacing={1} sx={{ pb: 1, ml:1, mr:1 }} key={index}>
          <Stack>
            <Controller
              name={`vatList[${index}].tax_name`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...field}
                  control={control}
                  rows={3}
                  rowsmax={4}
                  label={`VAT ${index + 1}`}
                  variant="outlined"
                />
              )}
            />
          </Stack>
          <Stack>
            <Controller
              name={`vatList[${index}].percent`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  {...field}
                  control={control}
                  rows={3}
                  rowsmax={4}
                  label={t("common.percent")}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Stack>

          {editable && (
            <Stack>
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
          )}
        </Stack>
        // <div key={index}>
        //   <Grid
        //     container
        //     spacing={1}
        //     sx={{
        //       m: 1,
        //     }}
        //   >
        //     <Grid item xs={6}>
        //       <Controller
        //         name={`vatList[${index}].tax_name`}
        //         control={control}
        //         render={({ field, fieldState: { error } }) => (
        //           <TextField
        //             helperText={error ? error.message : null}
        //             error={!!error}
        //             {...field}
        //             control={control}
        //             rows={3}
        //             rowsmax={4}
        //             label={`VAT ${index + 1}`}
        //             variant="outlined"
        //           />
        //         )}
        //       />
        //     </Grid>
        //     <Grid item xs={6}>
        //       <Controller
        //         name={`vatList[${index}].percent`}
        //         control={control}
        //         render={({ field, fieldState: { error } }) => (
        //           <TextField
        //             helperText={error ? error.message : null}
        //             error={!!error}
        //             {...field}
        //             control={control}
        //             rows={3}
        //             rowsmax={4}
        //             label={t("common.percent")}
        //             variant="outlined"
        //             InputProps={{
        //               endAdornment: (
        //                 <InputAdornment position="end">%</InputAdornment>
        //               ),
        //             }}
        //           />
        //         )}
        //       />
        //       {editable && (
        //         <IconButton
        //           color="error"
        //           sx={{ p: "10px" }}
        //           aria-label="directions"
        //           onClick={() => {
        //             remove(index);
        //           }}
        //         >
        //           <DeleteIcon />
        //         </IconButton>
        //       )}
        //     </Grid>
        //   </Grid>
        // </div>
      ))}

      {editable && (
        <Grid container alignItems="center" justifyContent="center">
          <IconButton
            aria-label="delete"
            size="large"
            onClick={() => {
              append({ tax_name: "VAT ID", percent: 0 });
            }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Grid>
      )}
    </>
  );
};
