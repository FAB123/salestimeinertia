import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";

import CartControll from "../../../components/sales/CartControll";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Paper, Stack } from "@mui/material";
import { cartBalance, submitSales } from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import Splitpayment from "../../../components/sales/Splitpayment";
import SalesComments from "../../../components/sales/SalesComments";
import { callPrint } from "../../../helpers/InvoicePrint";
import { B2CSALE } from "../../../constants/constants";
import SelectCustomer from "../../../components/sales/SelectCustomer";
import { getData } from "../../../apis/apiCalls";
import { GETALLACTIVEPAYMENTS } from "../../../constants/apiUrls";
import { colorList } from "../../../helpers/GeneralHelper";
import { FormInputDiscount } from "../../../components/mui";
import SalesTotal from "../../../components/sales/SalesTotal";
import ProgressLoader from "../../../components/ProgressLoader";
import { usePage } from "@inertiajs/react";

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

function CashSaleReturn() {
    const saleType = "CASHSALERETURN";
    const { storeData, configurationData, storeID } = usePage().props;
    //interface setup
    const { t, i18n } = useTranslation();
    const paymentRef = useRef([]);
    useHotKey(paymentRef);

    const defaultValues = {
        inital: true,
        cartItems: [],
        paymentInfo: [],
        customerInfo: null,
        workorderID: null,
        quotationID: null,
        billType: B2CSALE,
        printAfterSale: false,
        comments: "",
    };

    const [savedDatas, setSavedDatas] = useState(defaultValues);
    const [splitPay, setSplitPay] = useState(false);
    const [paymentList, setPaymentList] = useState([]);
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
        //get payment method
        getData(GETALLACTIVEPAYMENTS).then((result) => {
            if (result.data.result !== null) setPaymentList(result.data);
        });

        if (localStorage.getItem(saleType)) {
            let savedSale = JSON.parse(localStorage.getItem(saleType));
            setSavedDatas({ ...savedSale, inital: false });
        } else {
            setSavedDatas({ ...savedDatas, inital: false });
        }
    }, []);

    const submit = async (paymentType, payment_id) => {
        if (!disableSubmit) {
            setDisableSubmit(true);
            let amounts = await cartBalance(saleType);

            let payment =
                typeof paymentType === "number"
                    ? [
                          {
                              amount: amounts.total,
                              payment_id: payment_id,
                              type: paymentType,
                          },
                      ]
                    : paymentType;

            let cartInfo = {
                ...savedDatas,
                store_id: storeID,
                sale_type: "CASR",
                paymentInfo: {
                    discount: discount,
                    payment: payment,
                    total: amounts.total,
                    subtotal: amounts.subTotal,
                    tax: amounts.tax,
                },
            };
            if (cartInfo.cartItems.length < 1) {
                toaster.error(t("sales.cartisempty"));
                return;
            }
            // if (cartInfo.customerInfo === null) {
            //   toaster.error(t("sales.emptycustomer"));
            //   return;
            // }
            submitSales(saleType, cartInfo)
                .then((response) => {
                    if (response.status) {
                        toaster.success(t(response.message));
                        if (response.print_after_sale) {
                            callPrint(response, saleType);
                        }
                        localStorage.removeItem(saleType);
                        // setSavedDatas(defaultValues);
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

    return (
        <Stack>
            <Breadcrumb
                labelHead="CASH SALES Return"
                labelSub="Add/Edit Cash Sales Return"
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
                                                        color={colorList(index)}
                                                        fullWidth={true}
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
                                    mt={0.1}
                                >
                                    <Grid item md={6} xs={12}>
                                        <Button
                                            variant="contained"
                                            fullWidth={true}
                                            color={colorList(1)}
                                            disabled={
                                                savedDatas.cartItems.length < 1
                                            }
                                            size="small"
                                        >
                                            Suspend
                                        </Button>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Button
                                            variant="contained"
                                            color={colorList(0)}
                                            size="small"
                                            fullWidth={true}
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
                                            color={colorList(3)}
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

export default React.memo(CashSaleReturn);
