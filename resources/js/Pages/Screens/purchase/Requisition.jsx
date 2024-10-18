import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";

import { useTranslation } from "react-i18next";
import {
    Button,
    createTheme,
    Divider,
    Grid,
    Paper,
    Stack,
    ThemeProvider,
    Typography,
} from "@mui/material";
import {
    cartBalance,
    // generateSalesData,
    submitPurchase,
    submitRequisition,
    // submitSales,
} from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import { ToastContainer } from "react-toastify";

import SalesComments from "../../../components/sales/SalesComments";
// import { generatePDF } from "../../helpers/InvoicePrint";

import RequisitionItemTray from "../../../components/purchase/RequisitionItemTray";
import SelectStore from "../../../components/purchase/SelectStore";
import ProgressLoader from "../../../components/ProgressLoader";
import { usePage } from "@inertiajs/react";

function Requisition() {
    const saleType = "REQUISITION";
    const { storeData } = usePage().props;
    //interface setup
    const { t } = useTranslation();
    const [cartQty, setCartQty] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    const defaultValues = {
        inital: true,
        cartItems: [],
        storeTo: null,
        storeFrom: null,
        comments: "",
    };

    const [savedDatas, setSavedDatas] = useState(defaultValues);
    const [disableSubmit, setDisableSubmit] = useState(false);

    //update interface
    useEffect(() => {
        if (!savedDatas.inital) {
            localStorage.setItem(saleType, JSON.stringify({ ...savedDatas }));
        }
        let totalData = savedDatas.cartItems.reduce(
            function (accumulator, item) {
                return {
                    quantity: accumulator.quantity + parseFloat(item.quantity),
                    total: accumulator.total + parseFloat(item.total),
                };
            },
            { quantity: 0, total: 0 }
        );
        setCartQty(totalData.quantity);
        setCartTotal(parseFloat(totalData.total).toFixed(2));
    }, [savedDatas]);

    //initializing;
    useEffect(() => {
        if (localStorage.getItem(saleType)) {
            let savedSale = JSON.parse(localStorage.getItem(saleType));
            setSavedDatas({ ...savedSale, inital: false });
        } else {
            setSavedDatas({ ...savedDatas, inital: false });
        }
    }, []);

    const submit = async () => {
        setDisableSubmit(true);

        if (savedDatas.cartItems.length < 1) {
            toaster.error(t("sales.cartisempty"));
            return;
        }

        if (
            savedDatas?.storeTo?.location_id ===
            savedDatas?.storeFrom?.location_id
        ) {
            toaster.error(t("requisition.stores_not_same"));
            return;
        }

        submitRequisition({
            ...savedDatas,
            storeTo: savedDatas.storeTo.location_id,
            storeFrom: savedDatas.storeFrom.location_id,
            cartQty,
            cartTotal,
        })
            .then((response) => {
                if (response.status) {
                    toaster.success(t(response.message));
                    localStorage.removeItem(saleType);
                    setSavedDatas({ ...defaultValues, inital: false });
                } else {
                    toaster.error(t(response.message));
                }
            })
            .catch((e) => {
                toaster.error(e);
            });
        setDisableSubmit(false);
    };

    const theme = createTheme({
        typography: {
            subtitle1: {
                fontSize: 12,
                fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
            },
            body1: {
                fontWeight: 800,
                fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
            },
        },
    });

    return (
        <Stack>
            <Breadcrumb
                labelHead="Requisition"
                labelSub="Add/Edit Requisition"
            />
            <ToastContainer />
            <ProgressLoader open={disableSubmit} />
            {savedDatas && (
                <Grid container>
                    <Grid item md={9} xs={12}>
                        <Paper sx={{ m: 1 }}>
                            <RequisitionItemTray
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                                saleType={saleType}
                                storeData={storeData}
                            />
                        </Paper>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Paper sx={{ m: 1, p: 3 }}>
                            <SelectStore
                                type="transfer_from"
                                savedDatas={savedDatas}
                                savedValue={savedDatas.storeFrom}
                                setSavedDatas={setSavedDatas}
                            />
                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />
                            <SelectStore
                                type="transfer_to"
                                savedDatas={savedDatas}
                                savedValue={savedDatas.storeTo}
                                setSavedDatas={setSavedDatas}
                            />
                            <Divider sx={{ marginY: 1 }} />
                            <ThemeProvider theme={theme}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography variant="body1" align="left">
                                        {t("common.quantity")}
                                    </Typography>
                                    <Typography variant="body1" align="right">
                                        {cartQty}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        inline="true"
                                        variant="body1"
                                        align="left"
                                    >
                                        {t("common.total")}
                                    </Typography>
                                    <Typography
                                        inline="true"
                                        variant="body1"
                                        align="right"
                                    >
                                        {cartTotal}
                                    </Typography>
                                </Stack>
                            </ThemeProvider>

                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />

                            <SalesComments
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                            />

                            <Paper variant="outlined">
                                <Grid
                                    container
                                    spacing={0.3}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Grid item md={6} xs={12}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            size="small"
                                            onClick={() => {
                                                let confirmAction =
                                                    window.confirm(
                                                        "Are you sure to cancel this cart?"
                                                    );
                                                if (confirmAction) {
                                                    setSavedDatas({
                                                        ...defaultValues,
                                                        inital: false,
                                                    });
                                                }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="small"
                                            disabled={
                                                !savedDatas?.storeTo
                                                    ?.location_id ||
                                                !savedDatas?.storeFrom
                                                    ?.location_id
                                            }
                                            onClick={submit}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
}

export default React.memo(Requisition);
