import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../../../Utils/Theming";
import { useTranslation } from "react-i18next";
import { FormInputText, FormInputDropdown } from "../../../../components/mui/";
import { getData, postData } from "../../../../apis/apiCalls";
import toaster from "../../../../helpers/toaster";
import { useForm } from "react-hook-form";
import {
    accountsNatures,
    accountCodeList,
    accountsTypes,
} from "../../../../constants/constants";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AccountDescription from "./AccountDescription";
import {
    NEWACCOUNTHEAD,
    VALIDATEACCOUNTHEAD,
} from "../../../../constants/apiUrls";
import {
    TableBody,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Box,
    Paper,
} from "@mui/material";
import { useEffect } from "react";

function AccountHead() {
    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(false);

    const initialValues = {
        account_name: "",
        account_name_ar: "",
        account_code: "",
        nature: 1,
        type: 1,
        comments: "",
    };

    const validationSchema = Yup.object({
        account_name: Yup.string().required(t("accounts.accountname_requierd")),
        account_name_ar: Yup.string(),
        nature: Yup.string().required(t("accounts.type_is_required")),
        type: Yup.string(),
        account_code: Yup.number()
            .required(t("accounts.code_is_required"))
            .test(
                "validateaccountcode",
                t("accounts.account_code_is_not_valid"),
                function (value) {
                    return new Promise((resolve, reject) => {
                        if (value) {
                            var base_type = watch("type");
                            var numToString = String(value);
                            if (numToString.length > 1) {
                                var first_number = Number(
                                    numToString.charAt(0)
                                );
                                if (base_type === first_number) {
                                    getData(
                                        `${VALIDATEACCOUNTHEAD}${value}`
                                    ).then((data) => {
                                        if (data.status) {
                                            resolve(true);
                                        } else {
                                            resolve(false);
                                        }
                                    });
                                } else {
                                    resolve(false);
                                }
                            } else {
                                resolve(false);
                            }
                        } else {
                            resolve(false);
                        }
                    });
                }
            ),
        comments: Yup.string(),
    });

    const { handleSubmit, reset, control, watch } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    });

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(NEWACCOUNTHEAD, values).then((response) => {
                if (response.status) {
                    toaster.success(t("accounts.create_head_success"));
                    reset();
                    setTimeout(() => {
                        setDisableSubmit(false);
                    }, 1000);
                } else {
                    toaster.error(t("accounts.create_head_failed"));
                }
            });
        }
    };

    let tabindex = 0;
    return (
        <Grid container>
            <Grid item md={12}>
                <Paper sx={{ p: 1 }}>
                    <Grid container>
                        <Grid item md={6}>
                            <Paper elevation="24" sx={{ p: 2 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <FormInputText
                                        autoFocus={true}
                                        control={control}
                                        label={t("accounts.account_name")}
                                        name="account_name"
                                    />
                                    <FormInputText
                                        control={control}
                                        label={t("accounts.account_name_ar")}
                                        name="account_name_ar"
                                    />

                                    <FormInputDropdown
                                        label={t("accounts.account_type")}
                                        name="nature"
                                        control={control}
                                        options={accountsNatures}
                                    />

                                    <FormInputDropdown
                                        label={t("accounts.account_type")}
                                        name="type"
                                        control={control}
                                        options={accountsTypes[watch("nature")]}
                                    />

                                    <FormInputText
                                        control={control}
                                        label={t("accounts.account_code")}
                                        name="account_code"
                                    />

                                    <FormInputText
                                        tabIndex={tabindex++}
                                        control={control}
                                        multiline={true}
                                        label={t("common.comments")}
                                        name="comments"
                                    />
                                    <Stack
                                        spacing={2}
                                        sx={{ p: 1 }}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <PinkButton
                                            variant="outlined"
                                            color="error"
                                            onClick={() => reset()}
                                        >
                                            {t("common.clear")}
                                        </PinkButton>
                                        <PurpleButton
                                            variant="contained"
                                            type="sumbit"
                                        >
                                            {t("common.send")}
                                        </PurpleButton>
                                    </Stack>
                                </form>
                            </Paper>
                        </Grid>

                        <Grid item md={6}>
                            <AccountDescription
                                title="Account Head"
                                description="Head of an account means the category under which an account falls. All the related transactions are grouped under the particular head. For example, all the cash transactions are grouped under the head of the Cash A/c and is written on the top of the account. This Option can Allow create new account header to enlarge your accounting system."
                            />
                            <Paper elevation="24" sx={{ mt: 2, ml: 1 }}>
                                <TableContainer>
                                    <Table size="small" aria-label="infotable">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    {t("accounts.account_type")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {t("accounts.account_code")}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {accountCodeList.map(
                                                (codeList, index) => {
                                                    return (
                                                        <TableRow
                                                            key={index}
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
                                                                {t(
                                                                    codeList.label
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {codeList.value}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default AccountHead;
