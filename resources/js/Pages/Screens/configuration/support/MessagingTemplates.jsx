import React, { useEffect, useState } from "react";
import { FormMultiInput } from "../../../../components/mui";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import IconButton from "@mui/material/IconButton";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toaster from "../../../../helpers/toaster";

import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import ToasterContainer from "../../../../components/ToasterContainer";
import SendIcon from "@mui/icons-material/Send";
import { getData, postData } from "../../../../apis/apiCalls";
import {
    GETMESSAGINGTEMPLATE,
    SAVEMESSAGINGTEMPLATE,
} from "../../../../constants/apiUrls";
import { messagingHelper } from "../../../../helpers/FormHelper";

function MessagingTemplates() {
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [mode, setMode] = useState("booking");

    const { t } = useTranslation();

    const validationSchema = Yup.object({
        template_id: Yup.number(),
        whatsapp_template_en: Yup.string().max(500),
        whatsapp_template_ar: Yup.string().max(500),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: messagingHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const optionList = [
        { key: "{ID}", value: "Workorder ID" },
        { key: "{CU}", value: "Customer Name" },
        { key: "{CO}", value: "Company Name" },
        { key: "{REVIEWURL}", value: "Review URL" },
    ];

    useEffect(() => {
        getData(`${GETMESSAGINGTEMPLATE}/${mode}`).then((resp) => {
            if (resp.status) {
                let response = resp.templates;
                let data = {
                    template_id: response.template_id,
                    whatsapp_template_en: response.whatsapp_template_en || "",
                    whatsapp_template_ar: response.whatsapp_template_ar || "",
                };
                reset(data);
            }
        });
    }, [mode]);

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVEMESSAGINGTEMPLATE, values)
                .then((response) => {
                    if (response.error) {
                        toaster.error(t(response.message));
                    } else {
                        toaster.success(t(response.message));
                    }
                })
                .finally(() => setDisableSubmit(false));
        }
    };

    return (
        <Stack direction="row" m={1}>
            <ToasterContainer />
            <Grid container justifyContent="center" spacing={1}>
                <Grid item md={8} xs={12}>
                    <Card>
                        <CardContent>
                            <FormControl
                                fullWidth
                                sx={{
                                    m: 1,
                                }}
                            >
                                <InputLabel>
                                    {t("configuration.event")}
                                </InputLabel>
                                <Select
                                    value={mode}
                                    label={t("configuration.event")}
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <MenuItem value={"booking"}>
                                        {t("configuration.booking_template")}
                                    </MenuItem>
                                    <MenuItem value={"review"}>
                                        {t("configuration.review_template")}
                                    </MenuItem>
                                    <MenuItem value={"delvery"}>
                                        {t("configuration.delvery_template")}
                                    </MenuItem>
                                    <MenuItem value={"completed"}>
                                        {t("configuration.completed_template")}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* <FormMultiInput
                                        label={t("configuration.sms_template")}
                                        control={control}
                                        multiline={true}
                                        name="sms_template_en"
                                        name2="sms_template_ar"
                                    /> */}
                                {/* <FormMultiInput
                                        label={t(
                                            "configuration.email_template"
                                        )}
                                        multiline={true}
                                        control={control}
                                        name="email_template_en"
                                        name2="email_template_ar"
                                    /> */}
                                <FormMultiInput
                                    label={t("configuration.whatsapp_template")}
                                    multiline={true}
                                    control={control}
                                    name="whatsapp_template_en"
                                    name2="whatsapp_template_ar"
                                />

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ pl: 3, pr: 2, mb: 2 }}
                                >
                                    <Button
                                        type="cancel"
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => {
                                            if (window.confirm("Are you Sure?"))
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
                </Grid>
                <Grid item md={4} xs={12}>
                    <Card>
                        <CardContent>
                            <TableContainer>
                                <Table size="small">
                                    {optionList.map((item, key) => (
                                        <TableRow key={key}>
                                            <TableCell>{item.key}</TableCell>
                                            <TableCell align="right">
                                                {item.value}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default MessagingTemplates;
