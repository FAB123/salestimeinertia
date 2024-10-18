import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { getData, postData } from "../../../apis/apiCalls";
import ToasterContainer from "../../../components/ToasterContainer";
import toaster from "../../../helpers/toaster";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { initializeStoreConfig } from "../../../helpers/Configuration";
import {
    FormInputText,
    FormMultiInput,
    FormInputDropdown,
    FormInputSwitch,
    FormVatInput,
} from "../../../components/mui/";
import { configHelper, commonHelper } from "../../../helpers/FormHelper";
import StoreConfig from "./support/StoreConfig";
import TableConfig from "./support/TableConfig";
import UnitConfig from "./support/UnitConfig";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import PaymentConfig from "./support/PaymentConfig";
import GenerateBcode from "../items/barcode/GenerateBcode";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { PurpleButton } from "../../../Utils/Theming";
import ProgressLoader from "../../../components/ProgressLoader";
import SubmitController from "./SubmitController";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grow,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { generateGAZTCSID } from "../../../constants/apiUrls";
import TemplateConfig from "./support/TemplateConfig";
import ActivationForm from "../Login/ActivationForm";
import WorkorderStatus from "./support/WorkorderStatus";
import MessagingTemplates from "./support/MessagingTemplates";
import WhatsappWeb from "./support/WhatsappWeb";

