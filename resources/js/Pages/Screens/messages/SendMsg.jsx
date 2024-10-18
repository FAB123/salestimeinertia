import React from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";

import SendEmail from "./SendEmail";
import SendSMS from "./SendSMS";
import { Box, Grid, Stack } from "@mui/material";

function SendMsg() {
  // const { menuToggled } = useContext(posContext);
  const { t } = useTranslation();

  return (
    <Stack>
      <Breadcrumb labelHead="Message" labelSub="Send SMS/Email Messages" />
        <Grid container spacing={1} mt={1}>
          <Grid item md={6} xs={12}>
            <SendEmail />
          </Grid>
          <Grid item md={6} xs={12}>
            <SendSMS />
          </Grid>
        </Grid>
    </Stack>
  );
}

export default SendMsg;
