import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../../../Utils/Theming";
import { useTranslation } from "react-i18next";
import { accountHolderType } from "../../../../constants/constants";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import {
    FormInputText,
    FormInputDropdown,
    FormInputSearch,
} from "../../../../components/mui/";

import { getData, postData } from "../../../../apis/apiCalls";
import {
    GETALLACCOUNTPAYMENTHEADS,
    GETALLCUSTOMERSLIST,
    GETALLSUPPLIERSLIST,
    SAVEVOUCHERDATA,
} from "../../../../constants/apiUrls";
import Oneside from "./table/Oneside";

import { FormLabel } from "@mui/material";
import ProgressLoader from "../../../../components/ProgressLoader";
import toaster from "../../../../helpers/toaster";
import ToasterContainer from "../../../../components/ToasterContainer";

function PaymentForm({ formType }) {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const initialValues = {
        account_holder_type: "C",
        account_holder: "",
        accountList: [{ account_id: null, amount: 0 }],
        comments: "",
    };

    const validationSchema = Yup.object({
        account_holder_type: Yup.string().required(),
        account_holder: Yup.object().required(
            t("accounts.accountname_requierd")
        ),
        accountList: Yup.array()
            .of(
                Yup.object().shape({
                    account_id: Yup.string().required(
                        t("accounts.account_type")
                    ),
                    amount: Yup.number()
                        .required("errorText.name")
                        .test(
                            "min",
                            t("accounts.minimum_amount_not_valid"),
                            function (value) {
                                return value > 0;
                            }
                        ),
                })
            )
            .min(1, t("accounts.account_length_not_valid")),
        comments: Yup.string().required(t("common.desc_required")),
    });

    const {
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const onSubmit = (values) => {
        setDisableSubmit(true);
        let data = {
            transaction_type: formType,
            account_list: values.accountList,
            account_holder: values.account_holder.account_id,
            account_holder_type: values.account_holder_type,
            comments: values.comments,
        };
        postData(SAVEVOUCHERDATA, data).then((response) => {
            if (response.status) {
                toaster.success(t(response.message));
                setDisableSubmit(false);
                reset();
            } else {
                let message = t(response.message);
                toaster.error(`${message} INFO: ${response.info}`);
            }
        });
    };

    useEffect(() => {
        setValue("account_holder", "");
        switch (watch("account_holder_type")) {
            case "C":
                getData(GETALLCUSTOMERSLIST).then((data) => {
                    setUsers(data.data);
                });
                break;
            // case "E":
            //   getData(GETALLEMPLOYEESLIST).then((data) => {
            //     setUsers(data.data);
            //   });
            //   break;
            case "S":
                getData(GETALLSUPPLIERSLIST).then((data) => {
                    setUsers(data.data);
                });
                break;
            default:
                break;
        }
    }, [watch("account_holder_type")]);

    useEffect(() => {
        //get payment method
        getData(GETALLACCOUNTPAYMENTHEADS).then((result) => {
            console.log(result.data);
            if (result.data.result !== null) setOptions(result.data);
        });
    }, []);
    return (
        <div className="tile-body">
            <ProgressLoader open={disableSubmit} />
            <ToasterContainer />
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInputDropdown
                    label={t("accounts.account_holder_type")}
                    name="account_holder_type"
                    control={control}
                    options={accountHolderType}
                />

                <FormInputSearch
                    name="account_holder"
                    label={t("accounts.account_holder")}
                    control={control}
                    options={users}
                />

                {errors.accountList && (
                    <FormLabel error sx={{ pl: 3 }}>
                        {errors.accountList.message}
                    </FormLabel>
                )}

                <Oneside
                    name="accountList"
                    control={control}
                    options={options}
                />

                <FormInputText
                    label={t("common.comments")}
                    name="comments"
                    control={control}
                    multiline={true}
                />

                <div className="tile-footer">
                    <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                        m={1}
                    ></Stack>
                    <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <PinkButton variant="outlined" color="error">
                            {t("common.clear")}
                        </PinkButton>
                        <PurpleButton type="submit" variant="contained">
                            {t("common.send")}
                        </PurpleButton>
                    </Stack>
                </div>
            </form>
        </div>
    );
}

export default PaymentForm;
