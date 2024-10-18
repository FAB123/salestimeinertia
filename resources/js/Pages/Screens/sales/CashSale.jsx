import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import CartControll from "../../../components/sales/CartControll";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Paper, Stack } from "@mui/material";
import {
    cartBalance,
    // generateSalesData,
    submitSales,
} from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import Splitpayment from "../../../components/sales/Splitpayment";
import SalesComments from "../../../components/sales/SalesComments";
import { callPrint } from "../../../helpers/InvoicePrint";
import { B2CSALE } from "../../../constants/constants";
import { getData, postData } from "../../../apis/apiCalls";
import { GETALLACTIVEPAYMENTS, SUSPENDSALE } from "../../../constants/apiUrls";
import SelectCustomer from "../../../components/sales/SelectCustomer";
import { useMemo } from "react";
import { colorList } from "../../../helpers/GeneralHelper";
import SalesTotal from "../../../components/sales/SalesTotal";
import { FormInputDiscount } from "../../../components/mui";
// import SimpleReceipt from "../../components/bundled/sales/Invoices/SimpleReceipt";
import ProgressLoader from "../../../components/ProgressLoader";
import { usePage } from "@inertiajs/react";
// import PrintEngine from "../../helpers/CustomInvoice/PrintEngine";
// import ThermalPrint from "../../helpers/CustomInvoice/Thermalprint";
// import printJS from "print-js";

const useHotKey = (callback) => {
    React.useEffect(() => {
        const keyDown = (e) => {
            var name = e.key;
            var list = ["!", "@", "#", "$", "%", "^", "&", "*"];
            if (name === "Shift") {
                return;
            }
            if (list.indexOf(name) !== -1) {
                if (e.shiftKey) {
                    if (callback.current[list.indexOf(name)]) {
                        callback.current[list.indexOf(name)].click();
                    }
                }
            }
            return;
        };
        document.body.addEventListener("keydown", keyDown);
        return () => document.body.removeEventListener("keydown", keyDown);
    }, [callback]);
};