function Configuration() {
    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [csidstatus, setCSIDstatus] = useState([]);
    const [updateCSID, setUpdateCSID] = useState(false);
    const [otp, setOTP] = useState(null);
    const [complaintCheckResult, setComplaintCheckResult] = useState(null);

    useEffect(() => {
        getData("/configurations/get_all_configuration").then((resp) => {
            let response = resp.configuration_data;
            let data = {
                vatList: resp.tax_scheme || [],
                company_name: response.company_name || "",
                company_name_ar: response.company_name_ar || "",
                company_address: response.company_address || "",
                company_address_ar: response.company_address_ar || "",
                vat_number: response.vat_number || "",
                company_email: response.company_email || "",
                company_telephone: response.company_telephone || "",
                return_policy: response.return_policy || "",
                return_policy_ar: response.return_policy_ar || "",
                quotation_return_policy: response.quotation_return_policy || "",
                quotation_return_policy_ar:
                    response.quotation_return_policy_ar || "",
                workorder_return_policy: response.workorder_return_policy || "",
                workorder_return_policy_ar:
                    response.workorder_return_policy_ar || "",
                // barcode_billing: response.barcode_billing === "1" ? true : false,
                application_lang: response.application_lang,
                company_fiscal_year_start:
                    response.company_fiscal_year_start || "1",
                currency_symbol: response.currency_symbol || "SAR",
                whatsapp_web_endpoint: response.whatsapp_web_endpoint || "",
                include_tax: response.include_tax === "1" ? true : false,
                fetch_from_server:
                    response.fetch_from_server === "1" ? true : false,
                calc_average_cost:
                    response.calc_average_cost === "1" ? true : false,
                print_after_sale:
                    response.print_after_sale === "1" ? true : false,
                always_focus_on_item:
                    response.always_focus_on_item === "1" ? true : false,
                send_email_after_sale:
                    response.send_email_after_sale === "1" ? true : false,
                sms_api_username: response.sms_api_username || "",
                sms_api_password: response.sms_api_password || "",
                sms_api_sender_id: response.sms_api_sender_id || "",
                //api_provider: response.api_provider || "",
                email_smtp_encryption_type:
                    response.email_smtp_encryption_type || "",
                email_smtp_port: response.email_smtp_port || "",
                email_smtp_server: response.email_smtp_server || "",
                email_api_username: response.email_api_username || "",
                email_api_password: response.email_api_password || "",
                messaging_method: response.messaging_method || "",
                barcode_width: response.barcode_width || "",
                barcode_height: response.barcode_height || "",
                barcode_lable_width: response.barcode_lable_width || "",
                barcode_lable_height: response.barcode_lable_height || "",
                barcode_type: response.barcode_type || "",
                barcode_row1: response.barcode_row1 || "",
                barcode_row2: response.barcode_row2 || "",
                barcode_row3: response.barcode_row3 || "",
                barcode_row1_size: response.barcode_row1_size || "",
                barcode_row2_size: response.barcode_row2_size || "",
                barcode_row3_size: response.barcode_row3_size || "",
                barcode_row4_size: response.barcode_row4_size || "",
                enable_einvoice:
                    response.enable_einvoice === "1" ? true : false,
                invoice_patern: response.invoice_patern || "ABCD-2022",
                b2bprinting: response.b2bprinting || "PDF",
                b2cprinting: response.b2cprinting || "PDF",
                egs_crn_number: response.egs_crn_number || "",
                egs_city_subdivision: response.egs_city_subdivision || "",
                egs_common_name: response.egs_common_name || "",
                egs_street: response.egs_street || "",
                egs_building_number: response.egs_building_number || "",
                egs_postal_zone: response.egs_postal_zone || "",
                egs_branch_name: response.egs_branch_name || "",
                egs_branch_industry: response.egs_branch_industry || "",
                egs_city: response.egs_city || "",
                egs_invoice_type: response.egs_invoice_type || "1100",
                egs_plot_identification: response.egs_plot_identification || "",
            };
            setDisableSubmit(false);
            reset(data);
        });
    }, []);

    const validationSchema = Yup.object({
        company_name: Yup.string().required("Company name Filed is Requierd"),
        company_name_ar: Yup.string(),
        company_address: Yup.string().required("Address is requied Filed"),
        company_address_ar: Yup.string(),
        vat_number: Yup.string().max(15).min(15),
        company_email: Yup.string().email("Invalid email address"),
        company_telephone: Yup.number().required("Telephone is requied Filed"),
        return_policy: Yup.string().required("Return Policy is requied Filed"),
        return_policy_ar: Yup.string().required(
            "Return Policy is requied Filed"
        ),
        quotation_return_policy: Yup.string().required(
            "Return Policy is requied Filed"
        ),
        quotation_return_policy_ar: Yup.string().required(
            "Return Policy is requied Filed"
        ),
        workorder_return_policy: Yup.string().required(
            "Return Policy is requied Filed"
        ),
        workorder_return_policy_ar: Yup.string().required(
            "Return Policy is requied Filed"
        ),
        // barcode_billing: Yup.boolean(),
        barcode_width: Yup.string().required("barcode width is requied Filed"),
        barcode_height: Yup.string().required(
            "barcode height is requied Filed"
        ),
        barcode_lable_width: Yup.string().required(
            "Label width is requied Filed"
        ),
        barcode_lable_height: Yup.string().required(
            "Label height is requied Filed"
        ),
        barcode_row1_size: Yup.string().required(
            "Row 1 font size is requied Filed"
        ),
        barcode_row2_size: Yup.string().required(
            "Row 2 font size is requied Filed"
        ),
        barcode_row3_size: Yup.string().required(
            "Row 3 font size is requied Filed"
        ),
        currency_symbol: Yup.string().required(
            "Curency Symbol is requied Filed"
        ),
        application_lang: Yup.string().required("language is Required"),
        company_fiscal_year_start: Yup.number().required(
            "Fiscal Year is required Filed"
        ),
        include_tax: Yup.boolean(),
        vatList: Yup.array().of(
            Yup.object().shape({
                tax_name: Yup.string().required(t("common.tax_name_required")),
                percent: Yup.number()
                    .required("errorText.name")
                    .test("max", t("common.not_exceed_100"), function (value) {
                        return value <= 100;
                    }),
            })
        ),
        sms_api_username: Yup.string(),
        sms_api_password: Yup.string(),

        sms_api_sender_id: Yup.string(),
        email_smtp_encryption_type: Yup.string(),
        email_smtp_port: Yup.number(),
        email_smtp_server: Yup.string(),
        email_api_username: Yup.string(),
        email_api_password: Yup.string(),
        whatsapp_web_endpoint: Yup.string(),
        messaging_method: Yup.string(),
        invoice_patern: Yup.string()
            .required(t("configuration.einvoice_patern_requierd"))
            .max(9, t("configuration.einvoice_patern_error"))
            .matches(
                /[A-Z]{2,4}-[0-9]{4}/,
                t("configuration.einvoice_patern_error")
            ),
        egs_invoice_type: Yup.string()
            .required(t("configuration.invoice_type_patern_requierd"))
            .max(4, t("configuration.invoice_type_patern_error"))
            .matches(/[1,0]{4}/, t("configuration.invoice_type_patern_error")),
        egs_crn_number: Yup.number().required(),
        egs_city_subdivision: Yup.string().required(),
        egs_common_name: Yup.string().required(),
        egs_street: Yup.string().required(),
        egs_building_number: Yup.string().required().min(4).max(4),
        egs_postal_zone: Yup.string()
            .required()
            .max(5)
            .matches(
                /[0-9]{5}/,
                t("configuration.egs_postal_zone_patern_error")
            ),
        egs_branch_name: Yup.string().required().max(10),
        egs_branch_industry: Yup.string().required(),
        egs_city: Yup.string().required(),
        egs_plot_identification: Yup.string().required().min(4).max(4),
    });

    const {
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: configHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        Object.keys(errors).forEach(function (key, index) {
            toaster.error(errors[key].message);
        });
    }, [errors]);
    const getCSIDStatus = () => {
        getData("/configurations/csid_status").then((response) => {
            if (response.data) {
                let data = response.data.split(",");
                setCSIDstatus(data);
            } else {
                toaster.error(
                    "CSID not found on database. Please configure EGS and generate CSID."
                );
            }
        });
    };

    const onSubmit = (values, { resetForm }) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData("/configurations/save_configuration", values).then(
                (response) => {
                    initializeStoreConfig(true);
                    response.status
                        ? toaster.success(t(response.message))
                        : toaster.error(response.message);
                    setTimeout(() => {
                        setDisableSubmit(false);
                    }, 1000);
                }
            );
        }
    };

    const [tab, setTab] = React.useState(0);
    const barcodeRef = useRef(null);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const generateCSID = () => {
        if (!otp || otp.length !== 6) {
            toaster.error("invalid otp.");
        } else {
            setDisableSubmit(true);
            postData(generateGAZTCSID, { otp: otp }).then((response) => {
                setComplaintCheckResult(response.table);
                if (response.error) {
                    toaster.error(t(response.message) + "\n" + response.info);
                } else {
                    toaster.success(t(response.message));
                    setUpdateCSID(false);
                }
                setDisableSubmit(false);
            });
        }
    };

    return (
        <Stack>
            <Breadcrumb
                labelHead={t("configuration.store_configuration")}
                labelSub={t("configuration.store_configuration")}
            />

            <ProgressLoader open={disableSubmit} />
            <ToasterContainer />
            <Stack direction={"row"}>
                <Box
                    sx={{
                        flexGrow: 1,
                        mt: 1,
                        bgcolor: "background.paper",
                        display: "flex",
                        borderColor: "divider",
                    }}
                >
                    <Paper sx={{ m: 1 }}>
                        <Tabs
                            variant="scrollable"
                            value={tab}
                            onChange={handleChange}
                            textColor="secondary"
                            indicatorColor="secondary"
                            orientation="vertical"
                        >
                            <Tab label={t("configuration.general_settings")} />
                            <Tab label={t("configuration.braches")} />
                            <Tab label={t("configuration.tables")} />
                            <Tab label={t("configuration.units")} />
                            <Tab label={t("configuration.workorder_status")} />
                            <Tab label={t("configuration.barcode_settings")} />
                            <Tab label={t("configuration.invoice")} />
                            <Tab label={t("configuration.email_sms_setup")} />
                            <Tab
                                label={t("configuration.sales_purchase_setup")}
                            />
                            <Tab label={t("configuration.payment_setup")} />
                            <Tab label={t("configuration.einvoice_setup")} />
                            <Tab label={t("configuration.messaging_setup")} />
                            <Tab label={t("configuration.whatsappweb_setup")} />
                            <Tab label={t("common.activate")} />
                        </Tabs>
                    </Paper>
                    <Divider />
                    <Stack width={"100%"}>
                        {tab === 1 && <StoreConfig />}
                        {tab === 2 && <TableConfig />}
                        {tab === 3 && <UnitConfig />}
                        {tab === 4 && <WorkorderStatus />}
                        {tab === 6 && <TemplateConfig />}
                        {tab === 9 && <PaymentConfig />}
                        {tab === 11 && <MessagingTemplates />}
                        {tab === 12 && <WhatsappWeb control={control} />}
                        {tab === 13 && (
                            <Paper sx={{ m: 2, p: 2 }}>
                                <ActivationForm type={"api"} />
                            </Paper>
                        )}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ p: 1 }}>
                                <Stack direction={"row"}>
                                    <Grid container spacing={1}>
                                        {tab === 0 && (
                                            <>
                                                <Grid item md={7} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.company_config"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.company_config"
                                                                )}
                                                            />
                                                            <Divider />
                                                            <CardContent>
                                                                <FormMultiInput
                                                                    label={t(
                                                                        "common.companyname"
                                                                    )}
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="company_name"
                                                                    name2="company_name_ar"
                                                                />

                                                                <FormMultiInput
                                                                    label={t(
                                                                        "common.companyaddress"
                                                                    )}
                                                                    multiline={
                                                                        true
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="company_address"
                                                                    name2="company_address_ar"
                                                                />

                                                                <FormInputText
                                                                    label={t(
                                                                        "common.vat"
                                                                    )}
                                                                    name="vat_number"
                                                                    control={
                                                                        control
                                                                    }
                                                                    postappendCount={
                                                                        true
                                                                    }
                                                                />

                                                                <Stack
                                                                    direction={
                                                                        "row"
                                                                    }
                                                                >
                                                                    <FormInputText
                                                                        label={t(
                                                                            "common.tel"
                                                                        )}
                                                                        name="company_telephone"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />

                                                                    <FormInputText
                                                                        label={t(
                                                                            "common.email"
                                                                        )}
                                                                        name="company_email"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <FormMultiInput
                                                                    label={t(
                                                                        "configuration.return_policy"
                                                                    )}
                                                                    multiline={
                                                                        true
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="return_policy"
                                                                    name2="return_policy_ar"
                                                                />
                                                            </CardContent>
                                                            {/* <CardActions> */}
                                                            <SubmitController />

                                                            {/* </CardActions> */}
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                                <Grid item md={5} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.general_settings"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.general_settings"
                                                                )}
                                                            />
                                                            <Divider />
                                                            <CardContent>
                                                                {/* <FormInputSwitch
                              label={t("configuration.barcode_billing")}
                              name="barcode_billing"
                              control={control}
                              onText="No"
                              OffText="Yes"
                            /> */}

                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.currency_symbol"
                                                                    )}
                                                                    name="currency_symbol"
                                                                    control={
                                                                        control
                                                                    }
                                                                />

                                                                <FormInputDropdown
                                                                    label={t(
                                                                        "common.language"
                                                                    )}
                                                                    name="application_lang"
                                                                    options={
                                                                        commonHelper.languages
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                />

                                                                <FormInputDropdown
                                                                    label={t(
                                                                        "common.fiscal_year_start"
                                                                    )}
                                                                    name="company_fiscal_year_start"
                                                                    options={
                                                                        commonHelper.financial_year
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                    <Paper
                                                        elevation={20}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.tax_settings"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.tax_settings"
                                                                )}
                                                            />
                                                            <Divider />
                                                            <CardContent>
                                                                <FormInputSwitch
                                                                    label={t(
                                                                        "configuration.include_tax"
                                                                    )}
                                                                    name="include_tax"
                                                                    control={
                                                                        control
                                                                    }
                                                                    onText="Yes"
                                                                    OffText="No"
                                                                />
                                                                <FormVatInput
                                                                    {...{
                                                                        control,
                                                                        editable: true,
                                                                    }}
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                            </>
                                        )}

                                        {tab === 5 && (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.barcode_settings"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.barcode_settings"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={6}
                                                                    >
                                                                        <FormInputText
                                                                            label={t(
                                                                                "configuration.barcode_height"
                                                                            )}
                                                                            name="barcode_height"
                                                                            type="number"
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                        <FormInputText
                                                                            label={t(
                                                                                "configuration.barcode_width"
                                                                            )}
                                                                            name="barcode_width"
                                                                            type="number"
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                        <FormInputText
                                                                            label={t(
                                                                                "configuration.label_height"
                                                                            )}
                                                                            name="barcode_lable_height"
                                                                            type="number"
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                        <FormInputText
                                                                            label={t(
                                                                                "configuration.label_width"
                                                                            )}
                                                                            name="barcode_lable_width"
                                                                            type="number"
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                        <FormInputDropdown
                                                                            label={t(
                                                                                "configuration.barcode_type"
                                                                            )}
                                                                            name="barcode_type"
                                                                            options={[
                                                                                {
                                                                                    label: "CODE 39",
                                                                                    value: "CODE39",
                                                                                },
                                                                                {
                                                                                    label: "CODE 128",
                                                                                    value: "CODE128",
                                                                                },
                                                                                {
                                                                                    label: "EAN 8",
                                                                                    value: "EAN8",
                                                                                },
                                                                                {
                                                                                    label: "EAN 13",
                                                                                    value: "EAN13",
                                                                                },
                                                                            ]}
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                    </Grid>

                                                                    <Grid
                                                                        item
                                                                        xs={6}
                                                                    >
                                                                        <FormInputDropdown
                                                                            label={t(
                                                                                "configuration.row1"
                                                                            )}
                                                                            name="barcode_row1"
                                                                            options={[
                                                                                {
                                                                                    label: t(
                                                                                        "items.itemname"
                                                                                    ),
                                                                                    value: "ITEMNAME",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.itemnamear"
                                                                                    ),
                                                                                    value: "ITEMNAMEAR",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.product_category"
                                                                                    ),
                                                                                    value: "ITEMCATEGORY",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.unit_price"
                                                                                    ),
                                                                                    value: "UNITPRICE",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "common.companyname"
                                                                                    ),
                                                                                    value: "COMPANYNAME",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "common.companynamear"
                                                                                    ),
                                                                                    value: "COMPANYNAMEAR",
                                                                                },
                                                                            ]}
                                                                            control={
                                                                                control
                                                                            }
                                                                        />
                                                                        <FormInputDropdown
                                                                            label={t(
                                                                                "configuration.row2"
                                                                            )}
                                                                            name="barcode_row2"
                                                                            options={[
                                                                                {
                                                                                    label: t(
                                                                                        "items.itemname"
                                                                                    ),
                                                                                    value: "ITEMNAME",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.itemnamear"
                                                                                    ),
                                                                                    value: "ITEMNAMEAR",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.product_category"
                                                                                    ),
                                                                                    value: "ITEMCATEGORY",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.unit_price"
                                                                                    ),
                                                                                    value: "UNITPRICE",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "common.companyname"
                                                                                    ),
                                                                                    value: "COMPANYNAME",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "common.companynamear"
                                                                                    ),
                                                                                    value: "COMPANYNAMEAR",
                                                                                },
                                                                            ]}
                                                                            control={
                                                                                control
                                                                            }
                                                                        />

                                                                        <FormInputDropdown
                                                                            label={t(
                                                                                "configuration.row3"
                                                                            )}
                                                                            name="barcode_row3"
                                                                            options={[
                                                                                {
                                                                                    label: t(
                                                                                        "items.itemname"
                                                                                    ),
                                                                                    value: "ITEMNAME",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.itemnamear"
                                                                                    ),
                                                                                    value: "ITEMNAMEAR",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.product_category"
                                                                                    ),
                                                                                    value: "ITEMCATEGORY",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "items.unit_price"
                                                                                    ),
                                                                                    value: "UNITPRICE",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "common.companyname"
                                                                                    ),
                                                                                    value: "COMPANYNAME",
                                                                                },
                                                                                {
                                                                                    label: t(
                                                                                        "common.companynamear"
                                                                                    ),
                                                                                    value: "COMPANYNAMEAR",
                                                                                },
                                                                            ]}
                                                                            control={
                                                                                control
                                                                            }
                                                                        />

                                                                        <Stack direction="row">
                                                                            <FormInputText
                                                                                label={t(
                                                                                    "configuration.barcode_row1_size"
                                                                                )}
                                                                                name="barcode_row1_size"
                                                                                type="number"
                                                                                control={
                                                                                    control
                                                                                }
                                                                            />
                                                                            <FormInputText
                                                                                label={t(
                                                                                    "configuration.barcode_row2_size"
                                                                                )}
                                                                                name="barcode_row2_size"
                                                                                type="number"
                                                                                control={
                                                                                    control
                                                                                }
                                                                            />
                                                                        </Stack>
                                                                        <Stack direction="row">
                                                                            <FormInputText
                                                                                label={t(
                                                                                    "configuration.barcode_row3_size"
                                                                                )}
                                                                                name="barcode_row3_size"
                                                                                type="number"
                                                                                control={
                                                                                    control
                                                                                }
                                                                            />
                                                                            <FormInputText
                                                                                label={t(
                                                                                    "configuration.barcode_row4_size"
                                                                                )}
                                                                                name="barcode_row4_size"
                                                                                type="number"
                                                                                control={
                                                                                    control
                                                                                }
                                                                            />
                                                                        </Stack>
                                                                    </Grid>
                                                                </Grid>
                                                                <SubmitController />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.barcode_demo"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.barcode_demo"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <Stack
                                                                    ref={
                                                                        barcodeRef
                                                                    }
                                                                >
                                                                    <GenerateBcode
                                                                        value="504010"
                                                                        row1text="Row 1 Demo Text"
                                                                        row2text="Row 2 Demo Text"
                                                                        row3text="Price: 30 SR"
                                                                        format={watch(
                                                                            "barcode_type"
                                                                        )}
                                                                        width={watch(
                                                                            "barcode_width"
                                                                        )}
                                                                        height={watch(
                                                                            "barcode_height"
                                                                        )}
                                                                        row1size={watch(
                                                                            "barcode_row1_size"
                                                                        )}
                                                                        row2size={watch(
                                                                            "barcode_row2_size"
                                                                        )}
                                                                        row3size={watch(
                                                                            "barcode_row3_size"
                                                                        )}
                                                                    />
                                                                </Stack>
                                                                <Stack
                                                                    alignItems={
                                                                        "center"
                                                                    }
                                                                    sx={{
                                                                        mt: 2,
                                                                    }}
                                                                >
                                                                    <ReactToPrint
                                                                        pageStyle={`@page {size: ${watch(
                                                                            "barcode_lable_height"
                                                                        )}cm ${watch(
                                                                            "barcode_lable_width"
                                                                        )}cm;}`}
                                                                        // pageStyle={`{ size: 2.5in 4in }`}
                                                                        trigger={() => (
                                                                            <PurpleButton
                                                                                variant="contained"
                                                                                sx={{
                                                                                    width: 100,
                                                                                }}
                                                                                color="info"
                                                                            >
                                                                                Test
                                                                                Print
                                                                            </PurpleButton>
                                                                        )}
                                                                        content={() =>
                                                                            barcodeRef.current
                                                                        }
                                                                    />
                                                                </Stack>
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                            </>
                                        )}

                                        {tab === 7 && (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.email_setup"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.email_setup"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.smtp_server"
                                                                    )}
                                                                    name="email_smtp_server"
                                                                    control={
                                                                        control
                                                                    }
                                                                />

                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.smtp_port"
                                                                    )}
                                                                    name="email_smtp_port"
                                                                    type="number"
                                                                    control={
                                                                        control
                                                                    }
                                                                />

                                                                <FormInputDropdown
                                                                    label={t(
                                                                        "configuration.smtp_encryption"
                                                                    )}
                                                                    name="email_smtp_encryption_type"
                                                                    options={[
                                                                        {
                                                                            label: "True (Use TLS)",
                                                                            value: true,
                                                                        },
                                                                        {
                                                                            label: "False",
                                                                            value: false,
                                                                        },
                                                                    ]}
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.smtp_username"
                                                                    )}
                                                                    name="email_api_username"
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.smtp_password"
                                                                    )}
                                                                    name="email_api_password"
                                                                    type="password"
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.sms_setup"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.sms_setup"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.sms_username"
                                                                    )}
                                                                    name="sms_api_username"
                                                                    control={
                                                                        control
                                                                    }
                                                                />

                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.sms_password"
                                                                    )}
                                                                    name="sms_api_password"
                                                                    type="password"
                                                                    control={
                                                                        control
                                                                    }
                                                                />

                                                                <FormInputText
                                                                    label={t(
                                                                        "configuration.sms_sender_id"
                                                                    )}
                                                                    name="sms_api_sender_id"
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                                <FormInputDropdown
                                                                    label={t(
                                                                        "configuration.messaging_method"
                                                                    )}
                                                                    name="messaging_method"
                                                                    options={[
                                                                        {
                                                                            label: t(
                                                                                "common.none"
                                                                            ),
                                                                            value: "NONE",
                                                                        },
                                                                        // {
                                                                        //     name: t(
                                                                        //         "configuration.smsapi"
                                                                        //     ),
                                                                        //     value: "SMSAPI",
                                                                        // },
                                                                        // {
                                                                        //     name: t(
                                                                        //         "configuration.devicesms"
                                                                        //     ),
                                                                        //     value: "DEVICESMS",
                                                                        // },
                                                                        {
                                                                            label: t(
                                                                                "configuration.whatsapp"
                                                                            ),
                                                                            value: "WHATSAPP",
                                                                        },
                                                                    ]}
                                                                    control={
                                                                        control
                                                                    }
                                                                />
                                                            </CardContent>
                                                            <SubmitController />
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                            </>
                                        )}

                                        {tab === 8 && (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.sales_setup"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.sales_setup"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <FormInputSwitch
                                                                    label={t(
                                                                        "configuration.print_after_sale"
                                                                    )}
                                                                    name="print_after_sale"
                                                                    control={
                                                                        control
                                                                    }
                                                                    onText="Yes"
                                                                    OffText="No"
                                                                />
                                                                <FormInputSwitch
                                                                    label={t(
                                                                        "configuration.always_focus_on_item"
                                                                    )}
                                                                    name="always_focus_on_item"
                                                                    control={
                                                                        control
                                                                    }
                                                                    onText="Yes"
                                                                    OffText="No"
                                                                />
                                                                <FormInputSwitch
                                                                    label={t(
                                                                        "configuration.send_email_after_sale"
                                                                    )}
                                                                    name="send_email_after_sale"
                                                                    control={
                                                                        control
                                                                    }
                                                                    onText="Yes"
                                                                    OffText="No"
                                                                />

                                                                <Stack direction="row">
                                                                    <FormInputDropdown
                                                                        label={t(
                                                                            "configuration.b2c"
                                                                        )}
                                                                        name="b2cprinting"
                                                                        options={[
                                                                            {
                                                                                label: t(
                                                                                    "configuration.thermal"
                                                                                ),
                                                                                value: "THERMAL",
                                                                            },
                                                                            {
                                                                                label: t(
                                                                                    "configuration.pdf"
                                                                                ),
                                                                                value: "STANDARD",
                                                                            },
                                                                            // {
                                                                            //   label: t("configuration.dotmatrix"),
                                                                            //   value: "DOTMARIX",
                                                                            // },
                                                                        ]}
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                    <FormInputDropdown
                                                                        label={t(
                                                                            "configuration.b2b"
                                                                        )}
                                                                        name="b2bprinting"
                                                                        options={[
                                                                            {
                                                                                label: t(
                                                                                    "configuration.pdf"
                                                                                ),
                                                                                value: "STANDARD",
                                                                            },
                                                                            {
                                                                                label: t(
                                                                                    "configuration.gazt"
                                                                                ),
                                                                                value: "GAZT",
                                                                            },
                                                                            // {
                                                                            //   label: t("configuration.dotmatrix"),
                                                                            //   value: "DOTMARIX",
                                                                            // },
                                                                        ]}
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <FormMultiInput
                                                                    label={t(
                                                                        "configuration.quotation_return_policy"
                                                                    )}
                                                                    multiline={
                                                                        true
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="quotation_return_policy"
                                                                    name2="quotation_return_policy_ar"
                                                                />
                                                                <FormMultiInput
                                                                    label={t(
                                                                        "configuration.workorder_return_policy"
                                                                    )}
                                                                    multiline={
                                                                        true
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                    name="workorder_return_policy"
                                                                    name2="workorder_return_policy_ar"
                                                                />
                                                            </CardContent>
                                                            <SubmitController />
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.purchase_setup"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.purchase_setup"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <FormInputSwitch
                                                                    label={t(
                                                                        "configuration.calc_average_cost"
                                                                    )}
                                                                    name="calc_average_cost"
                                                                    control={
                                                                        control
                                                                    }
                                                                    onText="No"
                                                                    OffText="Yes"
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                    <Paper
                                                        elevation={20}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.items_setup"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.items_setup"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <FormInputSwitch
                                                                    label={t(
                                                                        "configuration.fetch_from_server"
                                                                    )}
                                                                    name="fetch_from_server"
                                                                    control={
                                                                        control
                                                                    }
                                                                    onText="No"
                                                                    OffText="Yes"
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                            </>
                                        )}

                                        {tab === 10 && (
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardHeader
                                                                // title={t(
                                                                //     "configuration.einvoice_setup"
                                                                // )}
                                                                subheader={t(
                                                                    "configuration.einvoice_setup"
                                                                )}
                                                            />
                                                            <Divider />

                                                            <CardContent>
                                                                <Stack direction="row">
                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_custom_id"
                                                                        )}
                                                                        name="egs_common_name"
                                                                        helperText="unique Tracking Name for EGS Unit EGS1-886431145"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />

                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_branch_id"
                                                                        )}
                                                                        name="egs_branch_name"
                                                                        helperText="The branch name for Taxpayers- In case of VAT Groups this field should contain the 10-digit TIN number of the oganization.                            If 11th digit of Organization Identifier is not =
                                1 then Free text If 11th digit of Organization
                                Identifier = 1 then needs to be a 10 digit number"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <Stack direction="row">
                                                                    <FormInputDropdown
                                                                        label={t(
                                                                            "configuration.egs_invoice_type"
                                                                        )}
                                                                        name="egs_invoice_type"
                                                                        options={[
                                                                            {
                                                                                label: "Tax Invoice Only",
                                                                                value: "1000",
                                                                            },
                                                                            {
                                                                                label: "Simplified Tax Invoice Only",
                                                                                value: "0100",
                                                                            },
                                                                            {
                                                                                label: "BOTH",
                                                                                value: "1100",
                                                                            },
                                                                        ]}
                                                                        control={
                                                                            control
                                                                        }
                                                                    />

                                                                    {/* <FormInputText
                                label={t("configuration.egs_invoice_type")}
                                name="egs_invoice_type"
                                helperText="TSXY - Tax Invoice(T), Simplified Tax Invoice (S), (X), (Y). The input should be
                                using the digits 0 & 1 and mapping those to “TSXY” where: 0 = False/Not sup-
                                ported 1= True/Supported. (X) and (Y) are for future use and should be set to 0"
                                control={control}
                              /> */}

                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.invoice_patern"
                                                                        )}
                                                                        name="invoice_patern"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />

                                                                    {/* <FormInputText
                                label={t("configuration.egs_branch_name")}
                                name="egs_branch_name"
                                helperText="The branch name for Taxpayers- In case of VAT Groups this field should contain the 10-digit TIN number of the oganization.                            If 11th digit of Organization Identifier is not =
                                1 then Free text If 11th digit of Organization
                                Identifier = 1 then needs to be a 10 digit number"
                                control={control}
                              /> */}
                                                                </Stack>

                                                                <Box
                                                                    sx={{
                                                                        m: 1,
                                                                    }}
                                                                >
                                                                    <Paper
                                                                        elevation={
                                                                            6
                                                                        }
                                                                        sx={{
                                                                            p: 2,
                                                                        }}
                                                                    >
                                                                        <Stack
                                                                            direction="row"
                                                                            justifyContent="space-between"
                                                                            alignItems="center"
                                                                        >
                                                                            <Stack>
                                                                                <Typography
                                                                                    variant="subtitle1"
                                                                                    sx={{
                                                                                        color: "success",
                                                                                    }}
                                                                                >
                                                                                    Cryptographic
                                                                                    Stamp
                                                                                    Identifiers
                                                                                    Status:
                                                                                </Typography>
                                                                            </Stack>
                                                                            <Stack
                                                                                direction="row"
                                                                                spacing={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <Button
                                                                                    color="error"
                                                                                    variant="contained"
                                                                                    onClick={
                                                                                        getCSIDStatus
                                                                                    }
                                                                                >
                                                                                    Get
                                                                                    CSID
                                                                                    Status
                                                                                </Button>
                                                                                <PurpleButton
                                                                                    onClick={() =>
                                                                                        setUpdateCSID(
                                                                                            true
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Download
                                                                                    CSID
                                                                                </PurpleButton>
                                                                            </Stack>
                                                                        </Stack>

                                                                        {updateCSID && (
                                                                            <Grow
                                                                                in={
                                                                                    true
                                                                                }
                                                                            >
                                                                                <Stack
                                                                                    direction="row"
                                                                                    spacing={
                                                                                        2
                                                                                    }
                                                                                    margin={
                                                                                        2
                                                                                    }
                                                                                    justifyContent="space-between"
                                                                                    alignItems="center"
                                                                                >
                                                                                    <TextField
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            setOTP(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                        label={t(
                                                                                            "configuration.egs_otp"
                                                                                        )}
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                    />

                                                                                    <PurpleButton
                                                                                        onClick={
                                                                                            generateCSID
                                                                                        }
                                                                                        sx={{
                                                                                            width: "50%",
                                                                                        }}
                                                                                    >
                                                                                        GET
                                                                                    </PurpleButton>
                                                                                </Stack>
                                                                            </Grow>
                                                                        )}

                                                                        {csidstatus.length >
                                                                            0 && (
                                                                            <Card
                                                                                sx={{
                                                                                    mt: 2,
                                                                                    p: 2,
                                                                                }}
                                                                                raised={
                                                                                    true
                                                                                }
                                                                            >
                                                                                {csidstatus.map(
                                                                                    (
                                                                                        item
                                                                                    ) => (
                                                                                        <>
                                                                                            {item && (
                                                                                                <Stack
                                                                                                    direction="row"
                                                                                                    justifyContent={
                                                                                                        "space-between"
                                                                                                    }
                                                                                                >
                                                                                                    <Typography>
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </Typography>
                                                                                                    <Typography
                                                                                                        sx={{
                                                                                                            color: "#743587",
                                                                                                        }}
                                                                                                    >
                                                                                                        VALID
                                                                                                    </Typography>
                                                                                                </Stack>
                                                                                            )}
                                                                                            <Divider
                                                                                                orientation="horizontal"
                                                                                                variant="fullWidth"
                                                                                            ></Divider>
                                                                                        </>
                                                                                    )
                                                                                )}
                                                                            </Card>
                                                                        )}
                                                                        <Dialog
                                                                            open={
                                                                                complaintCheckResult
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onClose={() =>
                                                                                setComplaintCheckResult(
                                                                                    null
                                                                                )
                                                                            }
                                                                            aria-labelledby="alert-dialog-title"
                                                                            aria-describedby="alert-dialog-description"
                                                                        >
                                                                            <DialogTitle id="alert-dialog-title">
                                                                                {
                                                                                    "Complaint Check Result"
                                                                                }
                                                                            </DialogTitle>
                                                                            <DialogContent>
                                                                                {complaintCheckResult &&
                                                                                    complaintCheckResult.passed.map(
                                                                                        (
                                                                                            item
                                                                                        ) => {
                                                                                            return (
                                                                                                <Stack
                                                                                                    direction="row"
                                                                                                    justifyContent="space-between"
                                                                                                >
                                                                                                    <Typography>
                                                                                                        {
                                                                                                            item.type
                                                                                                        }
                                                                                                    </Typography>

                                                                                                    <Typography
                                                                                                        sx={{
                                                                                                            color: "#03fc45",
                                                                                                        }}
                                                                                                    >
                                                                                                        :
                                                                                                        VALID
                                                                                                    </Typography>
                                                                                                </Stack>
                                                                                            );
                                                                                        }
                                                                                    )}

                                                                                {complaintCheckResult &&
                                                                                    complaintCheckResult.failed.map(
                                                                                        (
                                                                                            item
                                                                                        ) => {
                                                                                            return (
                                                                                                <Stack
                                                                                                    direction="row"
                                                                                                    justifyContent="space-between"
                                                                                                >
                                                                                                    <Typography>
                                                                                                        {
                                                                                                            item.type
                                                                                                        }
                                                                                                    </Typography>

                                                                                                    <Typography
                                                                                                        sx={{
                                                                                                            color: "#fc0703",
                                                                                                        }}
                                                                                                    >
                                                                                                        :
                                                                                                        NOT
                                                                                                        VALID
                                                                                                    </Typography>
                                                                                                </Stack>
                                                                                            );
                                                                                        }
                                                                                    )}

                                                                                {complaintCheckResult &&
                                                                                    complaintCheckResult
                                                                                        .failed
                                                                                        .length >
                                                                                        0 && (
                                                                                        <Stack>
                                                                                            <Table size="small">
                                                                                                <TableHead>
                                                                                                    <TableRow>
                                                                                                        <TableCell>
                                                                                                            Type
                                                                                                        </TableCell>
                                                                                                        <TableCell align="right">
                                                                                                            Error
                                                                                                            Messages
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                </TableHead>
                                                                                                <TableBody>
                                                                                                    {complaintCheckResult.failed.map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) => {
                                                                                                            return (
                                                                                                                <TableRow>
                                                                                                                    <TableCell>
                                                                                                                        {
                                                                                                                            item.type
                                                                                                                        }
                                                                                                                    </TableCell>
                                                                                                                    <TableCell align="right">
                                                                                                                        {item.errorMessages.map(
                                                                                                                            (
                                                                                                                                subItem
                                                                                                                            ) =>
                                                                                                                                subItem.message
                                                                                                                        )}
                                                                                                                    </TableCell>
                                                                                                                </TableRow>
                                                                                                            );
                                                                                                        }
                                                                                                    )}
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </Stack>
                                                                                    )}
                                                                            </DialogContent>
                                                                            <DialogActions>
                                                                                <PurpleButton
                                                                                    variant="outlined"
                                                                                    onClick={() =>
                                                                                        setComplaintCheckResult(
                                                                                            null
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {t(
                                                                                        "common.close"
                                                                                    )}
                                                                                </PurpleButton>
                                                                            </DialogActions>
                                                                        </Dialog>
                                                                    </Paper>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <Paper elevation={20}>
                                                        <Card>
                                                            <CardContent>
                                                                <Stack direction="row">
                                                                    {/* <FormInputDropdown
                                label={t("configuration.enable_einvoice")}
                                name="enable_einvoice"
                                options={[
                                  { label: "Production", value: 1 },
                                  { label: "Disable", value: 0 },
                                ]}
                                control={control}
                              /> */}
                                                                    <FormInputSwitch
                                                                        label={t(
                                                                            "configuration.enable_einvoice"
                                                                        )}
                                                                        name="enable_einvoice"
                                                                        control={
                                                                            control
                                                                        }
                                                                        onText="Enable"
                                                                        OffText="Disable"
                                                                    />
                                                                </Stack>

                                                                <Stack direction="row">
                                                                    <FormInputText
                                                                        label={t(
                                                                            "common.city"
                                                                        )}
                                                                        name="egs_city"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_city_subdivision"
                                                                        )}
                                                                        name="egs_city_subdivision"
                                                                        helperText={
                                                                            "EAST/WEST/NORTH/SOUTH"
                                                                        }
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <Stack direction="row">
                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_building_number"
                                                                        )}
                                                                        name="egs_building_number"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />

                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_plot_identification"
                                                                        )}
                                                                        name="egs_plot_identification"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <Stack direction="row">
                                                                    <FormInputText
                                                                        label={t(
                                                                            "common.cr_number"
                                                                        )}
                                                                        name="egs_crn_number"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_postal_zone"
                                                                        )}
                                                                        name="egs_postal_zone"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <Stack direction="row">
                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_street"
                                                                        )}
                                                                        name="egs_street"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                    <FormInputText
                                                                        label={t(
                                                                            "configuration.egs_branch_industry"
                                                                        )}
                                                                        name="egs_branch_industry"
                                                                        control={
                                                                            control
                                                                        }
                                                                    />
                                                                </Stack>

                                                                <SubmitController />
                                                            </CardContent>
                                                        </Card>
                                                    </Paper>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Stack>
                            </Box>
                        </form>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}

export default Configuration;
