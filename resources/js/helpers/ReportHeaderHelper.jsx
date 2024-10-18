import React from "react";
import { IconButton, Stack } from "@mui/material";
import { t } from "i18next";
import { getData } from "../apis/apiCalls";
import ReceiptIcon from "@mui/icons-material/Receipt";
import moment from "moment";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { GETPURCHASEBYID, GETQUATATIONSALE } from "../constants/apiUrls";
import { toCurrency } from "../constants/constants";
import { router } from "@inertiajs/react";
import { IconEdit } from "@tabler/icons-react";

const getPurchaseType = (purchaseType) => {
    switch (purchaseType) {
        case "CAP":
            return "CASHPURCHASE";
        case "CAPR":
            return "CASHPURCHASERETURN";
        case "CRP":
            return "CREDITPURCHASE";
        case "CRPR":
            return "CREDITPURCHASERETURN";
        default:
            break;
    }
};

const goTo = (purchaseType) => {
    switch (purchaseType) {
        case "CAP":
            router.get("/purchase/new_cash_purchase");
            break;
        case "CAPR":
            router.get("/purchase/cash_purchase_return");
            break;
        case "CRP":
            router.get("/purchase/new_credit_purchase");
            break;
        case "CRPR":
            router.get("/purchase/credit_purchase_return");
            break;
        default:
            break;
    }
};

const salesHeader = (viewReport) => [
    {
        name: "sale_id",
        label: t("common.id"),
    },
    {
        name: "created_at",
        label: t("common.date"),
        options: {
            customBodyRender: (value) =>
                value ? new Date(value).toLocaleString() : "",
        },
    },
    {
        name: "customer_name",
        label: t("customers.customer"),
        options: {},
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
                        return value;
                }
            },
        },
    },
    {
        name: "bill_type",
        label: t("sales.bill_type"),
        options: {},
    },
    {
        name: "sold_quantity",
        label: t("common.quantity"),
        options: {},
    },
    {
        name: "item_cost_price",
        label: t("tables.cost"),
        options: {},
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
        name: "profit",
        label: t("common.profit"),
        options: {
            customBodyRender: (value, tableMeta) =>
                toCurrency(tableMeta.rowData[7] - tableMeta.rowData[6]),
        },
    },
    {
        name: "employee_name",
        label: t("employee.employee"),
        options: {},
    },
    {
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
    {
        name: "sale_id",
        label: " ",
        options: {
            customBodyRender: (value, tableMeta) => (
                <IconButton
                    color="primary"
                    onClick={() => {
                        switch (tableMeta.rowData[3]) {
                            case "CAS":
                                viewReport("CASHSALE", value);
                                break;
                            case "CASR":
                                viewReport("CASHSALERETURN", value);
                                break;
                            case "CRS":
                                viewReport("CREDITSALE", value);
                                break;
                            case "CRSR":
                                viewReport("CREDITSALERETURN", value);
                                break;
                            default:
                                break;
                        }
                    }}
                >
                    <ReceiptIcon />
                </IconButton>
            ),
        },
    },
];

