import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getData } from "../../../apis/apiCalls";
import ReactECharts from "echarts-for-react";
import MonthNames from "./MonthNames";
import BarChartIcon from "@mui/icons-material/BarChart";
import { IconChartLine } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";

function LineGraph({ title, type, url }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [style, setStyle] = useState("line");

    const { t } = useTranslation();

    var today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(
        `${today.getMonth() + 1}/${today.getFullYear()}`
    );

 
    const option =
        type === "P"
            ? {
                  legend: {
                      data: [
                          t("reports.cashPurchase"),
                          t("reports.cashPurchaseReturn"),
                          t("reports.creditPurchase"),
                          t("reports.creditPurchaseReturn"),
                      ],
                  },
                  xAxis: {
                      type: "category",
                      data: data.dates,
                  },
                  yAxis: {
                      type: "value",
                  },
                  series: [
                      {
                          name: t("reports.cashPurchase"),
                          data: data.cash_purchase,
                          type: style,
                          smooth: true,
                      },
                      {
                          name: t("reports.cashPurchaseReturn"),
                          data: data.cash_purchase_return,
                          type: style,
                          smooth: true,
                      },
                      {
                          name: t("reports.creditPurchase"),
                          data: data.credit_purchase,
                          type: style,
                          smooth: true,
                      },
                      {
                          name: t("reports.creditPurchaseReturn"),
                          data: data.credit_purchase_return,
                          type: style,
                          smooth: true,
                      },
                  ],
              }
            : {
                  legend: {
                      data: [
                          t("reports.cashSale"),
                          t("reports.cashSaleReturn"),
                          t("reports.creditSale"),
                          t("reports.creditSaleReturn"),
                      ],
                  },
                  xAxis: {
                      type: "category",
                      data: data.dates,
                  },
                  yAxis: {
                      type: "value",
                  },
                  series: [
                      {
                          name: t("reports.cashSale"),
                          data: data.cash_sale,
                          type: style,
                          smooth: true,
                      },
                      {
                          name: t("reports.cashSaleReturn"),
                          data: data.cash_sale_return,
                          type: style,
                          smooth: true,
                      },
                      {
                          name: t("reports.creditSale"),
                          data: data.credit_sale,
                          type: style,
                          smooth: true,
                      },
                      {
                          name: t("reports.creditSaleReturn"),
                          data: data.credit_sale_return,
                          type: style,
                          smooth: true,
                      },
                  ],
              };

    useEffect(() => {
        setLoading(true);
        getData(`${url}/${selectedMonth}`).then((response) => {
            setData(response.data);
            setLoading(false);
        });
    }, [selectedMonth]);

    return (
        <Paper elevation={20} sx={{ m: 1, p: 2 }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{title}</Typography>
                <Stack direction={"row"} spacing={1}>
                    <MonthNames
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                    />
                    <IconButton
                        color="secondary"
                        onClick={() =>
                            setStyle(style === "line" ? "bar" : "line")
                        }
                    >
                        {style === "line" ? (
                            <BarChartIcon />
                        ) : (
                            <IconChartLine />
                        )}
                    </IconButton>
                </Stack>
            </Stack>
            {loading ? (
                <CircularProgress color="secondary" />
            ) : (
                <ReactECharts option={option} style={{ height: 360 }} />
            )}
        </Paper>
    );
}

export default LineGraph;
