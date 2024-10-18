import { IconButton, Stack } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import Breadcrumb from "../../../components/Breadcrumb";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import {
    GETALLSUSPENEDSALE,
    GETSUSPENEDSALE,
} from "../../../constants/apiUrls";

import { getData } from "../../../apis/apiCalls";
import { router } from "@inertiajs/react";
import DetailedTableHelper from "../../../components/table/DetailedTableHelper";
import toaster from "../../../helpers/toaster";

const getSaleType = (saleType) => {
    switch (saleType) {
        case "CAS":
            return "CASHSALE";
        case "CASR":
            return "CASHSALERETURN";
        case "CRS":
            return "CREDITSALE";
        case "CRSR":
            return "CREDITSALERETURN";
        default:
            break;
    }
};

function Suspended() {
    const { t } = useTranslation();

    const goTo = (saleType) => {
        switch (saleType) {
            case "CAS":
                router.get("/sales/cash_sales");
                break;
            case "CASR":
                router.get("/sales/cash_sales_return");
                break;
            case "CRS":
                router.get("/sales/credit_sales");
                break;
            case "CRSR":
                router.get("/sales/credit_sales_return");
                break;
            default:
                break;
        }
    };

    const header = [
        {
            name: "suspended_id",
            label: t("common.id"),
            options: {},
        },
        {
            name: "customer.name",
            label: t("customers.customer"),
            options: {},
        },
        {
            name: "bill_type",
            label: t("sales.bill_type"),
            options: {},
        },
        {
            name: "sale_type",
            label: t("sales.sale_type"),
            options: {
                customBodyRender: (value) => getSaleType(value),
            },
        },
        {
            name: "sub_total",
            label: t("common.subtotal"),
            options: {},
        },
        {
            name: "tax",
            label: t("common.tax"),
            options: {},
        },
        {
            name: "total",
            label: t("common.total"),
            options: {},
        },
        {
            name: "comments",
            label: t("common.comments"),
            options: {},
        },
        {
            name: "suspended_id",
            label: " ",
            options: {
                print: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                color="primary"
                                component="span"
                                style={{ padding: "0 5px 0 5px" }}
                                onClick={() => {
                                    let sale_type = getSaleType(
                                        tableMeta.rowData[3]
                                    );
                                    let savedItem = JSON.parse(
                                        localStorage.getItem(sale_type)
                                    );
                                    if (savedItem) {
                                        if (savedItem.cartItems.length > 0) {
                                            toaster.error(t("sales.cart_not_empty"));
                                            return true;
                                        }
                                    }

                                    getData(
                                        `${GETSUSPENEDSALE}/restore/${value}`
                                    ).then((response) => {
                                        if (response.status) {
                                            let data = {
                                                inital: false,
                                                cartItems:
                                                    response.data.cartItems,
                                                customerInfo:
                                                    response.data.customerInfo,
                                                billType: tableMeta.rowData[2],
                                                comments: tableMeta.rowData[7]
                                                    ? tableMeta.rowData[7]
                                                    : "",
                                                paymentInfo: [],
                                            };
                                            localStorage.setItem(
                                                sale_type,
                                                JSON.stringify(data)
                                            );
                                            goTo(tableMeta.rowData[3]);
                                        }
                                    });
                                }}
                            >
                                <SettingsBackupRestoreIcon />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];

    const title = t("sales.suspended_sale");
    return (
        <Stack>
            <Breadcrumb
                labelHead={t("sales.view_suspended_sale")}
                labelSub="View Suppliers"
            />

            <DetailedTableHelper
                title={title}
                header={header}
                url={GETALLSUSPENEDSALE}
                detailsURL={GETSUSPENEDSALE}
                detailsKey="suspended_id"
                primaryKey="suspended_id"
            />
        </Stack>
    );
}

export default Suspended;
