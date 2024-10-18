import { Box, Grid, Paper } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import AccountDescription from "./AccountDescription";
import PaymentForm from "./PaymentForm";
function NewPayment() {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid item md={12}>
          <Paper sx={{ p: 1, }}>
            <Grid container>
              <Grid item md={6}>
                <Paper elevation="24" sx={{ p: 2 }}>
                  <PaymentForm formType={"TP"} />
                </Paper>
              </Grid>
              <Grid item md={6}>
                <AccountDescription
                  title={t("accounts.account_payment_voucher")}
                  description={t("accounts.account_payment_voucher_desc")}
                />
              </Grid>
            </Grid>
          </Paper>
      </Grid>
    </Grid>
  );
}

export default NewPayment;
