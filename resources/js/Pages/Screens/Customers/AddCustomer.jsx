import React, { useState, useEffect, useRef } from "react";

import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../../Utils/Theming";
import Breadcrumb from "../../../components/Breadcrumb";

import { getData, postData } from "../../../apis/apiCalls";
import ToasterContainer from "../../../components/ToasterContainer";
import toaster from "../../../helpers/toaster";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    FormInputText,
    FormInputDropdown,
    FormInputSwitch,
} from "../../../components/mui";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";

import { customerHelper } from "../../../helpers/FormHelper";
import ProgressLoader from "../../../components/ProgressLoader";
import Dialogue from "../../../components/Dialogue";
import {
    B2BCustomerValidation,
    B2CCustomerValidation,
} from "../../../helpers/FormTrasilationHelper";
import { Card, CardContent, Divider, Grid, Paper } from "@mui/material";
import { GETCUSTOMERBYID, SAVECUSTOMER } from "../../../constants/apiUrls";
import { router, usePage } from "@inertiajs/react";
import { IconButton } from "@mui/material";
import axios from "axios";

function AddCustomer(props) {
    const { quickRegister, quickInsert, customer_id } = props;

    const { customerId, configurationData } = usePage().props;

    const submitRef = useRef(null);
    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [validator, setValidator] = useState(B2BCustomerValidation);

    const { handleSubmit, reset, control, watch, setValue } = useForm({
        defaultValues: customerHelper.initialValues,
        resolver: yupResolver(validator),
        mode: "onBlur",
    });

    useEffect(() => {
        watch("billing_type")
            ? setValidator(B2BCustomerValidation)
            : setValidator(B2CCustomerValidation);
    }, [watch("billing_type")]);

    useEffect(() => {
        let customerid = quickRegister ? customer_id : customerId;
        if (customerid) {
            getData(`${GETCUSTOMERBYID}${customerid}`).then((response) => {
                let customer = response.data;
                const initialData = {
                    customerId: customerid,
                    name: customer.name || "",
                    email: customer.email || "",
                    mobile: customer.mobile || "",
                    street: customer.street || "",
                    additional_street: customer.additional_street || "",
                    city: customer.city || "",
                    city_sub_division: customer.city_sub_division || "",
                    building_number: customer.building_number || "",
                    plot_identification: customer.plot_identification || "",
                    identity_type: customer.identity_type || "",
                    party_id: customer.party_id || "",
                    state: customer.state || "",
                    zip: customer.zip || "",
                    country: customer.country || "",
                    company_name: customer.company_name || "",
                    account_number: customer.account_number || "",
                    billing_type:
                        customer.billing_type === 1 ? true : false || false,
                    opening_balance:
                        customer.opening_balance &&
                        customer.opening_balance.amount,
                    customer_type: customer.customer_type,
                    comments: customer.comments || "",
                };
                reset(initialData);
            });
        }
    }, []);

    const getVatNumber = async () => {
        const vatNumber = watch("party_id");

        if (!vatNumber) {
            toaster.error(t("messages.vat_number_required"));
            return;
        }

        setDisableSubmit(true);

        const url = `${configurationData.whatsapp_web_endpoint}get-vat`;
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };

        try {
            const response = await axios.post(
                url,
                { vat_number: vatNumber },
                { headers }
            );
            const responseData = response.data;

            if (!responseData.error) {
                setValue("name", responseData.data);
            } else {
                toaster.error(responseData.data);
            }
        } catch (error) {
            console.error(error);
            toaster.error(t("messages.error_network"));
        } finally {
            setDisableSubmit(false);
        }
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVECUSTOMER, values)
                .then((response) => {
                    if (response.error) {
                        toaster.error(t(response.message) + response.info);
                    } else {
                        if (quickRegister) {
                            quickInsert(response.customer_id);
                        } else {
                            setShowDialog(true);
                        }
                        toaster.success(t(response.message));
                        reset();
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        setDisableSubmit(false);
                    }, 1000);
                });
        }
    };

    return (
        <Stack>
            <Breadcrumb labelHead="Customer" labelSub="Add/Edit Customer" />
            <ToasterContainer />
            <Dialogue
                showDialog={showDialog}
                message="New Customer Created Successfully, to list all customers click List Customers else click New Customer for add new Customer"
                options={[
                    {
                        label: "New Customer",
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                        },
                    },
                    {
                        label: "List Customers",
                        color: "secondary",
                        action: () => {
                            router.get("/customers/view_customers");
                        },
                    },
                ]}
            />

            <ProgressLoader open={disableSubmit} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Paper elevation={20} sx={{ p: 1, mt: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item md={6} xs={12}>
                            <Card>
                                <CardContent>
                                    <FormInputText
                                        label={t("customers.name")}
                                        name="name"
                                        control={control}
                                        secondary
                                    />

                                    <FormInputText
                                        label={t("common.companyname")}
                                        name="company_name"
                                        control={control}
                                    />

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputText
                                            label={t("common.email")}
                                            name="email"
                                            control={control}
                                        />
                                        <FormInputText
                                            label={t("common.mobile")}
                                            name="mobile"
                                            type="number"
                                            control={control}
                                        />
                                    </Stack>

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputDropdown
                                            label={t("common.identity_type")}
                                            name="identity_type"
                                            control={control}
                                            options={
                                                customerHelper.identityType
                                            }
                                        />

                                        <FormInputText
                                            label={t("common.party_id")}
                                            name="party_id"
                                            control={control}
                                            preappend={
                                                <IconButton
                                                    onClick={getVatNumber}
                                                >
                                                    <YoutubeSearchedForIcon
                                                        fontSize="small"
                                                        color="primary"
                                                    />
                                                </IconButton>
                                            }
                                        />
                                    </Stack>

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputText
                                            name="street"
                                            control={control}
                                            label={t("common.street_name")}
                                        />
                                        <FormInputText
                                            name="additional_street"
                                            control={control}
                                            label={t(
                                                "common.additional_street_name"
                                            )}
                                        />
                                    </Stack>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputText
                                            label={t("common.city")}
                                            name="city"
                                            control={control}
                                        />
                                        <FormInputText
                                            label={t(
                                                "common.city_sub_division_name"
                                            )}
                                            name="city_sub_division"
                                            helperText={"EAST/WEST/SOUTH/NORTH"}
                                            control={control}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                            {/* </Paper> */}
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card>
                                <CardContent>
                                    <FormInputSwitch
                                        label={t("customers.billing_type")}
                                        name="billing_type"
                                        control={control}
                                        onText="B2B"
                                        OffText="B2C"
                                    />

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputText
                                            label={t("common.building_number")}
                                            name="building_number"
                                            control={control}
                                        />
                                        <FormInputText
                                            label={t(
                                                "common.plot_identification"
                                            )}
                                            name="plot_identification"
                                            control={control}
                                        />
                                    </Stack>

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputText
                                            label={t("common.state")}
                                            name="state"
                                            control={control}
                                        />
                                        <FormInputText
                                            label={t("common.country")}
                                            name="country"
                                            control={control}
                                        />
                                    </Stack>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputText
                                            label={t("common.accountnumber")}
                                            name="account_number"
                                            control={control}
                                        />
                                        <FormInputText
                                            label={t("common.zip")}
                                            name="zip"
                                            type="number"
                                            control={control}
                                        />
                                    </Stack>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                    >
                                        <FormInputDropdown
                                            label={t("customers.customer_type")}
                                            name="customer_type"
                                            control={control}
                                            options={
                                                customerHelper.customerType
                                            }
                                        />

                                        <FormInputText
                                            label={t("common.opening_balance")}
                                            name="opening_balance"
                                            control={control}
                                            preappend={true}
                                            postappend={true}
                                        />
                                    </Stack>

                                    {/* <FormInputDropdown
                  label={t("common.location")}
                  name="location"
                  control={control}
                  options={customerHelper.stocks}
                /> */}
                                    <FormInputText
                                        name="comments"
                                        control={control}
                                        label={t("items.comments")}
                                        multiline={true}
                                    />
                                </CardContent>
                                <Stack
                                    spacing={2}
                                    sx={{ mx: 3, mb: 3 }}
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
                                                quickInsert(-1);
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
                        </Grid>
                    </Grid>
                </Paper>
            </form>
        </Stack>
    );
}

export default AddCustomer;
