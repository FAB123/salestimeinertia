import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";

import StarBorder from "@mui/icons-material/StarBorder";
import { green, red } from "@mui/material/colors";
import toaster from "../../../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import { postData } from "../../../../../apis/apiCalls";
import { UPDATEACCOUNTHEADSOB } from "../../../../../constants/apiUrls";
import { useTranslation } from "react-i18next";

export const EditOpeningBalance = (props) => {
  const { items } = props;

  const { t } = useTranslation();
  const [value, setValue] = useState(items.amount);
  const [entryType, setEntryType] = useState(items.entry_type);
  const [showUpdate, setShowUpdate] = useState(true);
  const submit = (account_id) => {
    let data = { account_id, value, entryType };
    setShowUpdate(false);
    postData(UPDATEACCOUNTHEADSOB, data).then((data) => {
      if (data.status === 1) {
        toaster.success(t("accounts.update_account_head"));
      } else {
        toaster.error(t("accounts.update_account_failed"));
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <ListItemButton sx={{ pl: 1, pt: 0, pb: 0 }}>
        <ListItemIcon>
          <StarBorder fontSize="small" sx={{ color: red[500] }} />
        </ListItemIcon>
        <ListItemText
          primary={`${items.account_details.account_id} - ${items.account_details.account_name}`}
        />
        <Stack direction={"row"} spacing={1} sx={{ width: "50%", p: 1 }}>
          <TextField
            label={t("common.opening_balance")}
            size="small"
            variant="outlined"
            value={value}
            fullWidth={true}
            onChange={(e) => setValue(e.target.value)}
          />
          <Select
            value={entryType}
            label="entryType"
            size="small"
            fullWidth={true}
            onChange={(e) => setEntryType(e.target.value)}
          >
            <MenuItem value={"C"}>{t("common.credit")}</MenuItem>
            <MenuItem value={"D"}>{t("common.debit")}</MenuItem>
          </Select>
          {showUpdate && (
            <IconButton>
              <SaveIcon
                // fontSize="small"
                sx={{ color: green[600] }}
                onClick={() => submit(items.account_details.account_id)}
              />
            </IconButton>
          )}
        </Stack>
      </ListItemButton>
    </>
  );
};
