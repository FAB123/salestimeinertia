import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItem,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";

export const FormInputGroupedDropdown = ({
  name,
  control,
  label,
  options,
  size,
}) => {
  const generateSingleOptions = () => {
    return options.map((option) => {
      const menuItem = option.child.map((subItem) => {
        const listItems = subItem.child.map((item) => {
          return (
            <MenuItem
              sx={{ pl: 8 }}
              key={item.account_id}
              value={item.account_id}
            >
              {item.account_name}
            </MenuItem>
          );
        });
        return [
          <ListSubheader sx={{ pl: 5, pt: 0, pb: 0 }}>
            {subItem.name}
          </ListSubheader>,
          listItems,
        ];
      });
      return [<ListItem>{option.name}</ListItem>, menuItem];
    });
  };

  return (
    <Controller
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <FormControl variant="standard" fullWidth error={!!error}>
          <InputLabel id="select-id">{label}</InputLabel>
          <Select
            onChange={onChange}
            defaultValue=""
            labelId="select-id"
            label={label}
            size={size ? size : "medium"}
            onBlur={onBlur}
          >
            {generateSingleOptions()}
          </Select>
          <FormHelperText>{error && error.message}</FormHelperText>
        </FormControl>
      )}
      control={control}
      name={name}
    />
  );
};
