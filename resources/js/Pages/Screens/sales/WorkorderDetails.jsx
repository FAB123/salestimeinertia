import {
    Stack,
    Grid,
    Paper,
    CardContent,
    Card,
    Divider,
    CardHeader,
    Button,
    TextField,
    Chip,
    Avatar,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import ToasterContainer from "../../../components/ToasterContainer";
import { router, usePage } from "@inertiajs/react";
import { yupResolver } from "@hookform/resolvers/yup";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "react-i18next";
import { getData, postData } from "../../../apis/apiCalls";
import {
    GETALLWORKORDERSTATUS,
    UPDATEWORKORDERSTATUS,
    GETWORKORDERDETAILSBYID,
} from "../../../constants/apiUrls";
import { PurpleButton } from "../../../Utils/Theming";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { FormInputDropdown, FormInputText } from "../../../components/mui";
import toaster from "../../../helpers/toaster";
import { openInNewTab } from "../../../constants/constants";
import { pink } from "@mui/material/colors";
import moment from "moment";

const all = { label: "All", value: "ALL" };

const header = [
    "item_name",
    "item_name_ar",
    "unit_price",
    "unit",
    "quantity",
    "subTotal",
    "discount",
    "vat",
    "total",
    "description",
];

function WorkorderDetails() {
    const { data } = usePage().props;
    const { t } = useTranslation();
    const tableData = [
        { name: t("common.id"), value: data.workorder_id },
        { name: t("common.date"), value: data.transaction_time },
        {
            name: t("customers.customer"),
            value: data.customer ? data.customer?.name : null,
        },
        { name: t("common.subtotal"), value: data.sub_total },
        { name: t("common.tax"), value: data.tax },
        { name: t("common.total"), value: data.total },
        {
            name: t("common.status"),
            value: `${data.status?.status_name_en} [ ${data.status?.status_name_ar} ]`,
        },
        { name: t("common.comments"), value: data.comments },
    ];

    const initialValues = {
        workorder_id: data.workorder_id,
        status_type: data.workorder_status,
        comments: data.comments,
    };

    const [options, setOptions] = useState([all]);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [dialog, setDialog] = useState("view_status");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getData(GETALLWORKORDERSTATUS).then((response) => {
            if (response.status) {
                let status = response.data.map((item) => ({
                    label: `${item.status_name_en} [${item.status_name_ar}]`,
                    value: item.id,
                }));
                setOptions(status);
            }
        });
    }, []);

    const validator = Yup.object({
        status_type: Yup.string().required(t("common.nameisrequierd")),
        comments: Yup.string(t("common.emailisrequired")),
    });

    const { handleSubmit, control } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validator),
        mode: "onBlur",
    });

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(UPDATEWORKORDERSTATUS, values)
                .then((response) => {
                    if (response.error) {
                        toaster.error(t(response.message));
                    } else {
                        toaster.success(t("sales.workorder_status_updated"));
                        router.reload({ only: ["data"] });
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        setDisableSubmit(false);
                    }, 1000);
                    setMessage(null);
                });
        }
    };

    const createInvoice = (type) => {
        let oldCart = JSON.parse(localStorage.getItem(type));
        if (oldCart && oldCart.cartItems.length > 0) {
            toaster.error(t("sales.cart_not_empty"));
            return true;
        }

        getData(`${GETWORKORDERDETAILSBYID}/${data.workorder_id}`).then(
            (response) => {
                if (response.status) {
                    let customerInfo = {
                        ...response.data.customer,
                        customer_id:
                            response.data?.customer?.details?.customer_id,
                    };
                    let data = {
                        inital: false,
                        cartItems: response.data.cartItems,
                        customerInfo: customerInfo,
                        billType: "B2C",
                        workorderID: data.workorder_id,
                        comments: response.data.comments,
                        paymentInfo: [],
                    };

                    localStorage.setItem(type, JSON.stringify(data));

                    if (type === "CASHSALE") {
                        router.get("/sales/cash_sales");
                    } else {
                        router.get("/sales/credit_sales");
                    }
                }
            }
        );
    };

    return (
        <Stack>
            <Breadcrumb
                labelHead={t("modules.workorder")}
                labelSub={t("sales.workorder_details")}
            />
            <ToasterContainer />
            <Grid container spacing={2}>
                <Grid item md={8} xs={12}>
                    <Paper elevation={20} sx={{ marginY: 2 }}>
                        <Card>
                            <CardHeader subheader={t("common.general_info")} />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item md={8} xs={12}>
                                        <TableContainer component={Paper}>
                                            <Table size="small">
                                                <TableBody>
                                                    {tableData.map(
                                                        (tData, key) => (
                                                            <TableRow
                                                                key={key}
                                                                sx={{
                                                                    "&:last-child td, &:last-child th":
                                                                        {
                                                                            border: 0,
                                                                        },
                                                                }}
                                                            >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {tData.name}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                >
                                                                    {
                                                                        tData.value
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <Paper>
                                            <Stack>
                                                <Button
                                                    onClick={() =>
                                                        setDialog(
                                                            "update_status"
                                                        )
                                                    }
                                                >
                                                    {t("sales.update_status")}
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        createInvoice(
                                                            "CASHSALE"
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        "sales.submit_to_cash_sale"
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        createInvoice(
                                                            "CREDITSALE"
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        "sales.submit_to_credit_sale"
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        setDialog(
                                                            "send_to_whatsapp"
                                                        )
                                                    }
                                                >
                                                    {t(
                                                        "sales.send_to_whatsapp"
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        setDialog("view_status")
                                                    }
                                                >
                                                    {t("sales.view_status")}
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Paper>
                    <Paper elevation={20}>
                        <TableContainer component={Paper} sx={{ p: 1 }}>
                            <Table sx={{ minWidth: 650 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        {header.map((item, key) => (
                                            <TableCell key={key}>
                                                {t(`common.${item}`)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.cartItems.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                "&:last-child td, &:last-child th":
                                                    {
                                                        border: 0,
                                                    },
                                            }}
                                        >
                                            {header.map((header, key) => (
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    key={key}
                                                >
                                                    {item[header]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Paper elevation={20} sx={{ marginY: 2 }}>
                        <Card>
                            <CardHeader subheader={t(`sales.${dialog}`)} />
                            <Divider />
                            <CardContent>
                                {dialog === "update_status" && (
                                    <Stack spacing={2}>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <FormInputDropdown
                                                label={t("common.status")}
                                                name="status_type"
                                                control={control}
                                                options={options}
                                            />

                                            <FormInputText
                                                name="comments"
                                                control={control}
                                                label={t("items.comments")}
                                                multiline={true}
                                            />
                                        </form>
                                        <PurpleButton
                                            variant="contained"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            {t("common.update")}
                                        </PurpleButton>
                                    </Stack>
                                )}

                                {dialog === "send_to_whatsapp" && (
                                    <Stack spacing={2}>
                                        {data.customer.mobile ? (
                                            <>
                                                <Chip
                                                    variant="outlined"
                                                    color="primary"
                                                    size="medium"
                                                    label={data.customer.mobile}
                                                    avatar={<Avatar>M</Avatar>}
                                                />
                                                <TextField
                                                    label={t(
                                                        "configuration.whatsapp_delivery_template"
                                                    )}
                                                    variant="outlined"
                                                    multiline={true}
                                                    value={
                                                        message
                                                            ? message
                                                            : data.status
                                                                  ?.whatsapp_message
                                                    }
                                                    onChange={(e) =>
                                                        setMessage(
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={4}
                                                />
                                                <PurpleButton
                                                    variant="contained"
                                                    onClick={() =>
                                                        openInNewTab(
                                                            `https://wa.me/966${
                                                                data.customer
                                                                    .mobile
                                                            }/?text=${
                                                                message
                                                                    ? message
                                                                    : data
                                                                          .status
                                                                          ?.whatsapp_message
                                                            }`
                                                        )
                                                    }
                                                >
                                                    {t("common.send")}
                                                </PurpleButton>
                                            </>
                                        ) : (
                                            <Typography>
                                                {t("common.mobile_not_found")}
                                            </Typography>
                                        )}
                                    </Stack>
                                )}

                                {dialog === "view_status" && (
                                    <Stack>
                                        <Paper elevation={20}>
                                            {data.details.map((item, index) => (
                                                <Card sx={{ m: 1 }} key={index}>
                                                    <CardHeader
                                                        avatar={
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor:
                                                                        pink[500],
                                                                }}
                                                            >
                                                                {item?.details?.status_name_en.charAt(
                                                                    0
                                                                )}
                                                            </Avatar>
                                                        }
                                                        title={`${item?.details?.status_name_en} - ${item?.details?.status_name_ar}`}
                                                        subheader={moment(
                                                            item.created_at
                                                        ).format(
                                                            "DD-MM-YYYY hh:mm A"
                                                        )}
                                                    />
                                                    {item.comments && (
                                                        <Typography
                                                            // variant="body2"
                                                            color="text.primary"
                                                            textAlign={"center"}
                                                        >
                                                            {item.comments}
                                                        </Typography>
                                                    )}
                                                </Card>
                                            ))}
                                        </Paper>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default WorkorderDetails;
