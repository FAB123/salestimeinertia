import { ThemeProvider } from "@emotion/react";
import { createTheme, Stack, Switch, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import toaster from "../../helpers/toaster";

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
      fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
    },
    body1: {
      fontWeight: 800,
      fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
    },
  },
});

function PurchaseTotal({ savedDatas, setSavedDatas }) {
  const { t, i18n } = useTranslation();
  const cart_total = useRef(0);
  const cart_subtotal = useRef(0);
  const cart_vat = useRef(0);
  const cart_qty = useRef(0);
  useEffect(() => {
    let totalData = savedDatas.cartItems.reduce(
      function (accumulator, item) {
        return {
          quantity: accumulator.quantity + parseFloat(item.quantity),
          subTotal: accumulator.subTotal + parseFloat(item.subTotal),
          vat: accumulator.vat + parseFloat(item.vat),
          total: accumulator.total + parseFloat(item.total),
        };
      },
      { quantity: 0, subTotal: 0, vat: 0, total: 0 }
    );

    cart_qty.current.innerText = totalData.quantity;
    cart_total.current.innerText = parseFloat(totalData.total).toFixed(2);
    cart_subtotal.current.innerText = parseFloat(totalData.subTotal).toFixed(2);
    cart_vat.current.innerText = parseFloat(totalData.vat).toFixed(2);
  }, [savedDatas]);

  const onChange = (e) => {
    let convert = savedDatas.include_tax === "1" ? "0" : "1";
    if (savedDatas.cartItems.length > 0) {
      toaster.warning(t("purchase.change_tax_status"));
    } else {
      setSavedDatas({ ...savedDatas, include_tax: convert });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" align="left">
          {t("configuration.include_tax")}
        </Typography>

        <Switch
          checked={savedDatas.include_tax === "1" ? true : false}
          onChange={onChange}
          color="secondary"
        />
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" align="left">
          {t("common.quantity")}
        </Typography>
        <Typography variant="body1" align="right" ref={cart_qty}>
          0
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography inline="true" variant="body1" align="left">
          {t("common.subtotal")}
        </Typography>
        <Typography
          inline="true"
          variant="body1"
          align="right"
          ref={cart_subtotal}
        >
          0.00
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography inline="true" variant="body1" align="left">
          {t("common.vat")}
        </Typography>
        <Typography inline="true" variant="body1" align="right" ref={cart_vat}>
          0.00
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography inline="true" variant="body1" align="left">
          {t("common.total")}
        </Typography>
        <Typography
          inline="true"
          variant="body1"
          align="right"
          ref={cart_total}
        >
          0
        </Typography>
      </Stack>
    </ThemeProvider>
  );
}

export default PurchaseTotal;
