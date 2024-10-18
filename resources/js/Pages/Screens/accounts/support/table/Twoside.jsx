import React, { useState, useEffect } from "react";
import { useFieldArray, Controller, useWatch } from "react-hook-form";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormInputGroupedDropdown } from "../../../../../components/mui";

function Twoside({ control, name, options, errors }) {
  const { t } = useTranslation();
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDebits, setTotalDebits] = useState(0);

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const calcTotal = useWatch({
    control,
    name: "accountList",
  });

  useEffect(() => {
    var totalDebit = 0;
    var totalCredit = 0;
    calcTotal.map((item) => {
      if (item.type === "C") {
        totalCredit = totalCredit + parseFloat(item.amount);
        return true;
      } else {
        totalDebit = totalDebit + parseFloat(item.amount);
        return true;
      }
    });

    setTotalDebits(totalDebit);
    setTotalCredits(totalCredit);
  }, [calcTotal]);

  return (
    <>
      <TableContainer>
        {errors.accountList && (
          <FormLabel error sx={{ pl: 3 }}>
            {errors.accountList.message}
          </FormLabel>
        )}

        <Table size="small">
          <TableHead></TableHead>
          <TableBody>
            {fields.map((commonField, index) => (
              <TableRow
                key={commonField.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0, p: 2 } }}
              >
                <TableCell
                  align="left"
                  style={{ width: "45%", padding: "2px" }}
                >
                  <FormInputGroupedDropdown
                    label={t("accounts.account_holder_type")}
                    control={control}
                    size={"small"}
                    name={`accountList[${index}].account_id`}
                    options={options}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: "20%", padding: "2px" }}
                >
                  <Controller
                    render={({
                      field: { onChange, value, onBlur },
                      fieldState: { error },
                    }) => (
                      <FormControl variant="standard" fullWidth error={!!error}>
                        <InputLabel id="select-id">
                          {t("common.type")}
                        </InputLabel>
                        <Select
                          onChange={onChange}
                          defaultValue=""
                          labelId="select-id"
                          label={t("common.type")}
                          size="small"
                          onBlur={onBlur}
                        >
                          <MenuItem value={"C"}>{t("common.credit")}</MenuItem>
                          <MenuItem value={"D"}>{t("common.debit")}</MenuItem>
                        </Select>
                        <FormHelperText>
                          {error && error.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                    control={control}
                    name={`accountList[${index}].type`}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: "20%", padding: "2px" }}
                >
                  <Controller
                    name={`accountList[${index}].amount`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        helperText={error && error.message}
                        error={!!error}
                        // disabled={commonField.debit === 0 ? false : true}
                        {...field}
                        control={control}
                        size="small"
                        label={t("common.amount")}
                        variant="standard"
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  style={{ width: "5%", padding: "2px" }}
                >
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell style={{ width: "45%", padding: "2px" }}>
                <Typography>{t("common.total")}</Typography>
              </TableCell>
              <TableCell style={{ width: "20%", padding: "2px" }}>
                <Typography>{totalDebits}</Typography>
              </TableCell>
              <TableCell style={{ width: "20%", padding: "2px" }}>
                <Typography>{totalCredits}</Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Grid container alignItems="center" justifyContent="center">
        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => {
            append({ account_id: null, type: "C", amount: 0 });
          }}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Grid>
    </>
  );
}

export default Twoside;
