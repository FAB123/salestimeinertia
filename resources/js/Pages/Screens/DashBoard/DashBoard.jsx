import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Box, Grid, Stack } from "@mui/material";
import Breadcrumbs from "../../../components/Breadcrumb";
import Widget from "../../../components/Widget";
import { getData } from "../../../apis/apiCalls";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import {
    GETBASICCONFIG,
    GETPURCHASEGRPAH,
    GETSALESGRPAH,
} from "../../../constants/apiUrls";

import LineGraph from "./LineGraph";

function DashBoard() {
    const { t } = useTranslation();
    const loadingText = t("common.loading");

    const [totalItem, setTotalItem] = useState(loadingText);
    const [totalSupplier, setTotalSupplier] = useState(loadingText);
    const [totalCustomer, setTotalCustomer] = useState(loadingText);
    const [totalEmployee, setTotalEmployee] = useState(loadingText);

    useEffect(() => {
        getData(GETBASICCONFIG).then((response) => {
            setTotalItem(response.data.total_items);
            setTotalSupplier(response.data.total_supplier);
            setTotalCustomer(response.data.total_customer);
            setTotalEmployee(response.data.total_employee);
        });
    }, []);
    return (
        <Stack>
            <Breadcrumbs
                labelHead={t("modules.dashboard")}
                labelSub="Overview about Store"
            />
            <Box sx={{ p: 1 }}>
                <Grid container>
                    <Grid item md={12}>
                        <Grid container>
                            <Grid item md={3} xs={12}>
                                <Widget
                                    icon={<AccountCircleOutlinedIcon />}
                                    title={t("modules.customers")}
                                    content={totalCustomer}
                                    theme="#9c27b0"
                                    themeForgound="#7b1fa2"
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <Widget
                                    icon={<SecurityOutlinedIcon />}
                                    title={t("modules.suppliers")}
                                    content={totalSupplier}
                                    theme="#673ab7"
                                    themeForgound="#512da8"
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <Widget
                                    icon={<DnsOutlinedIcon />}
                                    title={t("modules.items")}
                                    content={totalItem}
                                    theme="#607d8b"
                                    themeForgound="#455a64"
                                />
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <Widget
                                    icon={<SecurityOutlinedIcon />}
                                    title={t("modules.employee")}
                                    content={totalEmployee}
                                    theme="#ffa726"
                                    themeForgound="#f57c00"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <LineGraph
                            title={t("common.monthly_sale")}
                            type={"S"}
                            url={GETSALESGRPAH}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <LineGraph
                            title={t("common.monthly_purchase")}
                            type={"P"}
                            url={GETPURCHASEGRPAH}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Stack>
    );
}

export default DashBoard;
