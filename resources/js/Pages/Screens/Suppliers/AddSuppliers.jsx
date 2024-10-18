import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";

import { useTranslation } from "react-i18next";

import { getData, postData } from "../../../apis/apiCalls";
import ToasterContainer from "../../../components/ToasterContainer";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { FormInputText, FormInputSwitch } from "../../../components/mui/";

import toaster from "../../../helpers/toaster";

import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../../Utils/Theming";

import Dialogue from "../../../components/Dialogue";
import { supplierHelper } from "../../../helpers/FormHelper";

import ProgressLoader from "../../../components/ProgressLoader";
import { supplierValidation } from "../../../helpers/FormTrasilationHelper";
import { Box, Card, CardContent, Grid, Paper } from "@mui/material";
import { GETSUPPLIERBYID } from "../../../constants/apiUrls";
import { router, usePage } from "@inertiajs/react";

function AddSuppliers(props) {
    const { quickRegister, quickInsert } = props;

    const { supplierId } = usePage().props;

    const { t } = useTranslation();

    const [showDialog, setShowDialog] = useState(false);

    // const nameRef = useRef(null);
    // const contactpersonRef = useRef(null);
    // const emailRef = useRef(null);
    // const mobileRef = useRef(null);
    // const accountRef = useRef(null);
    // const vatRef = useRef(null);
    // const commentsRef = useRef(null);
    //const taxableRef = useRef(null);

    const submitRef = useRef(null);

    // const _handleEnter = (event, element) => {
    //   if (event.key === "Enter") {
    //     element.current.focus();
    //   }
    // };

    const { handleSubmit, reset, control } = useForm({
        defaultValues: supplierHelper.initialValues,
        resolver: yupResolver(supplierValidation),
        mode: "onBlur",
    });

    useEffect(() => {
        if (supplierId) {
            getData(`${GETSUPPLIERBYID}${supplierId}`).then((response) => {
                if (response.data) {
                    let supplier = response.data;
                    const initialData = {
                        supplierId: supplierId,
                        name: supplier.name || "",
                        email: supplier.email || "",
                        mobile: supplier.mobile || "",
                        address_line_1: supplier.details.address_line_1 || "",
                        contact_person: supplier.contact_person || "",
                        city: supplier.details.city || "",
                        state: supplier.details.state || "",
                        country: supplier.details.country || "",
                        zip: supplier.details.zip || "",
                        account_number: supplier.details.account_number || "",
                        vat_number: supplier.vat_number || "",
                        opening_balance:
                            supplier.opening_balance.amount &&
                            supplier.opening_balance.amount,
                        comments: supplier.details.comments || "",
                        taxable: supplier.taxable === 1 ? true : false,
                    };
                    reset(initialData);
                }
            });
        }
    }, [supplierId]);

    //var tabindex = 0;
    const [disableSubmit, setDisableSubmit] = useState(false);

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData("/suppliers/save_supplier", values).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message) + response.info);
                } else {
                    if (quickRegister) {
                        quickInsert(response.supplier_id);
                    } else {
                        setShowDialog(true);
                    }

                    toaster.success(t(response.message));

                    reset();
                }
                setTimeout(() => {
                    setDisableSubmit(false);
                }, 1000);
            });
        }
    };

    return (
        <Stack>
            <Breadcrumb labelHead="Supplier" labelSub="Add/Edit Supplier" />
            <ToasterContainer />

            <Dialogue
                showDialog={showDialog}
                message="New Supplier Created, to list all Supplier click List Supplier else click New Supplier for add new Supplier"
                options={[
                    {
                        label: "New Supplier",
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                        },
                    },
                    {
                        label: "List Supplier",
                        color: "secondary",
                        action: () => {
                            router.get("/suppliers/view_suppliers/");
                        },
                    },
                ]}
            />

            <ProgressLoader open={disableSubmit} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1} mt={1}>
                    <Grid item md={6}>
                        <Paper elevation={20}>
                            <Card>
                                <CardContent>
                                    <FormInputText
                                        label={t("suppliers.name")}
                                        name="name"
                                        control={control}
                                    />

                                    <FormInputText
                                        label={t("suppliers.email")}
                                        name="email"
                                        control={control}
                                    />

                                    <FormInputText
                                        label={t("common.mobile")}
                                        name="mobile"
                                        type="number"
                                        control={control}
                                    />
                                    <FormInputText
                                        name="address_line_1"
                                        control={control}
                                        label={t("common.address")}
                                        multiline={true}
                                    />
                                    <FormInputText
                                        label={t("common.city")}
                                        name="state"
                                        control={control}
                                    />
                                    <FormInputText
                                        label={t("common.state")}
                                        name="city"
                                        control={control}
                                    />
                                    <FormInputText
                                        label={t("common.country")}
                                        name="country"
                                        control={control}
                                    />
                                    <FormInputText
                                        label={t("common.zip")}
                                        name="zip"
                                        control={control}
                                    />
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                    <Grid item md={6}>
                        <Paper elevation={20}>
                            <Card>
                                <CardContent>
                                    <FormInputText
                                        label={t("suppliers.contactperson")}
                                        name="contact_person"
                                        control={control}
                                    />

                                    <FormInputText
                                        label={t("common.accountnumber")}
                                        name="account_number"
                                        control={control}
                                    />
                                    <FormInputText
                                        label={t("common.vatnumber")}
                                        name="vat_number"
                                        control={control}
                                    />

                                    <FormInputSwitch
                                        label={t("common.taxable")}
                                        name="taxable"
                                        control={control}
                                        onText={t("common.taxable")}
                                        OffText={t("common.without_tax")}
                                    />

                                    <FormInputText
                                        label={t("common.opening_balance")}
                                        name="opening_balance"
                                        control={control}
                                        preappend={true}
                                        postappend={true}
                                    />

                                    <FormInputText
                                        name="comments"
                                        control={control}
                                        label={t("items.comments")}
                                        multiline={true}
                                    />
                                </CardContent>
                                <Stack
                                    spacing={2}
                                    sx={{ m: 3 }}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <PinkButton
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            if (
                                                window.confirm("Are you Sure?")
                                            ) {
                                                if (quickRegister) {
                                                    quickInsert(-1);
                                                }
                                                reset();
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
                            </Card>
                        </Paper>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

export default AddSuppliers;
