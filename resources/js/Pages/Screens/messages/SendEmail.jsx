import React from "react";

import { FormInputText } from "../../../components/mui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import { messageHelper } from "../../../helpers/MessageHelper";
import * as Yup from "yup";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Paper,
} from "@mui/material";
import { postData } from "../../../apis/apiCalls";
import { SENDEMAIL } from "../../../constants/apiUrls";
import toaster from "../../../helpers/toaster";
import ToasterContainer from "../../../components/ToasterContainer";

function SendEmail() {
    const { t } = useTranslation();
    const validationSchema = Yup.object({
        email: Yup.string()
            .required(t("common.emailisrequired"))
            .email(t("common.emailisrequired")),
        subject: Yup.string().required(),
        message: Yup.string().required(),
    });

    const submit = (value) => {
        postData(SENDEMAIL, value).then((response) => {
            if (response.status) {
                toaster.success(t(response.message));
                reset();
            } else {
                toaster.success(t(response.message));
            }
        });
    };

    const { handleSubmit, reset, control } = useForm({
        defaultValues: messageHelper.defaultEmailValue,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });
    return (
        <Paper elevation={20}>
            <ToasterContainer />
            <Card>
                <form onSubmit={handleSubmit(submit)}>
                    <CardHeader
                        title={t("message.send_email")}
                        subheader={t("message.send_email")}
                    />
                    <CardContent>
                        <FormInputText
                            label={t("common.email")}
                            name="email"
                            control={control}
                        />

                        <FormInputText
                            label={t("common.subject")}
                            name="subject"
                            control={control}
                        />

                        <FormInputText
                            label={t("common.message")}
                            name="message"
                            control={control}
                            multiline={true}
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            color="error"
                            variant="contained"
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
                </form>
            </Card>
        </Paper>
    );
}

export default SendEmail;
