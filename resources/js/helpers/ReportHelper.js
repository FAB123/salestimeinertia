import {
    GETPURCHASEBYID,
    GETQUATATIONBYID,
    GETREQUISITIONBYID,
    GETSALEBYID,
    GETWORKORDERDETAILSBYID,
    
} from "../constants/apiUrls";
import i18n from "../i18n";
import {
    salesHeader,
    purchaseHeader,
    workorderHeader,
    quotationHeader,
    summarySalesHeader,
    categorySummaryHeader,
    itemSummaryHeader,
    itemsReportHeader,
    salesTaxHeader,
    purchaseTaxHeader,
    generalJournalHeader,
    LedgerAccountHeader,
    LedgerAccountsBalancesHeader,
    TrialBalanceHeader,
    taxReportHeader,
    requisitionHeader,
} from "./ReportHeaderHelper";
const salesList = [
    {
        value: "ALL",
        name: i18n.t("reports.all"),
    },
    {
        value: "CRS",
        name: i18n.t("reports.creditSale"),
    },
    {
        value: "CRSR",
        name: i18n.t("reports.creditSaleReturn"),
    },
    {
        value: "CAS",
        name: i18n.t("reports.cashSale"),
    },
    {
        value: "CASR",
        name: i18n.t("reports.cashSaleReturn"),
    },
];

const purchaseList = [
    {
        value: "ALL",
        name: i18n.t("reports.all"),
    },
    {
        value: "CRP",
        name: i18n.t("reports.creditPurchase"),
    },
    {
        value: "CRPR",
        name: i18n.t("reports.creditPurchaseReturn"),
    },
    {
        value: "CAP",
        name: i18n.t("reports.cashPurchase"),
    },
    {
        value: "CAPR",
        name: i18n.t("reports.cashPurchaseReturn"),
    },
];

//report tables helpers
const locationHelper = {
    location_id: "ALL",
    location_name_en: i18n.t("reports.all"),
};

