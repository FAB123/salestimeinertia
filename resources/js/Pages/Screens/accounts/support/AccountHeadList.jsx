import { Box, Grid, List, ListSubheader, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getData } from "../../../../apis/apiCalls";
import { ALLACCOUNTHEADS } from "../../../../constants/apiUrls"; 
import AccountDescription from "./AccountDescription";

import { TreeHead } from "./TreeView";

function AccountHeadList() {
  const [accountList, setAccountList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getData(ALLACCOUNTHEADS).then((response) => {
      let new_array = [];
      Object.entries(response.data).forEach((entry) => {
        const [key, value] = entry;
        let new_sub_array = [];
        Object.entries(value).forEach((subEntry) => {
          const [subKey, subValue] = subEntry;
          new_sub_array.push({ name: subKey, name_ar: "", child: subValue });
        });
        new_array.push({ name: key, name_ar: "", child: new_sub_array });
      });
      setAccountList(new_array);
    });
  }, []);

  return (
    <Grid container>
      <Grid item md={12}>
          <Paper sx={{ p: 1 }}>
            <Grid container>
              <Grid item md={6}>
                <Paper elevation={24} sx={{ p: 2 }}>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {t("accounts.list_of_account_heads")}
                      </ListSubheader>
                    }
                  ></List>

                  {accountList &&
                    accountList.map((type) => {
                      return <TreeHead type={type} key={type.name} />;
                    })}
                </Paper>
              </Grid>
              <Grid item md={6}>
                <AccountDescription
                  title={t("accounts.list_of_account_heads")}
                  description={t("accounts.list_of_account_heads_desc")}
                />
              </Grid>
            </Grid>
          </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountHeadList;
