import React, { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";

import IconButton from "@mui/material/IconButton";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import toaster from "../../../../helpers/toaster";
import { FormInputDropdown, FormInputText } from "../../../../components/mui";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    paymentOptionsHelper,
    unitHelper,
} from "../../../../helpers/FormHelper";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import ToasterContainer from "../../../../components/ToasterContainer";
import SendIcon from "@mui/icons-material/Send";
import {
    GETALLACCOUNTHEADS,
    GETALLACCOUNTPAYMENTHEADS,
    GETALLPAYMENTS,
    GETPAYMENTOPTIONBYID,
    PAYMENTOPTIONSTATUSBYID,
    SAVEPAYMENTOPTION,
} from "../../../../constants/apiUrls";
import { getData } from "../../../../apis/apiCalls";

function PaymentConfig() {
    const [paymentList, setPaymentList] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [accountHeadList, setAccountHeadList] = useState([]);

    const { t } = useTranslation();

    const validationSchema = Yup.object({
        payment_name_en: Yup.string().required("Table name Filed is Requierd"),
        payment_name_ar: Yup.string().required("Table name Filed is Requierd"),
        account_id: Yup.number(),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: paymentOptionsHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        getData(GETALLPAYMENTS).then((result) => {
            if (result.data.result !== null) setPaymentList(result.data);
        });
        getData(GETALLACCOUNTPAYMENTHEADS).then((response) =>
            setAccountHeadList(response.data)
        );
    }, []);

    const editPayment = (payment_id) => {
        getData(`${GETPAYMENTOPTIONBYID}${payment_id}`).then((result) => {
            let response = result.data;
            let data = {
                payment_id: response.payment_id || null,
                payment_name_en: response.payment_name_en || "",
                payment_name_ar: response.payment_name_ar || "",
                account_id: response.account_id || "",
            };
            reset(data);
            setShowEdit(true);
        });
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVEPAYMENTOPTION, values).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message));
                } else {
                    setShowEdit(false);
                    toaster.success(t(response.message));
                    setPaymentList(response.stores);
                }
                setDisableSubmit(false);
            });
        }
    };

    const changeStatus = (payment_id, status = 0) => {
        postData(PAYMENTOPTIONSTATUSBYID, { payment_id, status }).then(
            (result) => {
                if (result.status) {
                    toaster.success(t(result.message));
                    setPaymentList(result.data);
                } else {
                    toaster.error(t(result.message));
                }
            }
        );
    };

    return (
        <Stack direction={"row"} m={1}>
            <ToasterContainer />
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Paper elevation={20}>
                        <Card>
                            <CardHeader
                                // title={t("configuration.payment_list")}
                                subheader={t("configuration.payment_list")}
                            />
                            <Divider />

                            <CardContent>
                                <List
                                    sx={{
                                        width: "100%",
                                        //maxWidth: 360,
                                        bgcolor: "background.paper",
                                    }}
                                >
                                    {paymentList.length > 0 &&
                                        paymentList.map((payment, key) => {
                                            const labelId = `checkbox-list-label-${key}`;
                                            return (
                                                <ListItem
                                                    key={key}
                                                    secondaryAction={
                                                        <>
                                                            {payment.editable ===
                                                                1 && (
                                                                <IconButton
                                                                    edge="end"
                                                                    color="info"
                                                                    aria-label="edit"
                                                                    sx={{
                                                                        m: 0.2,
                                                                    }}
                                                                    onClick={() => {
                                                                        editPayment(
                                                                            payment.payment_id
                                                                        );
                                                                    }}
                                                                >
                                                                    <ConstructionIcon />
                                                                </IconButton>
                                                            )}

                                                            {payment.active ===
                                                            0 ? (
                                                                <IconButton
                                                                    edge="end"
                                                                    aria-label="edit"
                                                                    sx={{
                                                                        m: 0.2,
                                                                    }}
                                                                    color="error"
                                                                    onClick={() => {
                                                                        changeStatus(
                                                                            payment.payment_id,
                                                                            1
                                                                        );
                                                                    }}
                                                                >
                                                                    <VisibilityOffIcon />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    edge="end"
                                                                    aria-label="edit"
                                                                    color="secondary"
                                                                    onClick={() => {
                                                                        changeStatus(
                                                                            payment.payment_id,
                                                                            0
                                                                        );
                                                                    }}
                                                                    sx={{
                                                                        m: 0.2,
                                                                    }}
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            )}
                                                        </>
                                                    }
                                                    disablePadding
                                                >
                                                    <ListItemText
                                                        id={labelId}
                                                        primary={`${payment.payment_name_en} - ${payment.account_id} `}
                                                        secondary={
                                                            <Typography
                                                                sx={{
                                                                    display:
                                                                        "inline",
                                                                }}
                                                                component="span"
                                                                variant="body2"
                                                                color="text.light"
                                                            >
                                                                {
                                                                    payment.payment_name_ar
                                                                }
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                </List>
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    spacing={0}
                                    margin={1}
                                    alignItems="baseline"
                                >
                                    <IconButton
                                        color="info"
                                        sx={{ p: "10px" }}
                                        aria-label="directions"
                                        onClick={() => {
                                            reset(unitHelper.initialValues);
                                            setShowEdit(true);
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                {showEdit && (
                    <Grid item md={6} xs={12}>
                        <Paper elevation={20}>
                            <Card>
                                <CardHeader
                                    title={t("configuration.payment_setup")}
                                    subheader={t("configuration.payment_setup")}
                                />
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormInputText
                                            label={t("configuration.unit_name")}
                                            control={control}
                                            name="payment_name_en"
                                        />
                                        <FormInputText
                                            label={t("configuration.unit_name")}
                                            control={control}
                                            name="payment_name_ar"
                                        />
                                        <FormInputDropdown
                                            label={t("common.language")}
                                            name="account_id"
                                            options={accountHeadList}
                                            control={control}
                                        />

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            spacing={2}
                                            sx={{
                                                pl: 3,
                                                pr: 2,
                                                mb: 2,
                                                mt: 2,
                                            }}
                                        >
                                            <Button
                                                type="cancel"
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            "Are you Sure?"
                                                        )
                                                    )
                                                        setShowEdit(false);
                                                    return;
                                                }}
                                            >
                                                <u>C</u>ancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                endIcon={<SendIcon />}
                                            >
                                                <u>S</u>ubmit
                                            </Button>
                                        </Stack>
                                    </form>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Stack>
    );
}

export default PaymentConfig;
