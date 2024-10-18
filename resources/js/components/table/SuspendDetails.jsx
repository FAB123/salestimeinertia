import React, { useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GETSUSPENEDSALE } from "../../constants/apiUrls";
import { getData } from "../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import ProgressLoader from "../../components/ProgressLoader";

function SuspendDetails({ id }) {
  const [details, setDetails] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setDisableSubmit(true);
    getData(`${GETSUSPENEDSALE}/view/${id}`).then((resp) => {
      if (resp.status) {
        setDetails(resp.data.cartItems);
        setDisableSubmit(false);
      }
    });
  }, []);
  return (
    <Stack sx={{ m: 1 }}>
      <ProgressLoader open={disableSubmit} />
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead
            sx={{
              backgroundColor: "pink",
            }}
          >
            <TableRow>
              <TableCell>{t("items.itemname")}</TableCell>
              <TableCell align="center">{t("items.itemnamear")}</TableCell>
              <TableCell align="center">
                {t("items.product_category")}
              </TableCell>
              <TableCell align="center">{t("items.item_quantity")}</TableCell>
              <TableCell align="center">{t("items.unit_price")}</TableCell>
              <TableCell align="center">{t("common.discount")}</TableCell>
              <TableCell align="center">{t("common.subtotal")}</TableCell>
              <TableCell align="center">{t("common.tax")}</TableCell>
              <TableCell align="center">{t("common.total")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((row) => {
              let total =
                row.suspended_quantity * row.item_sub_total + row.tax_amount;
              return (
                <TableRow
                  key={"1"}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.item_name}
                  </TableCell>
                  <TableCell align="center">{row.item_name_ar}</TableCell>
                  <TableCell align="center">{row.category}</TableCell>
                  <TableCell align="center">{row.quantity}</TableCell>
                  <TableCell align="center">{`${row.unit_price} / ${row.unit}`}</TableCell>
                  <TableCell align="center">{`${row.discount} ${
                    row.discount_type === "C" ? "" : "%"
                  }`}</TableCell>
                  <TableCell align="center">{row.subTotal}</TableCell>
                  <TableCell align="center">{row.vat}</TableCell>
                  <TableCell align="center">{row.total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default SuspendDetails;
