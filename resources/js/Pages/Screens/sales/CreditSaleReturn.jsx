import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import SelectCustomer from "../../../components/sales/SelectCustomer";
import CartControll from "../../../components/sales/CartControll";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Paper, Stack } from "@mui/material";
import { cartBalance, submitSales } from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import SalesComments from "../../../components/sales/SalesComments";
import { callPrint } from "../../../helpers/InvoicePrint";
import { B2BSALE } from "../../../constants/constants";
import SalesTotal from "../../../components/sales/SalesTotal";
import { FormInputDiscount } from "../../../components/mui";
import ProgressLoader from "../../../components/ProgressLoader";
import { usePage } from "@inertiajs/react";

const useHotKey = (callback) => {
    React.useEffect(() => {
        const keyDown = (e) => {
            var name = e.key;
            if (name === "Shift") {
                return;
            }
            if (name === "!") {
                if (e.shiftKey) {
                    callback.current.click();
                }
            }
            return;
        };
        document.body.addEventListener("keydown", keyDown);
        return () => document.body.removeEventListener("keydown", keyDown);
    }, [callback]);
};

function CreditSaleReturn() {
    const saleType = "CREDITSALERETURN";
    const { storeData, configurationData, storeID } = usePage().props;
    //interface setup
    const { t } = useTranslation();

    //assign refs
    const paymentRef = useRef(null);

    const defaultValues = {
        inital: true,
        cartItems: [],
        paymentInfo: [],
        customerInfo: null,
        billType: B2BSALE,
        workorderID: null,
        quotationID: null,
        printAfterSale: false,
        comments: "",
    };

    useHotKey(paymentRef);

    const [savedDatas, setSavedDatas] = useState(defaultValues);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [discount, setDiscount] = useState(0);

    //update interface
    useEffect(() => {
        if (!savedDatas.inital) {
            localStorage.setItem(saleType, JSON.stringify({ ...savedDatas }));
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
        if (!disableSubmit) {
            setDisableSubmit(true);
            let amounts = await cartBalance(saleType);
            let cartInfo = {
                ...savedDatas,
                store_id: storeID,
                sale_type: "CRSR",
                paymentInfo: {
                    discount: discount,
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
                        toaster.success(response.message);
                        if (response.print_after_sale) {
                            callPrint(response, saleType);
                        }
                        localStorage.removeItem(saleType);
                        setDiscount(0);
                        setSavedDatas({ ...defaultValues, inital: false });
                    } else {
                        toaster.error(response.message);
                    }
                })
                .catch((e) => {
                    toaster.error(e);
                });

            setTimeout(() => {
                setDisableSubmit(false);
            }, 100);
        }
    };

    return (
        <Stack>
            <Breadcrumb
                labelHead="CREDIT SALE RETURN"
                labelSub="Add/Edit Credit Sales Return"
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

                            <SalesTotal
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                                discount={discount}
                            />

                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />

                            <FormInputDiscount
                                discount={discount}
                                setDiscount={setDiscount}
                            />

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
                                    mb={2}
                                    m={1}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        size="small"
                                        ref={paymentRef}
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
                                </Stack>
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
                                        fullWidth
                                        size="small"
                                    >
                                        Suspend
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
                                                setDiscount(0);
                                                setSavedDatas({
                                                    ...defaultValues,
                                                    printAfterSale:
                                                        savedDatas.printAfterSale,
                                                    inital: false,
                                                });
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

export default React.memo(CreditSaleReturn);
