import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Grid,
    Typography,
    Button,
    Divider,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { activateTransilationHelper } from "../../../helpers/FormTrasilationHelper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import ToasterContainer from "../../../components/ToasterContainer";
import { FormInputText } from "../../../components/mui";
import { postData } from "../../../apis/apiCalls";
import toaster from "../../../helpers/toaster";

const initialValues = {
    activation_key: "",
};
function ActivationForm({ type }) {
    const { flash, activation_code, validate } = usePage().props;
    const [disableSubmit, setDisableSubmit] = useState(null);
    const [appStatus, setAppStatus] = useState(validate);

    const { t } = useTranslation();

    const { handleSubmit, control } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(activateTransilationHelper),
        mode: "onBlur",
    });

    const onSubmit = (values, { resetForm }) => {
        if (type === "api") {
            setDisableSubmit(true);
            if (!disableSubmit) {
                postData("/activate-api", values)
                    .then((response) => {
                        response.status && setAppStatus("Activated");
                        response.status
                            ? toaster.success(
                                  t("configuration.activation_success")
                              )
                            : toaster.error(
                                  t("configuration.activation_error")
                              );
                    })
                    .finally(() => setDisableSubmit(false));
            }
        } else {
            router.post("/activate", values);
        }
    };

    return (
        <Grid align="center">
            <ToasterContainer />
            {appStatus === "Activated" ? (
                <Typography>{appStatus}</Typography>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  
                    <TextField
                        label="Activation Code"
                        variant="outlined"
                        sx={{ p: 1 }}
                        size="small"
                        fullWidth={true}
                        value={activation_code}
                        contentEditable={false}
                        disabled={true}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                activation_code
                                            )
                                        }
                                        edge="end"
                                    >
                                        <ContentCopyIcon
                                            fontSize="small"
                                            color="secondary"
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormInputText
                        label={t("common.activation_key")}
                        name="activation_key"
                        type="activation_key"
                        size="small"
                        control={control}
                    />

                    <Typography color="error" sx={{ m: 3 }}>
                        {flash.message}
                    </Typography>

                    <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        fullWidth
                    >
                        {t("common.activate")}
                    </Button>
                </form>
            )}
        </Grid>
    );
}

export default ActivationForm;
