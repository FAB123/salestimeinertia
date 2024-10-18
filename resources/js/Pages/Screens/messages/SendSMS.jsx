import React from "react";

import * as Yup from "yup";
import { FormInputText } from "../../../components/mui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import { messageHelper } from "../../../helpers/MessageHelper";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Paper,
} from "@mui/material";

function SendSMS() {
    const { t } = useTranslation();
    const validationSchema = Yup.object({
        mobile: Yup.string(),
        msg: Yup.string(),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: messageHelper.defaultValue,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    return (
        <Paper elevation={20}>
            <Card>
                <CardHeader
                    title={t("message.send_sms")}
                    subheader={t("message.send_sms")}
                />
                <CardContent>
                    <FormInputText
                        label={t("common.mobile")}
                        control={control}
                        name="mobile"
                    />

                    <FormInputText
                        label={t("common.message")}
                        name="comments"
                        control={control}
                        multiline={true}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            if (window.confirm("Are you Sure?")) reset();
                            return;
                        }}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button type="submit" variant="contained">
                        {t("common.send")}
                    </Button>
                </CardActions>
            </Card>
        </Paper>
    );
}

export default SendSMS;
