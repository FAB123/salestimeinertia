import { Card, Grid, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import ToasterContainer from "../../../components/ToasterContainer";
import { PinkButton, PurpleButton } from "../../../Utils/Theming";
import { FormInputText } from "../../../components/mui";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import {
    GETITEMBYBARCODE,
    SAVEPRICEUPDATE,
    VALIDATEBARCODE,
} from "../../../constants/apiUrls";
import { useTranslation } from "react-i18next";
import { itemHelper } from "../../../helpers/FormHelper";
import { yupResolver } from "@hookform/resolvers/yup";
import toaster from "../../../helpers/toaster";
import { getData, postData } from "../../../apis/apiCalls";

function PriceUpdater() {
    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(false);
    const submitRef = useRef(null);
    const barcodeRef = useRef(null);
    const itemNameRef = useRef(null);
    const itemNameArRef = useRef(null);
    const categoryRef = useRef(null);
    const costRef = useRef(null);
    const priceRef = useRef(null);

    const validationSchema = Yup.object({
        barcode: Yup.string()
            .required(t("items.barcode_filed_requierd"))
            .test(
                "validateBarcode",
                t("items.barcode_not_found_in_database"),
                function (value) {
                    return new Promise((resolve, reject) => {
                        if (value) {
                            getData(`${VALIDATEBARCODE}${value}`).then(
                                (res) => {
                                    resolve(!res.status);
                                }
                            );
                        }
                    });
                }
            ),
        item_name: Yup.string().required(t("items.name_filed_requierd")),
        item_name_ar: Yup.string(),
        category: Yup.string().required(t("items.category_filed_requierd")),
        cost_price: Yup.number().required(t("items.cost_filed_requierd")),
        unit_price: Yup.number().required(t("items.price_filed_requierd")),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: itemHelper.priceChecker,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const onSubmit = (values) => {
        if (confirm("Are You Sure?")) {
            setDisableSubmit(true);
            if (!disableSubmit) {
                postData(SAVEPRICEUPDATE, values)
                    .then((response) => {
                        if (!response.error) {
                            reset(itemHelper.priceChecker);
                            toaster.success(t("items.price_updated"));
                            setTimeout(() => {
                                barcodeRef.current.focus();
                            }, 10);
                        } else {
                            toaster.error(t("items.price_not_updated"));
                        }
                    })
                    .finally((e) => setDisableSubmit(false));
            } else {
                setTimeout(() => {
                    setDisableSubmit(false);
                }, 1000);
            }
        }
    };

    useEffect(() => barcodeRef.current.focus(), []);
    return (
        <Stack>
            <Breadcrumb labelHead="Items" labelSub="Price Updater" />
            <ToasterContainer />
            <Grid container alignItems={"center"} justifyContent={"center"}>
                <Grid item md={4} xs={12}>
                    <Card sx={{ m: 1, p: 3 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormInputText
                                name="barcode"
                                control={control}
                                label={t("items.barcode")}
                                itemRef={barcodeRef}
                                secondary
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        getData(
                                            `${GETITEMBYBARCODE}/${e.target.value}`
                                        ).then((res) => {
                                            if (res.status) {
                                                let data = res.data;
                                                reset({
                                                    barcode: data.barcode,
                                                    item_name: data.item_name,
                                                    item_name_ar:
                                                        data.item_name_ar,
                                                    category: data.category,
                                                    cost_price: data.cost_price,
                                                    unit_price: data.unit_price,
                                                });
                                                setTimeout(() => {
                                                    itemNameRef.current.focus();
                                                    itemNameRef.current.select();
                                                }, 10);
                                            }
                                        });
                                    }
                                }}
                            />

                            <FormInputText
                                name="item_name"
                                itemRef={itemNameRef}
                                control={control}
                                label={t("items.itemname")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        itemNameArRef.current.focus();
                                        itemNameArRef.current.select();
                                    }
                                }}
                            />

                            <FormInputText
                                name="item_name_ar"
                                itemRef={itemNameArRef}
                                control={control}
                                label={t("items.itemnamear")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        categoryRef.current.focus();
                                        categoryRef.current.select();
                                    }
                                }}
                            />

                            <FormInputText
                                name="category"
                                itemRef={categoryRef}
                                control={control}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        costRef.current.focus();
                                        costRef.current.select();
                                    }
                                }}
                                label={t("items.product_category")}
                            />

                            <FormInputText
                                name="cost_price"
                                control={control}
                                label={t("common.cost_price")}
                                preappend={true}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        priceRef.current.focus();
                                        priceRef.current.select();
                                    }
                                }}
                                itemRef={costRef}
                                postappend={true}
                            />

                            <FormInputText
                                name="unit_price"
                                control={control}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        submitRef.current.focus();
                                    }
                                }}
                                label={t("items.unit_price")}
                                itemRef={priceRef}
                                preappend={true}
                                postappend={true}
                            />
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <PinkButton
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        if (window.confirm("Are you Sure?")) {
                                            reset(itemHelper.priceChecker);
                                            setTimeout(
                                                () =>
                                                    barcodeRef.current.focus(),
                                                10
                                            );
                                        }
                                        return;
                                    }}
                                >
                                    Clear
                                </PinkButton>
                                <PurpleButton
                                    variant="contained"
                                    onClick={handleSubmit(onSubmit)}
                                    ref={submitRef}
                                >
                                    Send
                                </PurpleButton>
                            </Stack>
                        </form>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default PriceUpdater;
