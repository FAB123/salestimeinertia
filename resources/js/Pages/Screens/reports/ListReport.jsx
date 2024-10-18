import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import DescriptionIcon from "@mui/icons-material/Description";
import {
    Card,
    CardContent,
    Divider,
    Drawer,
    Grid,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Stack,
    Typography,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import { salesList, purchaseList } from "../../../helpers/ReportHelper";

import ProgressLoader from "../../../components/ProgressLoader";
import { getData } from "../../../apis/apiCalls";
import {
    GETALLACCOUNTHEADS,
    GETALLWORKORDERSTATUS,
} from "../../../constants/apiUrls";
import ReportInput from "./ReportInput";

function ListReport() {
    const { t } = useTranslation();
    const [openInput, setOpenInput] = useState(false);
    const [options, setOptions] = useState(false);
    const [headerLists, setHeaderLists] = useState(null);

    const [workorders, setWorkorders] = useState([
        { name: "All", value: "ALL" },
    ]);

    const callOptions = (type, optionsOne, optionsTwo) => {
        setOptions({
            type: type,
            optionsOne: optionsOne,
            optionsTwo: optionsTwo,
        });
        setOpenInput(true);
    };

    useEffect(() => {
        getData(GETALLACCOUNTHEADS).then((response) =>
            setHeaderLists(response.data)
        );

        getData(GETALLWORKORDERSTATUS).then((response) => {
            if (response.status) {
                let status = response.data.map((item) => ({
                    name: `${item.status_name_en} [${item.status_name_ar}]`,
                    value: item.id,
                }));
                setWorkorders((prev) => [...prev, ...status]);
            }
        });
    }, []);

    // let headerLists = await getData(GETALLACCOUNTHEADS).then(
    //     (response) => response.data
    // );
    const reportsList = [
        {
            head_name: "detailed_reports",
            options: [
                {
                    type: "detailed_sales",
                    optionsOne: salesList,
                    optionsTwo: false,
                },
                {
                    type: "detailed_purchase",
                    optionsOne: purchaseList,
                    optionsTwo: false,
                },
                {
                    type: "detailed_workorder",
                    optionsOne: workorders,
                    optionsTwo: false,
                },
                {
                    type: "detailed_quotation",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "detailed_requisition",
                    optionsOne: false,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "sales_reports",
            options: [
                {
                    type: "summary_sales",
                    optionsOne: salesList,
                    optionsTwo: false,
                },

                {
                    type: "employee_sales",
                    optionsOne: salesList,
                    optionsTwo: "employee",
                },
                {
                    type: "customer_sales",
                    optionsOne: salesList,
                    optionsTwo: "customer",
                },
                {
                    type: "category_sales",
                    optionsOne: salesList,
                    optionsTwo: false,
                },
                {
                    type: "item_sales",
                    optionsOne: salesList,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "purchase_reports",
            options: [
                {
                    type: "summary_purchase",
                    optionsOne: purchaseList,
                    optionsTwo: false,
                },
                {
                    type: "employee_purchase",
                    optionsOne: purchaseList,
                    optionsTwo: "employee",
                },
                {
                    type: "supplier_purchase",
                    optionsOne: purchaseList,
                    optionsTwo: "supplier",
                },
                {
                    type: "category_purchase",
                    optionsOne: purchaseList,
                    optionsTwo: false,
                },
                {
                    type: "item_purchase",
                    optionsOne: purchaseList,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "summary_workorder_qutatation",
            options: [
                {
                    type: "summary_workorder",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "summary_qutatation",
                    optionsOne: false,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "inventory_reports",
            options: [
                {
                    type: "low_inventory",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "inventory_summary",
                    optionsOne: false,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "tax_reports",
            options: [
                {
                    type: "sales_tax",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "purchase_tax",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "generate_tax_reports",
                    optionsOne: false,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "account_reports",
            options: [
                {
                    type: "journal_report",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "ledger_accounts_balances",
                    optionsOne: false,
                    optionsTwo: false,
                },
                {
                    type: "ledger_details",
                    optionsOne: headerLists,
                    optionsTwo: false,
                },
                {
                    type: "trail_balance",
                    optionsOne: false,
                    optionsTwo: false,
                },
            ],
        },
        {
            head_name: "account_personal_reports",
            options: [
                {
                    type: "customer_ledger_details",
                    optionsOne: false,
                    optionsTwo: "customer",
                },
                {
                    type: "supplier_ledger_details",
                    optionsOne: false,
                    optionsTwo: "supplier",
                },
            ],
        },
    ];

    const reportInput = (
        <Drawer
            open
            onKeyDown={(e) => {
                e.key === "Escape" && setOpenInput(false);
            }}
            PaperProps={{
                sx: {
                    width: { md: "fit-content" },
                    height: { md: "fit-content" },
                    left: { md: "30%" },
                    top: { md: "20%" },
                    borderRadius: 1,
                },
            }}
        >
            <ReportInput optionsList={options} setOpenInput={setOpenInput} />
        </Drawer>
    );

    return (
        <Stack>
            {/* <ProgressLoader open={loading} /> */}
            <Breadcrumb labelHead="Reports" labelSub="View Compleet Reports" />
            {openInput && reportInput}
            <Grid container spacing={1} sx={{ mt: 1 }}>
                {reportsList &&
                    reportsList.map((report, index) => {
                        return (
                            <Grid item md={3} sm={6} xs={12} key={index}>
                                <Card sx={{ height: "100%" }}>
                                    <CardContent>
                                        <Stack>
                                            <Stack justifyContent={"center"}>
                                                <Typography
                                                    variant="body1"
                                                    color={pink[500]}
                                                    // gutterBottom={true}
                                                    align={"center"}
                                                >
                                                    {t(
                                                        `reports.${report.head_name}`
                                                    )}
                                                </Typography>
                                                <Divider />
                                            </Stack>
                                            <Stack>
                                                <MenuList>
                                                    {report.options &&
                                                        report.options.map(
                                                            (opt, index2) => {
                                                                return (
                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            callOptions(
                                                                                opt.type,
                                                                                opt.optionsOne,
                                                                                opt.optionsTwo
                                                                            );
                                                                        }}
                                                                        key={
                                                                            index2
                                                                        }
                                                                        dense={
                                                                            true
                                                                        }
                                                                        sx={{
                                                                            whiteSpace:
                                                                                "normal",
                                                                        }}
                                                                    >
                                                                        <ListItemIcon>
                                                                            <DescriptionIcon fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText>
                                                                            {t(
                                                                                `reports.${opt.type}`
                                                                            )}
                                                                        </ListItemText>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                        >
                                                                            ⌘X
                                                                        </Typography>
                                                                    </MenuItem>
                                                                );
                                                            }
                                                        )}
                                                </MenuList>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
            </Grid>
        </Stack>
    );
}

export default ListReport;
