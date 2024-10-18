import React from "react";
import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../../../Utils/Theming";
import { useTranslation } from "react-i18next";
import { FormInputText, FormInputDropdown } from "../../../../components/mui/";
import { Box, Grid, Paper } from "@mui/material";
import { accountsNatures } from "../../../../constants/constants";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AccountDescription from "./AccountDescription";

function NewContra() {
    const { t } = useTranslation();

    const initialValues = {
        // account_name: "",
        // nature: "income",
        // type: "",
        // comments: "",
        createdDate: new Date(),
    };

    const validationSchema = Yup.object({
        account_name: Yup.string().required(t("accounts.accountname_requierd")),
        // type: Yup.string().required(t("accounts.type_is_required")),
        comments: Yup.string(),
    });

    const { handleSubmit, reset, control, watch } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    return (
        <Grid container>
            <Grid item md={12}>
                <Paper sx={{ p: 1 }}>
                    <Grid container>
                        <Grid item md={6}>
                            <Paper elevation="24" sx={{ p: 2 }}>
                                <FormInputText
                                    label={t("accounts.account_name")}
                                    name="account_name"
                                    autoFocus={true}
                                    control={control}
                                    // tabIndex={tabindex++}
                                    type="text"
                                    //   inputRef={nameRef}
                                    //   onKeyDown={(event) => {
                                    //     _handleEnter(event, emailRef);
                                    //   }}
                                    //   onChange={formik.handleChange}
                                    //   onBlur={formik.handleBlur}
                                    //   value={formik.values.name}
                                />
                                <FormInputDropdown
                                    label="Nature"
                                    name="nature"
                                    control={control}
                                    options={accountsNatures}
                                    //   onChange={formik.setFieldValue}
                                    //   onBlur={formik.handleBlur}
                                    //   value={formik.values.language}
                                />

                                <FormInputDropdown
                                    label="Type"
                                    name="type"
                                    control={control}
                                    options={accountsNatures}
                                    //   onChange={formik.setFieldValue}
                                    //   onBlur={formik.handleBlur}
                                    //   value={formik.values.language}
                                />

                                <FormInputText
                                    label={t("common.comments")}
                                    name="comments"
                                    id="comments"
                                    type="text"
                                    control={control}
                                    textarea={true}
                                    //   inputRef={commentsRef}
                                    //   onKeyDown={(event) => {
                                    //     _handleEnter(event, submitRef);
                                    //   }}
                                    //   tabIndex={tabindex++}
                                    //   textarea={true}
                                    //   onChange={formik.handleChange}
                                    //   onBlur={formik.handleBlur}
                                    //   value={formik.values.comments}
                                />
                                <Stack
                                    spacing={2}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <PinkButton
                                        variant="outlined"
                                        color="error"
                                    >
                                        {t("common.clear")}
                                    </PinkButton>
                                    <PurpleButton variant="contained">
                                        {t("common.send")}
                                    </PurpleButton>
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item md={6}>
                            <AccountDescription
                                title={t("accounts.account_contra_voucher")}
                                description={t(
                                    "accounts.account_journal_voucher_desc"
                                )}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default NewContra;
