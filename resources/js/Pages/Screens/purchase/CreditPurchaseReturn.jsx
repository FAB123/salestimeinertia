import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb";

import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    CardMedia,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import { cartBalance, submitPurchase } from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import { ToastContainer } from "react-toastify";
import SalesComments from "../../../components/sales/SalesComments";

import PurchaseItemTray from "../../../components/purchase/PurchaseItemTray";
import SelectSupplier from "../../../components/purchase/SelectSupplier";
import { FormInputDiscount } from "../../../components/mui";
import PurchaseTotal from "../../../components/purchase/PurchaseTotal";
import ProgressLoader from "../../../components/ProgressLoader";
import { usePage } from "@inertiajs/react";
import DatePicker from "../../../components/purchase/DatePicker";

function CreditPurchaseReturn() {
    const saleType = "CREDITPURCHASERETURN";
    const { storeData } = usePage().props;
    //interface setup
    const { t } = useTranslation();

    const defaultValues = {
        inital: true,
        purchase_id: null,
        cartItems: [],
        paymentInfo: [],
        supplierInfo: null,
        invoiceImage: null,
        reference: "",
        comments: "",
        include_tax: "0",
    };

    const [savedDatas, setSavedDatas] = useState(defaultValues);
    const [discount, setDiscount] = useState(0);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState(new Date());

    //update interface
    useEffect(() => {
        if (!savedDatas.inital) {
            localStorage.setItem(
                saleType,
                JSON.stringify({ ...savedDatas, purchaseDate })
            );
        }
    }, [savedDatas, purchaseDate]);

    //initializing;
    useEffect(() => {
        if (localStorage.getItem(saleType)) {
            let savedSale = JSON.parse(localStorage.getItem(saleType));
            if (savedSale.purchaseDate) {
                setPurchaseDate(new Date(savedSale.purchaseDate));
            }
            setSavedDatas({
                ...savedSale,
                inital: false,
            });
        } else {
            setSavedDatas({ ...savedDatas, inital: false });
        }
    }, []);

    const submit = async () => {
        if (savedDatas.reference === "") {
            toaster.error("Purchase Should required a billing refrence");
            return;
        }
        setDisableSubmit(true);
        let amounts = await cartBalance(saleType);
        let cartInfo = {
            ...savedDatas,
            purchase_type: "CRPR",
            purchaseDate: purchaseDate,
            paymentInfo: {
                total: amounts.total,
                subtotal: amounts.subTotal,
                discount: discount,
                tax: amounts.tax,
            },
        };
        if (cartInfo.cartItems.length < 1) {
            toaster.error(t("sales.cartisempty"));
            return;
        }
        if (cartInfo.supplierInfo === null) {
            toaster.error(t("sales.emptycustomer"));
            return;
        }
        submitPurchase(cartInfo)
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
        setDisableSubmit(false);
    };

    return (
        <Stack>
            <Breadcrumb
                labelHead="CREDIT PURCHASE"
                labelSub="Add/Edit Credit PURCHASE"
            />
            <ToastContainer />
            <ProgressLoader open={disableSubmit} />
            {savedDatas && (
                <Grid container>
                    <Grid item md={9} xs={12}>
                        <Paper sx={{ m: 1 }}>
                            <PurchaseItemTray
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                                saleType={saleType}
                                storeData={storeData}
                            />
                        </Paper>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Paper sx={{ m: 1, p: 3 }}>
                            <SelectSupplier
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
                            />
                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />
                            <DatePicker
                                purchaseDate={purchaseDate}
                                setPurchaseDate={setPurchaseDate}
                            />
                            <Divider
                                orientation="horizontal"
                                sx={{ mt: 1, mb: 1 }}
                            />
                            <PurchaseTotal
                                savedDatas={savedDatas}
                                setSavedDatas={setSavedDatas}
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

                            <TextField
                                sx={{ width: "100%", mb: 1, mt: 1 }}
                                onChange={(e) => {
                                    setSavedDatas({
                                        ...savedDatas,
                                        reference: e.target.value,
                                    });
                                }}
                                size="small"
                                value={savedDatas.reference}
                                type={"text"}
                                label={t("common.reference")}
                                variant="outlined"
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
                                            color="success"
                                            size="small"
                                            fullWidth
                                            disabled={
                                                savedDatas.cartItems.length <
                                                    1 ||
                                                savedDatas.supplierInfo === null
                                                    ? true
                                                    : false
                                            }
                                            onClick={submit}
                                        >
                                            COMPLEET
                                        </Button>
                                    </Grid>

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
                                                    setPurchaseDate(new Date());
                                                }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                            {savedDatas.invoiceImage && (
                                <Card sx={{ mt: 2 }}>
                                    <CardMedia
                                        style={{
                                            height: 0,
                                            paddingTop: "56.25%", // 16:9,
                                            marginTop: "30",
                                        }}
                                        image={savedDatas.invoiceImage}
                                        id="image"
                                    />
                                </Card>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
}

export default React.memo(CreditPurchaseReturn);
