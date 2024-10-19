// export const baseUrl = import.meta.env.REACT_APP_API_URL;

import InboxIcon from "@mui/icons-material/MoveToInbox";

import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ApartmentIcon from "@mui/icons-material/Apartment";

export const B2BSALE = "B2B";
export const B2CSALE = "B2C";

const menuData = [
    { icon: BarChartOutlinedIcon, label: "dashboard", link: "/dashboard" },
    {
        icon: AccountCircleOutlinedIcon,
        label: "customers",
        menus: [
            {
                label: "add_customers",
            },
            {
                label: "view_customers",
            },
        ],
    },
    {
        icon: ApartmentIcon,
        label: "suppliers",
        menus: [
            {
                label: "add_suppliers",
            },
            {
                label: "view_suppliers",
            },
        ],
    },
    {
        icon: ShoppingCartOutlinedIcon,
        label: "sales",
        menus: [
            {
                label: "cash_sales",
            },
            {
                label: "cash_sales_return",
            },
            {
                label: "credit_sales",
            },
            {
                label: "credit_sales_return",
            },
            {
                label: "quotation",
            },
            {
                label: "workorder",
            },
        ],
    },

    {
        icon: LocalShippingOutlinedIcon,
        label: "purchase",
        menus: [
            {
                label: "new_cash_purchase",
            },
            {
                label: "cash_purchase_return",
            },
            {
                label: "new_credit_purchase",
            },
            {
                label: "credit_purchase_return",
            },
            {
                label: "requisition",
            },
        ],
    },
    {
        icon: SecurityOutlinedIcon,
        label: "employee",
        menus: [
            {
                label: "add_employee",
            },
            {
                label: "view_employee",
            },
        ],
    },
    {
        icon: DnsOutlinedIcon,
        label: "items",
        menus: [
            {
                label: "add_items",
            },
            {
                label: "view_items",
            },
            {
                label: "opening_stock",
            },
            {
                label: "price_updater",
            },
        ],
    },
    {
        icon: DashboardOutlinedIcon,
        label: "bundleditems",
        menus: [
            {
                label: "add_bundleditems",
            },
            {
                label: "view_bundleditems",
            },
        ],
    },
    {
        icon: AccountBalanceOutlinedIcon,
        label: "accounts",
    },
    {
        icon: ArticleOutlinedIcon,
        label: "reports",
    },
    {
        icon: ForwardToInboxOutlinedIcon,
        label: "messages",
    },
    {
        icon: SettingsOutlinedIcon,
        label: "configurations",
    },
];

const permissionItemList = [
    { label: "dashboard", items: [{ label: "dashboard" }] },
    {
        label: "customers",
        items: [
            {
                label: "add_customers",
            },
            {
                label: "view_customers",
            },
        ],
    },
    {
        label: "suppliers",
        items: [
            {
                label: "add_suppliers",
            },
            {
                label: "view_suppliers",
            },
        ],
    },
    {
        label: "sales",
        items: [
            {
                label: "cash_sales",
            },
            {
                label: "cash_sales_return",
            },
            {
                label: "credit_sales",
            },
            {
                label: "credit_sales_return",
            },
            {
                label: "quotation",
            },
            {
                label: "workorder",
            },
        ],
    },

    {
        label: "purchase",
        items: [
            {
                label: "new_cash_purchase",
            },
            {
                label: "cash_purchase_return",
            },
            {
                label: "new_credit_purchase",
            },
            {
                label: "credit_purchase_return",
            },
            {
                label: "requisition",
            },
        ],
    },
    {
        label: "employee",
        items: [
            {
                label: "add_employee",
            },
            {
                label: "view_employee",
            },
        ],
    },
    {
        label: "items",
        items: [
            {
                label: "add_items",
            },
            {
                label: "view_items",
            },
            {
                label: "opening_stock",
            },
            {
                label: "price_updater",
            },
        ],
    },
    {
        label: "bundleditems",
        items: [
            {
                label: "add_bundleditems",
            },
            {
                label: "view_bundleditems",
            },
        ],
    },
    {
        label: "accounts",
        items: [{ label: "accounts" }],
    },
    {
        label: "reports",
        items: [{ label: "reports" }],
    },
    {
        label: "messages",
        items: [{ label: "messages" }],
    },
    {
        label: "configurations",
        items: [{ label: "configurations" }],
    },
];