const gererateReportUrl = (
    type,
    from,
    to,
    option1,
    option2,
    location,
    viewer,
    viewReport
) => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case "detailed_sales":
                resolve({
                    url: `/reports/detailed_sales/${from}/${to}/${option1}/${location}`,
                    header: salesHeader(viewReport),
                    primaryKey: "sale_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "unit_price",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETSALEBYID,
                    },
                });
                break;
            case "detailed_purchase":
                resolve({
                    url: `/reports/detailed_purchases/${from}/${to}/${option1}/${location}`,
                    header: purchaseHeader(viewer),
                    primaryKey: "purchase_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETPURCHASEBYID,
                    },
                });
                break;
            case "detailed_workorder":
                resolve({
                    url: `/reports/detailed_workorder/${from}/${to}/${option1}/${location}`,
                    header: workorderHeader(viewReport),
                    primaryKey: "workorder_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "unit_price",
                            "unit",
                            "quantity",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                            "description",
                        ],
                        url: GETWORKORDERDETAILSBYID,
                    },
                });
                break;
            case "detailed_quotation":
                resolve({
                    url: `/reports/detailed_quotation/${from}/${to}/${location}`,
                    header: quotationHeader(viewReport),
                    primaryKey: "quotation_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "unit_price",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETQUATATIONBYID,
                    },
                });
                break;
            case "detailed_requisition":
                resolve({
                    url: `/reports/detailed_requisition/${from}/${to}/${location}`,
                    header: requisitionHeader,
                    primaryKey: "requisition_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "cost_price",
                            "total",
                        ],
                        url: GETREQUISITIONBYID,
                    },
                });
                break;
            case "summary_sales":
                resolve({
                    url: `/reports/summary_sales/${from}/${to}/${option1}/${location}`,
                    header: summarySalesHeader,
                    primaryKey: "created_at",
                });
                break;
            case "employee_sales":
                resolve({
                    url: `/reports/employee_sales/${from}/${to}/${option1}/${option2}/${location}`,
                    header: salesHeader(viewReport),
                    primaryKey: "sale_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "unit_price",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETSALEBYID,
                    },
                });
                break;
            case "customer_sales":
                resolve({
                    url: `/reports/customer_sales/${from}/${to}/${option1}/${option2}/${location}`,
                    header: salesHeader(viewReport),
                    primaryKey: "sale_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "unit_price",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETSALEBYID,
                    },
                });
                break;
            case "category_sales":
                resolve({
                    url: `/reports/category_sales/${from}/${to}/${option1}/${location}`,
                    header: categorySummaryHeader,
                    primaryKey: "sale_id",
                });
                break;
            case "item_sales":
                resolve({
                    url: `/reports/item_sales/${from}/${to}/${option1}/${location}`,
                    header: itemSummaryHeader,
                    primaryKey: "sale_id",
                });
                break;
            case "summary_purchase":
                resolve({
                    url: `/reports/summary_purchase/${from}/${to}/${option1}/${location}`,
                    header: summarySalesHeader,
                    primaryKey: "purchase_id",
                });
                break;
            case "employee_purchase":
                resolve({
                    url: `/reports/employee_purchase/${from}/${to}/${option1}/${option2}/${location}`,
                    header: purchaseHeader(viewer),
                    primaryKey: "purchase_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETPURCHASEBYID,
                    },
                });
                break;
            case "supplier_purchase":
                resolve({
                    url: `/reports/supplier_purchase/${from}/${to}/${option1}/${option2}/${location}`,
                    header: purchaseHeader(viewer),
                    primaryKey: "purchase_id",
                    detailed: {
                        header: [
                            "item_name",
                            "item_name_ar",
                            "quantity",
                            "unit",
                            "subTotal",
                            "discount",
                            "vat",
                            "total",
                        ],
                        url: GETPURCHASEBYID,
                    },
                });
                break;
            case "category_purchase":
                resolve({
                    url: `/reports/category_purchase/${from}/${to}/${option1}/${location}`,
                    header: categorySummaryHeader,
                    primaryKey: "purchase_id",
                });
                break;
            case "item_purchase":
                resolve({
                    url: `/reports/item_purchase/${from}/${to}/${option1}/${location}`,
                    header: itemSummaryHeader,
                    primaryKey: "purchase_id",
                });
                break;
            case "summary_workorder":
                resolve({
                    url: `/reports/summary_workorder/${from}/${to}/${location}`,
                    header: summarySalesHeader,
                    primaryKey: "workorder_id",
                });
                break;
            case "summary_qutatation":
                resolve({
                    url: `/reports/summary_qutatation/${from}/${to}/${location}`,
                    header: summarySalesHeader,
                    primaryKey: "qutation_id",
                });
                break;
            case "low_inventory":
                resolve({
                    url: `/reports/low_inventory/${location}`,
                    header: itemsReportHeader,
                    primaryKey: "item_id",
                });
                break;
            case "inventory_summary":
                resolve({
                    url: `/reports/inventory_summary/${location}`,
                    header: itemsReportHeader,
                    primaryKey: "item_id",
                });
                break;
            case "sales_tax":
                resolve({
                    url: `/reports/sales_tax/${from}/${to}/${location}`,
                    header: salesTaxHeader,
                    primaryKey: "sale_id",
                });
                break;
            case "purchase_tax":
                resolve({
                    url: `/reports/purchase_tax/${from}/${to}/${location}`,
                    header: purchaseTaxHeader,
                    primaryKey: "purchase_id",
                });
                break;
            case "generate_tax_reports":
                resolve({
                    url: `/reports/generate_tax_reports/${from}/${to}/${location}`,
                    header: taxReportHeader,
                });
                break;
            case "journal_report":
                resolve({
                    url: `/reports/journal_report/${from}/${to}/${location}`,
                    header: generalJournalHeader,
                });
                break;
            case "ledger_accounts_balances":
                resolve({
                    url: `/reports/ledger_accounts_balances/${from}/${to}/${location}`,
                    header: LedgerAccountsBalancesHeader,
                });
                break;
            case "trail_balance":
                resolve({
                    url: `/reports/trail_balance/${from}/${to}/${location}`,
                    header: TrialBalanceHeader,
                });
                break;
            case "ledger_details":
                resolve({
                    url: `/reports/ledger_details/${from}/${to}/${option1}/${location}`,
                    header: LedgerAccountHeader,
                });
                break;
            case "customer_ledger_details":
                resolve({
                    url: `/reports/customer_ledger_details/${from}/${to}/${option2}/${location}`,
                    header: LedgerAccountHeader,
                });
                break;
            case "supplier_ledger_details":
                resolve({
                    url: `/reports/supplier_ledger_details/${from}/${to}/${option2}/${location}`,
                    header: LedgerAccountHeader,
                });
                break;
            default:
                resolve({
                    url: `/reports/detailed_sales/${from}/${to}/${option1}/${option2}/${location}`,
                    header: salesHeader,
                    primaryKey: "sale_id",
                });
                break;
        }
    });
};
export { salesList, purchaseList, locationHelper, gererateReportUrl };
