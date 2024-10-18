import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { Stack, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";
import { GETDAILYSALES } from "../../../constants/apiUrls";
import moment from "moment";

import PosDrawer from "../../../components/PosDrawer";
import ReportViewer from "./ReportViewer";

import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

import ReportTables from "../../../components/table/ReportTables";

function DailyReport() {
    const { t } = useTranslation();
    const title = t("sales.daily_sales");
    const primaryKey = "sale_id";
    const header = [
        {
            name: "sale_id",
            label: t("common.sale_id"),
            options: {
                customBodyRender: (value, tableMeta) => (
                    <Typography
                        sx={{ color: "blue", cursor: "pointer" }}
                        onClick={() => {
                            switch (tableMeta.rowData[2]) {
                                case "CAS":
                                    setSaleType("CASHSALE");
                                    break;
                                case "CASR":
                                    setSaleType("CASHSALERETURN");
                                    break;
                                case "CRS":
                                    setSaleType("CREDITSALE");
                                    break;
                                case "CRSR":
                                    setSaleType("CREDITSALERETURN");
                                    break;
                                default:
                                    break;
                            }
                            setInvoiceNumber(value);
                            setOpenReport(true);
                        }}
                    >
                        {value}
                    </Typography>
                ),
            },
        },
        {
            name: "transaction_time",
            label: t("common.date"),
        },
        {
            name: "sale_type",
            label: t("sales.sale_type"),
            options: {
                customBodyRender: (value) => {
                    switch (value) {
                        case "CAS":
                            return t("reports.cashSale");
                        case "CASR":
                            return t("reports.cashSaleReturn");
                        case "CRS":
                            return t("reports.creditSale");
                        case "CRSR":
                            return t("reports.creditSaleReturn");
                        default:
                            break;
                    }
                },
            },
        },
        {
            name: "bill_type",
            label: t("sales.bill_type"),
        },
        {
            name: "sub_total",
            label: t("common.subtotal"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "tax",
            label: t("common.tax"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "total",
            label: t("common.total"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "payment",
            label: t("tables.payment_method"),
            options: {
                customBodyRender: (value) =>
                    value.map((payment) => {
                        return `${payment.payment_name_en} [ ${payment.payment_name_ar} ] : ${payment.amount} `;
                    }),
            },
        },
    ];

    const [openReport, setOpenReport] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [url, setURL] = useState(null);

    const [saleType, setSaleType] = useState(null);

    const date = moment().format("DD-MM-YYYY");
    // const fromDate = date.setHours(0, 0);
    // const toDate = date.setHours(23, 59);
    // const maxDate = date.setDate(date.getDate() + 1);

    const [generatedFromDate, setGeneratedFromDate] = useState(
        // new Date(fromDate).toISOString()
        date
    );
    const [generatedToDate, setGeneratedToDate] = useState(
        // new Date(toDate).toISOString()
        date
    );

    useEffect(() => {
        setURL(`${GETDAILYSALES}/${generatedFromDate}/${generatedToDate}`);
    }, [generatedFromDate, generatedToDate]);

    // const selectDate = (
    //     <Paper sx={{ m: 1, p: 2 }}>
    //         <Stack direction="row">
    //             <Flatpickr
    //                 options={{
    //                     mode: "range",
    //                     enableTime: false,
    //                     dateFormat: "d-m-Y H:m:i",
    //                     maxDate: maxDate,
    //                     defaultDate: [generatedFromDate, generatedToDate],
    //                 }}
    //                 render={({ defaultValue, value, ...props }, ref) => {
    //                     return (
    //                         <TextField
    //                             size="small"
    //                             defaultValue={defaultValue}
    //                             inputRef={ref}
    //                             sx={{ width: 400 }}
    //                             label={t("common.date")}
    //                         />
    //                     );
    //                 }}
    //                 onChange={([fromDate, toDate]) => {
    //                     setGeneratedFromDate(new Date(fromDate).toISOString());
    //                     setGeneratedToDate(new Date(toDate).toISOString());
    //                 }}
    //             />
    //         </Stack>
    //     </Paper>
    // );

    return (
        <Stack>
            <Breadcrumb labelHead={t("sales.daily_sales")} labelSub="Sales" />
            <PosDrawer open={openReport} setOpen={setOpenReport}>
                <ReportViewer
                    saleType={saleType}
                    setOpenReport={setOpenReport}
                    invoiceNumber={invoiceNumber}
                />
            </PosDrawer>
            {/* {selectDate} */}
            <ReportTables
                title={title}
                header={header}
                url={url}
                primaryKey={primaryKey}
                type="direct"
                customToolbar={
                    <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Flatpickr
                            options={{
                                mode: "range",
                                enableTime: false,
                                dateFormat: "d-m-Y",
                                maxDate: date,
                                defaultDate: [
                                    generatedFromDate,
                                    generatedToDate,
                                ],
                            }}
                            render={(
                                { defaultValue, value, ...props },
                                ref
                            ) => {
                                return (
                                    <TextField
                                        size="small"
                                        variant="standard"
                                        defaultValue={defaultValue}
                                        inputRef={ref}
                                        sx={{ width: 400 }}
                                        label={t("common.date")}
                                    />
                                );
                            }}
                            onChange={([fromDate, toDate]) => {
                                if (fromDate && toDate) {
                                    setGeneratedFromDate(
                                        moment(fromDate).format("DD-MM-YYYY")
                                    );
                                    setGeneratedToDate(
                                        moment(toDate).format("DD-MM-YYYY")
                                    );
                                }
                            }}
                        />
                    </Stack>
                }
            />
        </Stack>
    );
}

export default DailyReport;