const paymentTypes = [
    { value: "cash", name: "common.cash", label: "Cash" },
    { value: "creditcard", name: "common.creditcard", label: "Credit Card" },
    { value: "debitcard", name: "common.debitcard", label: "Debit Card" },
    { value: "bank", name: "common.bank", label: "Bank" },
];

const numberVarients = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "0", label: "0" },
    { value: "clr", label: "CLR" },
    { value: "bck", label: "BCK" },
];

const CalcNumberVarients = [
    { value: "ac", label: "AC", type: "Option" },
    { value: "sign", label: "+/-", type: "Option" },
    { value: "tax+", label: "TAX+", type: "Option" },
    { value: "tax-", label: "TAX-", type: "Option" },
    { value: "7", label: "7", type: "Number" },
    { value: "8", label: "8", type: "Number" },
    { value: "9", label: "9", type: "Number" },
    { value: "/", label: "/", type: "Option" },
    { value: "4", label: "4", type: "Number" },
    { value: "5", label: "5", type: "Number" },
    { value: "6", label: "6", type: "Number" },
    { value: "X", label: "X", type: "Option" },
    { value: "1", label: "1", type: "Number" },
    { value: "2", label: "2", type: "Number" },
    { value: "3", label: "3", type: "Number" },
    { value: "-", label: "-", type: "Option" },
    { value: "0", label: "0", type: "Number" },
    { value: ".", label: ".", type: "Number" },
    { value: "=", label: "=", type: "Option" },
    { value: "+", label: "+", type: "Option" },
];

const toCurrency = (num = null) => {
    return num ? (Math.round(num * 100) / 100).toFixed(2) : "";
};

const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
};

const accountHolderType = [
    {
        label: "modules.customers",
        value: "C",
    },
    {
        label: "modules.suppliers",
        value: "S",
    },
];

const journalHolderType = [
    {
        label: "modules.customers",
        value: "C",
    },
    {
        label: "modules.suppliers",
        value: "S",
    },
    {
        label: "modules.employee",
        value: "E",
    },
];

const accountsNatures = [
    {
        label: "accounts.account_asset",
        value: 1,
    },
    {
        label: "accounts.account_equity",
        value: 2,
    },
    {
        label: "accounts.account_liabilities",
        value: 3,
    },
    {
        label: "accounts.account_income",
        value: 4,
    },
    {
        label: "accounts.account_expenses",
        value: 5,
    },
];
const accountCodeList = [
    { label: "accounts.account_fixed_asset", value: "100-199" },
    { label: "accounts.account_current_asset", value: "200-299" },
    { label: "accounts.account_equity", value: "300-399" },
    { label: "accounts.account_liabilities", value: "400-499" },
    { label: "accounts.account_direct_income", value: "500-599" },
    { label: "accounts.account_indirect_income", value: "600-699" },
    { label: "accounts.account_direct_expenses", value: "700-799" },
    { label: "accounts.account_indirect_expenses", value: "800-899" },
];
const accountsTypes = {
    1: [
        { label: "accounts.account_fixed_asset", value: 1 },
        { label: "accounts.account_current_asset", value: 2 },
    ],
    2: [{ label: "accounts.account_equity", value: 3 }],
    3: [{ label: "accounts.account_liabilities", value: 4 }],
    4: [
        { label: "accounts.account_direct_income", value: 5 },
        { label: "accounts.account_indirect_income", value: 6 },
    ],
    5: [
        { label: "accounts.account_direct_expenses", value: 7 },
        { label: "accounts.account_indirect_expenses", value: 8 },
    ],
};

export {
    paymentTypes,
    CalcNumberVarients,
    toCurrency,
    openInNewTab,
    numberVarients,
    accountsNatures,
    accountCodeList,
    accountsTypes,
    accountHolderType,
    journalHolderType,
    menuData,
    permissionItemList,
};
