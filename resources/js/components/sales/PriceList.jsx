import {
  Box,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getData } from "../../apis/apiCalls";
import { GETSALESHISTORY } from "../../constants/apiUrls";
import ProgressLoader from "../ProgressLoader";

function PriceList(props) {
  const { item, savedDatas } = props;
  const [value, setValue] = React.useState("details");
  const customer = savedDatas.customerInfo;
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  useEffect(() => {
    getData(`${GETSALESHISTORY}/${item}/details/null`).then((response) => {
      setItemDetails(response.data);
    });
  }, []);

  const handleChange = (event, newValue) => {
    if (!disableSubmit) {
      setDisableSubmit(true);
      let URL;
      if (customer) {
        URL = `${GETSALESHISTORY}/${item}/${newValue}/${customer.customer_id}`;
      } else {
        URL = `${GETSALESHISTORY}/${item}/${newValue}/null`;
      }
      getData(URL).then((response) => {
        setDisableSubmit(false);
        if (newValue === "details") {
          setItemDetails(response.data);
        } else {
          setData(response.data);
        }
      });
    }
    setValue(newValue);
  };

  return (
    <Box>
      <Paper sx={{ width: "100%", mt: 2 }}>
        <ProgressLoader open={disableSubmit} />
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab value="details" label="Item Details" />
          <Tab value="salesHistory" label={t("sales.previous_sale_history")} />
          {customer && customer.customer_id && (
            <Tab
              value="customerHistory"
              label={t("sales.customer_sale_history")}
            />
          )}
          <Tab value="costHistory" label={t("sales.previous_cost_history")} />
        </Tabs>
      </Paper>

      <Paper elevation={10} sx={{ p: 1, m: 1, mt: 2 }}>
        <Typography align="center" sx={{ m: 2 }}>
          {t("sales.item_details")}
        </Typography>
        {value !== "details" && (
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow />
              <TableCell align="left">{t("common.date")}</TableCell>
              <TableCell align="center">{`${t("common.sale_id")} / ${t(
                "common.purchase_id"
              )}`}</TableCell>
              <TableCell align="center">{t("common.quantity")}</TableCell>
              <TableCell align="right">{t("common.price")}</TableCell>
              <TableRow />
            </TableHead>
            <TableBody>
              {data &&
                data.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="left">{item.date}</TableCell>
                      <TableCell align="center">{item.sale_id}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
        {value === "details" && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Table size="small">
                <TableRow>
                  <TableCell align="left">{t("items.itemname")}</TableCell>
                  <TableCell align="right">{itemDetails.item_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">{t("items.itemnamear")}</TableCell>
                  <TableCell align="right">
                    {itemDetails.item_name_ar}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {t("items.product_category")}
                  </TableCell>
                  <TableCell align="right">{itemDetails.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">{t("items.shelf_")}</TableCell>
                  <TableCell align="right">{itemDetails.shelf}</TableCell>
                </TableRow>
              </Table>
            </Grid>
            <Grid item xs={6}>
              <Table size="small">
                <TableRow>
                  <TableCell align="left">{t("common.cost_price")}</TableCell>
                  <TableCell align="right">{itemDetails.cost_price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">{t("items.unit_price")}</TableCell>
                  <TableCell align="right">{itemDetails.unit_price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    {t("items.wholesale_price")}
                  </TableCell>
                  <TableCell align="right">
                    {itemDetails.wholesale_price}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">{t("items.minimum_price")}</TableCell>
                  <TableCell align="right">
                    {itemDetails.minimum_price}
                  </TableCell>
                </TableRow>
              </Table>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

export default PriceList;
