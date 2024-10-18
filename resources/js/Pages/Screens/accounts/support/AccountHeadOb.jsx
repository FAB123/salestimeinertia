import {
  Box,
  Grid,
  List,
  ListSubheader,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getData } from "../../../../apis/apiCalls";
import { GETACCOUNTHEADOB } from "../../../../constants/apiUrls";
import AccountDescription from "./AccountDescription";
import { EditOpeningBalance } from "./EditOb";

function AccountHeadOb() {
  const [accountList, setAccountList] = useState([]);
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getData(GETACCOUNTHEADOB).then((response) => {
      if (response.status) {
        setAccountList(response.accounts);
      }
    });
  }, []);

  return (
    <Grid container>
      <Grid item md={12}>
          <Paper sx={{ p: 1 }}>
            <Grid container>
              <Grid item md={12} sx={{ mr: 3, mb: 1 }}>
                <AccountDescription
                  title={t("accounts.ob_of_account_heads")}
                  description={t("accounts.ob_of_account_heads_desc")}
                />
              </Grid>
              <Grid item md={12}>
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

                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableBody>
                        {accountList &&
                          accountList
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((items) => {
                              return (
                                <EditOpeningBalance
                                  items={items}
                                  key={items.account_details.account_id}
                                />
                              );
                            })}
                      </TableBody>
                      <TableFooter>
                        <TablePagination
                          rowsPerPageOptions={[5, 15, 25, 100]}
                          component="div"
                          count={accountList.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
      </Grid>
    </Grid>
  );
}

export default AccountHeadOb;