function CashSale() {
    const saleType = "CASHSALE";
    const {
        storeData,
        configurationData,
        storeID,
        companyLogo,
        invoiceTemplate,
    } = usePage().props;

    const paymentRef = useRef([]);
    //interface setup
    const { t, i18n } = useTranslation();

    useHotKey(paymentRef);

    const defaultValues = {
        inital: true,
        cartItems: [],
        paymentInfo: [],
        customerInfo: null,
        billType: B2CSALE,
        workorderID: null,
        quotationID: null,
        printAfterSale: false,
        comments: "",
    };

    // const [storeData, setStoreData] = useState(store);
    const [savedDatas, setSavedDatas] = useState(defaultValues);
    const [splitPay, setSplitPay] = useState(false);
    const [paymentList, setPaymentList] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const cachedSavedDatas = useMemo(() => savedDatas, [savedDatas]);

    //update interface
    useEffect(() => {
        if (!savedDatas.inital) {
            localStorage.setItem(saleType, JSON.stringify({ ...savedDatas }));
        }
    }, [savedDatas]);

    //initializing;
    useEffect(() => {
        let printAfterSale =
            configurationData?.print_after_sale === "0" ? false : true;

        //get payment method
        getData(GETALLACTIVEPAYMENTS).then((result) => {
            if (result.data.result !== null) setPaymentList(result.data);
        });

        if (localStorage.getItem(saleType)) {
            let savedSale = JSON.parse(localStorage.getItem(saleType));
            setSavedDatas({
                ...savedSale,
                printAfterSale,
                inital: false,
            });
        } else {
            setSavedDatas({ ...savedDatas, printAfterSale, inital: false });
        }
    }, []);

    const submit = async (paymentType, payment_id) => {
        if (!disableSubmit) {
            if (savedDatas.billType === "B2B") {
                if (savedDatas.customerInfo) {
                    if (savedDatas.customerInfo.billing_type === 0) {
                        toaster.error(
                            "Previously added customer is B2C, For B2B Sale need more details about customer. please edit customer and add once more. "
                        );
                        return true;
                    }
                } else {
                    toaster.error("Customer should required on B2B Sale.");
                    return true;
                }
            }

            setDisableSubmit(true);
            let amounts = await cartBalance(saleType);
            let payment =
                typeof paymentType === "number"
                    ? [
                          {
                              amount: amounts.total,
                              type: paymentType,
                              payment_id: payment_id,
                          },
                      ]
                    : paymentType;

            let cartInfo = {
                ...savedDatas,
                store_id: storeID,
                sale_type: "CAS",
                paymentInfo: {
                    payment: payment,
                    total: amounts.total,
                    subtotal: amounts.subTotal,
                    tax: amounts.tax,
                    discount: discount,
                    net_amount: amounts.total - discount,
                },
            };
            if (cartInfo.cartItems.length < 1) {
                toaster.error(t("sales.cartisempty"));
                return;
            }

            submitSales(saleType, cartInfo)
                .then((response) => {
                    if (response.status) {
                        toaster.success(t(response.message));

                        if (response.print_after_sale) {
                            callPrint(
                                response,
                                saleType,
                                companyLogo,
                                invoiceTemplate,
                                storeData,
                                configurationData
                            );
                        }
                        localStorage.removeItem(saleType);
                        setDiscount(0);
                        setSavedDatas({ ...defaultValues, inital: false });
                    } else {
                        toaster.error(t(response.message));
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

    const suspendSale = async () => {
        let amounts = await cartBalance(saleType);
        let cartInfo = {
            ...savedDatas,
            store_id: storeID,
            sale_type: "CAS",
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

        postData(SUSPENDSALE, cartInfo)
            .then((response) => {
                if (response.status) {
                    toaster.success(t(response.message));
                    localStorage.removeItem(saleType);
                    setDiscount(0);
                    setSavedDatas({ ...defaultValues, inital: false });
                } else {
                    toaster.error(t(response.message));
                }
            })
            .catch((e) => {
                toaster.error(e);
            });
    };

    return (
        <Stack>
            <Breadcrumb labelHead="CASH SALE" labelSub="Add/Edit Cash Sales" />
            <ToastContainer />

            <ProgressLoader open={disableSubmit} />
            {savedDatas && (
                <Grid container spacing={1} mt={0.2}>
                    <Grid item md={9} xs={12}>
                        <CartControll
                            savedDatas={cachedSavedDatas}
                            setSavedDatas={setSavedDatas}
                            saleType={saleType}
                            storeData={storeData}
                            configurationData={configurationData}
                        />
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Paper sx={{ p: 1.5 }}>
                            <SelectCustomer
                                savedDatas={cachedSavedDatas}
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
                                savedDatas={cachedSavedDatas}
                                setSavedDatas={setSavedDatas}
                            />

                            <Paper variant="outlined">
                                <Grid
                                    container
                                    spacing={0.3}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    {paymentList &&
                                        paymentList.map((payment, index) => {
                                            return (
                                                <Grid item md={6} xs={12}>
                                                    <Button
                                                        key={index}
                                                        variant="contained"
                                                        fullWidth={true}
                                                        color={colorList(index)}
                                                        ref={(el) =>
                                                            (paymentRef.current[
                                                                index
                                                            ] = el)
                                                        }
                                                        size="small"
                                                        disabled={
                                                            savedDatas.cartItems
                                                                .length < 1
                                                        }
                                                        onClick={() =>
                                                            submit(
                                                                payment.account_id,
                                                                payment.payment_id
                                                            )
                                                        }
                                                    >
                                                        {i18n.language === "en"
                                                            ? payment.payment_name_en
                                                            : payment.payment_name_ar}
                                                    </Button>
                                                </Grid>
                                            );
                                        })}
                                </Grid>
                                <Grid
                                    container
                                    spacing={0.3}
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ mt: 0.1 }}
                                >
                                    <Grid item md={6} xs={12}>
                                        <Button
                                            variant="contained"
                                            disabled={
                                                savedDatas.cartItems.length < 1
                                            }
                                            size="small"
                                            color={colorList(3)}
                                            fullWidth={true}
                                            onClick={suspendSale}
                                        >
                                            Suspend
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Button
                                            variant="contained"
                                            fullWidth={true}
                                            color={colorList(0)}
                                            size="small"
                                            disabled={
                                                savedDatas.cartItems.length < 1
                                            }
                                            onClick={() => setSplitPay(true)}
                                        >
                                            Split Payment
                                        </Button>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button
                                            variant="contained"
                                            color={colorList(1)}
                                            size="small"
                                            fullWidth={true}
                                            onClick={() => {
                                                let confirmAction =
                                                    window.confirm(
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
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Paper>
                    </Grid>
                </Grid>
            )}
            <Splitpayment
                show={splitPay}
                handleClose={() => setSplitPay(false)}
                saleType={saleType}
                discount={discount}
                submitSale={submit}
            />
        </Stack>
    );
}

export default React.memo(CashSale);
