import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import DeleteIcon from "@mui/icons-material/Delete";
import StarBorder from "@mui/icons-material/StarBorder";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { green, indigo, red } from "@mui/material/colors";
import toaster from "../../../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import { getData, postData } from "../../../../../apis/apiCalls";
import {
  DELETEACCOUNTHEAD,
  UPDATEACCOUNTHEADS,
} from "../../../../../constants/apiUrls";
import { useTranslation } from "react-i18next";

export const TreeList = (props) => {
  const { items } = props;
  const [value, setValue] = useState(items.account_name);
  const [view, setView] = useState(true);
  const [accountName, setAccountName] = useState(items.account_name);
  const [showEdit, setShowEdit] = useState(false);
  const { t } = useTranslation();
  const submit = (account_id) => {
    if (value.length < 3) {
      toaster.error(t("accounts.head_name_list"));
    } else {
      let data = { account_id, value };
      postData(UPDATEACCOUNTHEADS, data).then((data) => {
        if (data.status === 1) {
          toaster.success(t("accounts.update_account_head"));
          setAccountName(value);
          setShowEdit(false);
        } else {
          toaster.error(t("accounts.update_account_failed"));
        }
      });
    }
  };

  const deleteItem = (accountId) => {
    if (window.confirm(t("accounts.delete_account_head"))) {
      getData(DELETEACCOUNTHEAD + "/?account_id=" + accountId).then((data) => {
        if (data.status) {
          setView(false);
          toaster.success(t("accounts.account_head_deleted"));
        } else {
          toaster.success(t("accounts.account_head_deleting_failed"));
        }
      });
    }
  };
  return (
    <>
      <ToastContainer />
      {view && (
        <ListItemButton sx={{ pl: 8, pt: 0, pb: 0 }}>
          <ListItemIcon>
            <StarBorder fontSize="small" sx={{ color: red[500] }} />
          </ListItemIcon>
          <ListItemText primary={`${items.account_id} - ${accountName}`} />
          {items.editable === 1 && (
            <>
              <IconButton>
                <BorderColorIcon
                  fontSize="small"
                  onClick={() => setShowEdit(!showEdit)}
                  sx={{ color: indigo[500] }}
                />
              </IconButton>
              <IconButton>
                <DeleteIcon
                  fontSize="small"
                  sx={{ color: red[800] }}
                  onClick={() => deleteItem(items.account_id)}
                />
              </IconButton>
            </>
          )}
        </ListItemButton>
      )}
      {showEdit && (
        <Stack direction={"row"} sx={{ pl: 15, pt: 1, pb: 1 }}>
          <TextField
            label="Header Name"
            size="small"
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <IconButton>
            <DoneOutlineIcon
              fontSize="small"
              sx={{ color: green[600] }}
              onClick={() => submit(items.account_id)}
            />
          </IconButton>
        </Stack>
      )}
    </>
  );
};
