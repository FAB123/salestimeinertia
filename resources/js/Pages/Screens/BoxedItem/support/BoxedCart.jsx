import {
  Autocomplete,
  Stack,
  TextField,
  TableHead,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Alert,
} from "@mui/material";
import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { getData } from "../../../../apis/apiCalls";
import { useState } from "react";
import { SEARCHSALEITEMLIST } from "../../../../constants/apiUrls";

function BoxedCart({ control, watch, setValue, errors }) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productList",
  });

  const [itemList, setItemList] = useState([]);
  const [query, setQuery] = useState("");

  const addToCart = (item) => {
    const productList = watch("productList");
    const findItem = productList.findIndex((x) => x.item_id === item.item_id);
    if (findItem === -1) {
      append({
        item_id: item.item_id,
        item_name: item.item_name,
        unit_price: item.unit_price,
        quantity: 1,
      });
    } else {
      let oldQuantity = productList[findItem].quantity;
      setValue(`productList[${findItem}].quantity`, parseInt(oldQuantity) + 1);
    }
  };
  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        sx={{ width: "100%" }}
        inputValue={query}
        clearOnEscape={true}
        options={itemList}
        // getOptionLabel={(option) =>
        //   ` ${option.category} / ${option.item_name} / Available Stock: ${option.item_quantity}`
        // }
        getOptionLabel={(option) => {
          let item =
            option.stock_type === 1
              ? ` / Available Stock: ${option.quantity}`
              : "";
          return `${option.category} / ${option.item_name} ${item}`;
        }}
        onChange={(event, value) => {
          setQuery("");
          setItemList([]);
          if (value) {
            addToCart(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            //inputRef={queryRef}
            size="small"
            label="Start typing Item Name or scan Barcode..."
            autoFocus={true}
            onChange={(e) => {
              let searchItem = e.target.value;
              if (searchItem !== "" || searchItem !== null) {
                setQuery(searchItem);
              }

              if (searchItem.length > 2) {
                getData(
                  `${SEARCHSALEITEMLIST}${searchItem}`
                ).then((data) => {
                  setItemList(data.data);
                });
              } else {
                setItemList([]);
              }
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      <Stack direction="row" spacing={2}>
        <TableContainer>
          <Paper variant="outlined">
            <Table
              sx={{ Width: 100 }}
              stickyHeader
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">Item</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="left">
                      {field.item_name}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {field.unit_price}
                    </TableCell>
                    <TableCell align="right">
                      <Controller
                        name={`productList[${index}].quantity`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            helperText={error ? error.message : null}
                            error={!!error}
                            {...field}
                            control={control}
                            sx={{ maxWidth: 60 }}
                            variant="standard"
                          />
                        )}
                      />

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
            </Table>
          </Paper>
        </TableContainer>
      </Stack>
      {errors.productList && (
        <Alert variant="filled" severity="error">
          {t("bundleditem.product_list_required")}
        </Alert>
      )}
    </Stack>
  );
}

export default BoxedCart;
