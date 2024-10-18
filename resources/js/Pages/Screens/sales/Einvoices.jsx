import React, { useState, useEffect } from "react";

import Breadcrumb from "../../../components/Breadcrumb";
import { Grid, IconButton, Paper, Stack, Table } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    GETALLGAZTJOBS,
    GETALLGAZTJOBREQUEST,
} from "../../../constants/apiUrls";
import { getData } from "../../../apis/apiCalls";

// import GaztTable from "../../../components/Tables/GaztTable";

import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Typography from "@mui/material/Typography";
import { PosAlert, PurpleButton } from "../../../Utils/Theming";
import OnlinePredictionRoundedIcon from "@mui/icons-material/OnlinePredictionRounded";
import { Box } from "@mui/system";
import { usePage } from "@inertiajs/react";
import ReportTables from "../../../components/table/ReportTables";
import GaztTable from "../../../components/table/GaztTable";

function Einvoices() {
    const { t } = useTranslation();
    const title = t("sales.e_invoces");
    const [message, setMessage] = useState(null);

    const { storeData, configurationData } = usePage().props;

    // const [storeData, setStoreData] = useState({});

    const [einvoiceisEnabled, setEinvoiceisEnabled] = useState(null);

    useEffect(() => {
        setEinvoiceisEnabled(configurationData?.enable_einvoice);
    }, []);

    const sendToZatka = (id) => {
        getData(`${GETALLGAZTJOBREQUEST}/${id}`).then((data) => {
            setMessage(t(data.message));
        });
    };

    const header = [
        {
            name: "id",
            label: t("common.id"),
            options: {},
        },
        {
            name: "document_id",
            label: t("common.document_id"),
            options: {},
        },
        {
            name: "name",
            label: t("customers.customer"),
            options: {},
        },
        {
            name: "bill_type",
            label: t("sales.bill_type"),
            options: {},
        },
        {
            name: "inv_type",
            label: t("common.type"),
            options: {
                customBodyRender: (value) =>
                    value === "INV"
                        ? "INVOICE"
                        : value === "DEB"
                        ? "DEBIT NOTE"
                        : "CREDIT NOTE",
            },
            // lookup: { INV: "INVOICE", DEB: "DEBIT NOTE", CRE: "CREDIT NOTE" },
        },
        {
            name: "sub_total",
            label: t("common.subtotal"),
            options: {},
        },
        {
            name: "tax",
            label: t("common.tax"),
            options: {},
        },
        {
            name: "total",
            label: t("common.total"),
            options: {},
        },
        {
            name: "log",
            label: t("common.comments"),
            options: {
                customBodyRender: (value) => <ExpandableText text={value} />,
            },
        },
        {
            name: "id",
            label: " ",
            options: {
                customBodyRender: (value) => {
                    return (
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                color="primary"
                                component="span"
                                style={{ padding: "0 5px 0 5px" }}
                                onClick={() => {
                                    sendToZatka(value);
                                }}
                            >
                                <OnlinePredictionRoundedIcon />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];

    return (
        <Stack>
            <PosAlert message={message} setMessage={setMessage} />
            <Breadcrumb
                labelHead={t("sales.view_e_invocese")}
                labelSub="View E-invoices"
            />

            {einvoiceisEnabled === "1" ? (
                <GaztTable title={title} header={header} url={GETALLGAZTJOBS} />
            ) : (
                <Box sx={{ m: 2 }}>
                    <Paper elevation={20} sx={{ p: 2 }}>
                        <Grid
                            container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            style={{ minHeight: "70vh" }}
                        >
                            <Stack direction="row">
                                <Typography variant="h4">
                                    E INVOICE IS NOT ACTIVATED!!
                                </Typography>
                            </Stack>
                            <Stack direction="row">
                                <PurpleButton
                                    // onClick={() => navigate(-1)}
                                    variant="contained"
                                    color="error"
                                >
                                    Back
                                </PurpleButton>
                            </Stack>
                        </Grid>
                    </Paper>
                </Box>
            )}
        </Stack>
    );
}

function ExpandableText(props) {
    const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState(
        props.text ? `${props.text.substring(0, 10)}...` : null
    );

    useEffect(() => {
        if (props.text) {
            if (expanded) {
                setText(props.text);
            } else {
                setText(`${props.text.substring(0, 10)}...`);
            }
        }
    }, [expanded]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            {text && (
                <Stack direction={"row"}>
                    <Typography>{text} </Typography>
                    <IconButton
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                    >
                        {expanded ? (
                            <ExpandLessRoundedIcon />
                        ) : (
                            <ExpandMoreRoundedIcon />
                        )}
                    </IconButton>
                </Stack>
            )}
        </>
    );
}

export default Einvoices;
