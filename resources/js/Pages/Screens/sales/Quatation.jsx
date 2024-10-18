import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import SelectCustomer from "../../../components/sales/SelectCustomer";
import CartControll from "../../../components/sales/CartControll";
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
    // generateQutationOrWorkorderData,
    submitSales,
} from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import SalesComments from "../../../components/sales/SalesComments";
import {
    callPrint,
    // generatePDF,
    // templateData,
} from "../../../helpers/InvoicePrint";
import ProgressLoader from "../../../components/ProgressLoader";
import { usePage } from "@inertiajs/react";
import InfoRow from "../../../components/sales/InfoRow";

function Quatation() {
    const saleType = "QUATATION";
    const {
        storeData,
        configurationData,
        storeID,
        companyLogo,
        invoiceTemplate,
    } = usePage().props;
    //interface setup
    const { t } = useTranslation();

    //assign refs
    const cart_total = useRef(0);
    const cart_subtotal = useRef(0);
    const cart_vat = useRef(0);
    const cart_qty = useRef(0);

    const defaultValues = {
        inital: true,
        cartItems: [],
        paymentInfo: [],
        customerInfo: null,
        printAfterSale: false,
        comments: "",
    };

    const [savedDatas, setSavedDatas] = useState(defaultValues);
    const [disableSubmit, setDisableSubmit] = useState(false);

    //update interface
    useEffect(() => {
        if (!savedDatas.inital) {
            localStorage.setItem(saleType, JSON.stringify({ ...savedDatas }));
        }
        if (savedDatas.cartItems) {
            let totalData = savedDatas.cartItems.reduce(
                function (accumulator, item) {
                    return {
                        quantity:
                            accumulator.quantity + parseFloat(item.quantity),
                        subTotal:
                            accumulator.subTotal + parseFloat(item.subTotal),
                        vat: accumulator.vat + parseFloat(item.vat),
                        total: accumulator.total + parseFloat(item.total),
                    };
                },
                { quantity: 0, subTotal: 0, vat: 0, total: 0 }
            );

            cart_qty.current.innerText = totalData.quantity;
            cart_total.current.innerText = parseFloat(totalData.total).toFixed(
                2
            );
            cart_subtotal.current.innerText = parseFloat(
                totalData.subTotal
            ).toFixed(2);
            cart_vat.current.innerText = parseFloat(totalData.vat).toFixed(2);
        }
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
        let amounts = await cartBalance(saleType);

        let cartInfo = {
            ...savedDatas,
            store_id: storeID,
            paymentInfo: {
                total: amounts.total,
                subtotal: amounts.subTotal,
                tax: amounts.tax,
            },
        };
        if (cartInfo.cartItems.length < 1) {
            toaster.error(t("sales.cartisempty"));
            return;
        }
        if (cartInfo.customerInfo === null) {
            toaster.error(t("sales.emptycustomer"));
            return;
        }
        submitSales(saleType, cartInfo)
            .then((response) => {
                if (response.status) {
                    toaster.success(t(response.message));
                    // generateQutationOrWorkorderData(response.invoice_data, saleType).then(
                    //   (resp) => {
                    //     console.log(resp);
                    //     generatePDF(templateData.QUOTATION, resp);
                    //   }
                    // );

                    callPrint(
                        response,
                        saleType,
                        companyLogo,
                        invoiceTemplate,
                        storeData,
                        configurationData
                    );

                    localStorage.removeItem(saleType);
                    setSavedDatas(defaultValues);
                }
            })
            .catch((e) => {
                toaster.error(e);
            });

        setTimeout(() => {
            setDisableSubmit(false);
        }, 100);
    };

    return (
        <Stack>
            <Breadcrumb
                labelHead="Quatatation"
                labelSub="Add/Edit Quatatation"
            />
            <ToastContainer />
            <ProgressLoader open={disableSubmit} />
            {savedDatas && (
                <Grid container spacing={1} mt={0.2}>
                    <Grid item md={9} xs={12}>
                        <CartControll
                            savedDatas={savedDatas}
                            setSavedDatas={setSavedDatas}
                            saleType={saleType}
                            storeData={storeData}
                            configurationData={configurationData}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Paper sx={{ p: 1.5 }}>
                            <SelectCustomer
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                            />
                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />
                            <Stack>
                                <InfoRow
                                    label="common.quantity"
                                    value="0"
                                    valueRef={cart_qty}
                                />
                                <InfoRow
                                    label="common.subtotal"
                                    value="0.00"
                                    valueRef={cart_subtotal}
                                />
                                <InfoRow
                                    label="common.vat"
                                    value="0.00"
                                    valueRef={cart_vat}
                                />
                                <InfoRow
                                    label="common.total"
                                    value="0"
                                    valueRef={cart_total}
                                />
                            </Stack>

                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />

                            <SalesComments
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                            />

                            <Paper variant="outlined">
                                <Stack
                                    direction="row"
                                    divider={
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                    }
                                    spacing={0.5}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    m={1}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        size="small"
                                        disabled={
                                            savedDatas.cartItems.length < 1 ||
                                            savedDatas.customerInfo === null
                                                ? true
                                                : false
                                        }
                                        onClick={submit}
                                    >
                                        COMPLEET
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        size="small"
                                        onClick={() => {
                                            let confirmAction = window.confirm(
                                                "Are you sure to cancel this cart?"
                                            );
                                            if (confirmAction) {
                                                setSavedDatas(defaultValues);
                                            }
                                        }}
                                    >
                                        <u>C</u>ancel
                                    </Button>
                                </Stack>
                            </Paper>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
}

export default React.memo(Quatation);
