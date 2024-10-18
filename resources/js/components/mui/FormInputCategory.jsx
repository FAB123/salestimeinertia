import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, TextField, Autocomplete } from "@mui/material";
import { useState } from "react";
import { getData } from "../../apis/apiCalls";


export const FormInputCategory = ({
  name,
  control,
  label,
  size,
  helperText,
}) => {
  const [itemList, setItemList] = useState([]);
  return (
    <FormControl fullWidth sx={{ p: 0.8 }}>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <Autocomplete
              freeSolo
              sx={{ width: "100%" }}
              clearOnEscape={true}
              options={itemList}
              getOptionLabel={(option) => option.category}
              value={{ category: value && value }}
              //onChange={onChange}
              onChange={(event, value) => {
                setItemList([]);
                if (value) {
                  onChange(value.category);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={error ? error.message : helperText}
                  error={!!error}
                  value={value}
                  size={size === "small" ? "small" : "medium"}
                  label={label}
                  autoFocus={true}
                  onChange={(e) => {
                    let searchItem = e.target.value;
                    if (searchItem.length > 2) {
                      getData(`/items/search_category/${searchItem}`).then(
                        (data) => {
                          setItemList(data.data);
                        }
                      );
                    } else {
                      setItemList([]);
                    }
                    onChange(e);
                  }}
                />
              )}
            />
          );
        }}
      />
    </FormControl>
  );
};