const purchaseHeader = (viewer) => [
    {
        name: "purchase_id",
        label: t("common.id"),
        width: "25%",
        options: {},
    },
    {
        name: "purchase_date",
        label: t("common.date"),
        options: {
            customBodyRender: (value) => {
                return value
                    ? moment(value, "YYYY/MM/DD").format("DD-MM-YYYY")
                    : "";
            },
        },
    },
    {
        name: "supplier_name",
        label: t("suppliers.supplier"),
        options: {},
    },
    {
        name: "purchase_type",
        label: t("sales.bill_type"),
        options: {
            customBodyRender: (value) => {
                switch (value) {
                    case "CAP":
                        return t("reports.cashPurchase");
                    case "CAPR":
                        return t("reports.cashPurchaseReturn");
                    case "CRP":
                        return t("reports.creditPurchase");
                    case "CRPR":
                        return t("reports.creditPurchaseReturn");
                    default:
                        return value;
                }
            },
        },
    },
    {
        name: "purchase_quantity",
        label: t("common.quantity"),
        options: {},
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
        name: "employee_name",
        label: t("employee.employee"),

        options: {},
    },
    {
        name: "reference",
        label: t("common.reference"),
        options: {},
    },
    {
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
    {
        name: "pic_filename",
        label: " ",
        options: {
            customBodyRender: (value, tableMeta) => (
                <Stack>
                    {value && (
                        <IconButton
                            onClick={() => viewer(tableMeta.rowData[0])}
                        >
                            <ReceiptIcon color="primary" />
                        </IconButton>
                    )}
                    {/* <IconButton
                        onClick={() =>
                            EditPurchase(
                                tableMeta.rowData[0],
                                tableMeta.rowData[3]
                            )
                        }
                    >
                        <EditIcon />
                    </IconButton> */}
                </Stack>
            ),
        },
    },
    {
        name: "purchase_id",
        label: " ",
        options: {
            customBodyRender: (value, tableMeta) => (
                <IconButton
                    color="primary"
                    onClick={() => {
                        let purchase_type = getPurchaseType(
                            tableMeta.rowData[3]
                        );

                        let savedItem = JSON.parse(
                            localStorage.getItem(purchase_type)
                        );

                        if (savedItem) {
                            if (savedItem.cartItems.length > 0) {
                                alert(t("sales.cart_not_empty"));
                                return true;
                            }
                        }

                        getData(`${GETPURCHASEBYID}/${value}`).then(
                            (response) => {
                                if (response.status) {
                                    console.log(response.data);
                                    const data = {
                                        inital: true,
                                        purchase_id: response.data?.purchase_id,
                                        cartItems: response.data?.cartItems,
                                        paymentInfo: [],
                                        supplierInfo:
                                            response.data?.supplierInfo,
                                        invoiceImage: response.data
                                            ?.invoiceImage
                                            ? response.data?.invoiceImage
                                            : null,
                                        reference: response.data?.reference,
                                        comments: response.data?.comments,
                                        purchaseDate: new Date(
                                            moment(
                                                response.data?.purchases
                                                    .purchase_date,
                                                "DD/MM/YYYY"
                                            )
                                        ),
                                        include_tax: "0",
                                    };

                                    localStorage.setItem(
                                        purchase_type,
                                        JSON.stringify(data)
                                    );

                                    goTo(tableMeta.rowData[3]);
                                }
                            }
                        );
                    }}
                >
                    <IconEdit />
                </IconButton>
            ),
        },
    },
];

const workorderHeader = (viewReport) => [
    {
        name: "workorder_id",
        label: t("common.id"),
    },
    {
        name: "created_at",
        label: t("common.date"),
        options: {
            customBodyRender: (value) =>
                value ? new Date(value).toLocaleString() : "",
        },
    },
    {
        name: "customer_name",
        label: t("customers.customer"),

        options: {},
    },
    {
        name: "workorder_quantity",
        label: t("common.quantity"),
        options: {},
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
        name: "status",
        label: t("common.status"),
        options: {},
    },
    {
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
    {
        name: "workorder_id",
        label: " ",
        options: {
            customBodyRender: (value) => (
                <IconButton
                    color="primary"
                    onClick={() => {
                        viewReport("WORKORDER", value);
                    }}
                >
                    <ReceiptIcon />
                </IconButton>
            ),
        },
    },
];

const quotationHeader = (viewReport) => [
    {
        name: "quotation_id",
        label: t("common.id"),
    },
    {
        name: "created_at",
        label: t("common.date"),
        options: {
            customBodyRender: (value) =>
                value ? new Date(value).toLocaleString() : "",
        },
    },
    {
        name: "customer_name",
        label: t("customers.customer"),
        options: {},
    },
    {
        name: "quotation_quantity",
        label: t("common.quantity"),
        options: {},
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
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
    {
        name: "quotation_id",
        label: " ",
        options: {
            customBodyRender: (value, tableMeta) => (
                <Stack>
                    <IconButton
                        color="primary"
                        component="span"
                        style={{ padding: "0 5px 0 5px" }}
                        onClick={() => {
                            let savedItem = JSON.parse(
                                localStorage.getItem("CASHSALE")
                            );
                            if (savedItem) {
                                if (savedItem.cartItems.length > 0) {
                                    alert(t("sales.cart_not_empty"));
                                    return true;
                                }
                            }
                            getData(`${GETQUATATIONSALE}/${value}`).then(
                                (response) => {
                                    if (response.status) {
                                        let data = {
                                            inital: false,
                                            cartItems: response.data.cartItems,
                                            customerInfo:
                                                response.data.customerInfo,
                                            billType: "B2B",
                                            comments: tableMeta.rowData[7],
                                            paymentInfo: [],
                                        };
                                        localStorage.setItem(
                                            "CASHSALE",
                                            JSON.stringify(data)
                                        );
                                        alert(t("reports.restore_qutatation"));
                                        router.get("/sales/cash_sales");
                                    }
                                }
                            );
                        }}
                    >
                        <SettingsBackupRestoreIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            viewReport("QUATATION", value);
                        }}
                    >
                        <ReceiptIcon />
                    </IconButton>
                </Stack>
            ),
        },
    },

    // detailed_quotation
];

const requisitionHeader = [
    {
        name: "requisition_id",
        label: t("common.id"),
    },
    {
        name: "created_at",
        label: t("common.date"),
        options: {
            customBodyRender: (value) =>
                value ? new Date(value).toLocaleString() : "",
        },
    },
    {
        name: "employee_name",
        label: t("common.date"),
        options: {},
    },

    {
        name: "from_location",
        label: t("purchase.transfer_from"),
        options: {},
    },
    {
        name: "to_location",
        label: t("purchase.transfer_to"),
        options: {},
    },
    {
        name: "qty",
        label: t("common.quantity"),
        options: {},
    },
    {
        name: "total",
        label: t("common.total"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
];
const summarySalesHeader = [
    {
        name: "date",
        label: t("common.date"),
        options: {},
    },
    {
        name: "sold_quantity",
        label: t("common.quantity"),
        options: {},
    },
    {
        name: "item_cost_price",
        label: t("tables.cost"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
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
        name: "profit",
        label: t("common.profit"),
        options: {
            customBodyRender: (value, tableMeta) =>
                toCurrency(tableMeta.rowData[3] - tableMeta.rowData[2]),
        },
    },
];

const categorySummaryHeader = [
    {
        name: "category",
        label: t("tables.category"),
        options: {},
    },
    {
        name: "sold_quantity",
        label: t("common.quantity"),
        options: {},
    },
    {
        name: "item_cost_price",
        label: t("tables.cost"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "sub_total",
        label: t("common.subtotal"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "profit",
        label: t("common.profit"),
        options: {
            customBodyRender: (value, tableMeta) =>
                toCurrency(tableMeta.rowData[3] - tableMeta.rowData[2]),
        },
    },
];

const itemSummaryHeader = [
    {
        name: "item_name",
        label: t("items.itemname"),
        options: {},
    },
    {
        name: "item_name_ar",
        label: t("items.itemnamear"),
        options: {},
    },
    {
        name: "sold_quantity",
        label: t("common.quantity"),
        options: {},
    },
    {
        name: "item_cost_price",
        label: t("tables.cost"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "sub_total",
        label: t("common.subtotal"),

        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "profit",
        label: t("common.profit"),
        options: {
            customBodyRender: (value, tableMeta) =>
                toCurrency(tableMeta.rowData[4] - tableMeta.rowData[3]),
        },
    },
];

const itemsReportHeader = [
    {
        name: "item_name",
        label: t("items.itemname"),
        options: {},
    },
    {
        name: "item_name_ar",
        label: t("items.itemnamear"),
        options: {},
    },
    {
        name: "category",
        label: t("tables.category"),
        options: {},
    },
    {
        name: "shelf",
        label: t("items.shelf_"),
        options: {},
    },
    {
        name: "quantity",
        label: t("common.quantity"),
        options: {},
    },
    {
        name: "cost_price",
        label: t("tables.cost"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "unit_price",
        label: t("items.unit_price"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "wholesale_price",
        label: t("items.wholesale_price"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "reorder_level",
        label: t("items.reorder_level"),
        options: {},
    },
];

const salesTaxHeader = [
    {
        name: "sale_id",
        label: t("common.id"),
        width: "25%",
        options: {},
    },
    {
        name: "created_at",
        label: t("common.date"),
        options: {
            customBodyRender: (value) =>
                value ? new Date(value).toLocaleString() : "",
        },
    },
    {
        name: "customer_name",
        label: t("customers.customer"),
        options: {},
    },
    {
        name: "customer_vat_number",
        label: t("common.vatnumber"),
        options: {},
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
                        return value;
                }
            },
        },
    },
    {
        name: "bill_type",
        label: t("sales.bill_type"),
        options: {},
    },

    {
        name: "sub_total",
        label: t("common.subtotal"),
        options: {},
    },
    {
        name: "tax",
        label: t("common.tax"),
        // render: (row) => {
        //     if (row.sale_type === "CASR" || row.sale_type === "CRSR") {
        //         return row.tax * -1;
        //     } else {
        //         return row.tax;
        //     }
        // },
    },
    {
        name: "total",
        label: t("common.total"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },

    {
        name: "employee_name",
        label: t("employee.employee"),
        options: {},
    },
    {
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
];

const purchaseTaxHeader = [
    {
        name: "purchase_id",
        label: t("common.id"),
        width: "25%",
        options: {},
    },
    {
        // name: "created_at",
        // label: t("common.date"),
        // options: {
        //     customBodyRender: (value) =>
        //         value ? new Date(value).toLocaleString() : "",
        // },
        name: "purchase_date",
        label: t("common.date"),
        options: {
            customBodyRender: (value) => {
                if (value) {
                    let dt = new Date(value);
                    return `${dt.getDate()}/${dt.getMonth()}/${dt.getFullYear()}`;
                } else {
                    return "";
                }
            },
        },
    },

    {
        name: "supplier_name",
        label: t("suppliers.name"),
        options: {},
    },
    {
        name: "supplier_vat_number",
        label: t("common.vatnumber"),
        options: {},
    },
    {
        name: "reference",
        label: t("common.reference"),
        options: {},
    },
    {
        name: "purchase_type",
        label: t("common.type"),
        options: {
            customBodyRender: (value) => {
                switch (value) {
                    case "CAP":
                        return t("reports.cashPurchase");
                    case "CAPR":
                        return t("reports.cashPurchaseReturn");
                    case "CRP":
                        return t("reports.creditPurchase");
                    case "CRPR":
                        return t("reports.creditPurchaseReturn");
                    default:
                        return value;
                }
            },
        },
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
        name: "employee_name",
        label: t("employee.employee"),
        options: {},
    },
    {
        name: "comments",
        label: t("common.comments"),
        options: {},
    },
];

const taxReportHeader = [
    {
        name: "type",
        label: t("common.type"),
        width: "25%",
        options: {},
    },
    {
        name: "percent",
        label: t("common.percent"),
        width: "25%",
        options: {
            customBodyRender: (value) => `${value} %`,
        },
    },
    {
        name: "subtotal",
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
            customBodyRender: (value, rowInfo) =>
                toCurrency(rowInfo.rowData[2] + rowInfo.rowData[3]),
        },
    },
];

const generalJournalHeader = [
    {
        name: "Reference",
        label: t("common.reference"),
        options: {},
    },
    {
        name: "Date",
        label: t("common.date"),
        options: {},
    },
    {
        name: "DescriptionOrAccountTitle",
        label: t("common.description"),
        options: {},
    },

    {
        name: "AmountDebit",
        label: t("common.debit"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "AmountCredit",
        label: t("common.credit"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "IsLine",
        label: t("common.isline"),
        options: {},
    },
];

const LedgerAccountsBalancesHeader = [
    {
        name: "account_id",
        label: t("accounts.head_id"),
        options: {},
    },
    {
        name: "account_name",
        label: t("accounts.account_name"),
        options: {},
    },
    {
        name: "account_name_ar",
        label: t("accounts.account_name_ar"),
        options: {},
    },
    {
        name: "Balance",
        label: t("common.balance"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
];

const LedgerAccountHeader = [
    {
        name: "created_at",
        label: t("common.date"),
        options: {
            customBodyRender: (value) =>
                value ? new Date(value).toLocaleString() : "",
        },
    },
    {
        name: "description",
        label: t("employee.employee"),
        options: {},
    },
    {
        name: "DebitAmount",
        label: t("common.debit"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "CreditAmount",
        label: t("common.credit"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "balance",
        label: t("common.balance"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
];

const TrialBalanceHeader = [
    {
        name: "account_id",
        label: t("accounts.account_code"),
        options: {},
    },
    {
        name: "account_name",
        label: t("accounts.account_name"),
        options: {},
    },

    {
        name: "TotalDebitOpening",
        label: t("reports.TotalDebitOpening"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "TotalCreditOpening",
        label: t("reports.TotalCreditOpening"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "DebitTransactionPeriod",
        label: t("reports.DebitTransactionPeriod"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "CreditTransactionPeriod",
        label: t("reports.CreditTransactionPeriod"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "TotalDebitClosing",
        label: t("reports.TotalDebitClosing"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
    {
        name: "TotalCreditClosing",
        label: t("reports.TotalCreditClosing"),
        options: {
            customBodyRender: (value) => toCurrency(value),
        },
    },
];

export {
    salesHeader,
    purchaseHeader,
    workorderHeader,
    quotationHeader,
    requisitionHeader,
    summarySalesHeader,
    categorySummaryHeader,
    itemSummaryHeader,
    itemsReportHeader,
    salesTaxHeader,
    purchaseTaxHeader,
    taxReportHeader,
    generalJournalHeader,
    LedgerAccountHeader,
    LedgerAccountsBalancesHeader,
    TrialBalanceHeader,
};
