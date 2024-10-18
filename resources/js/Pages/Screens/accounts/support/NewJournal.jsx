import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { PinkButton, PurpleButton } from "../../../../Utils/Theming";
import { useTranslation } from "react-i18next";
import { journalHolderType } from "../../../../constants/constants";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";

import {
  FormInputText,
  FormInputDropdown,
  FormInputSearch,
} from "../../../../components/mui";

import { getData, postData } from "../../../../apis/apiCalls";
import {
  ALLACCOUNTHEADS,
  GETALLCUSTOMERSLIST,
  GETALLEMPLOYEESLIST,
  GETALLSUPPLIERSLIST,
  SAVEVOUCHERDATA,
} from "../../../../constants/apiUrls";

import { accountHeadList } from "../../../../helpers/GeneralHelper";

import AccountDescription from "./AccountDescription";
import Twoside from "./table/Twoside";
import ProgressLoader from "../../../../components/ProgressLoader";
import { Box, Grid, Paper } from "@mui/material";
import toaster from "../../../../helpers/toaster";
import ToasterContainer from "../../../../components/ToasterContainer";

function NewJournal() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [submitStatus, setSubmitStatus] = useState(true);

  const initialValues = {
    account_holder_type: "C",
    account_holder: "",
    accountList: [{ account_id: null, type: "C", amount: 0 }],
    comments: "",
  };

  const validationSchema = Yup.object({
    account_holder_type: Yup.string().required(),
    account_holder: Yup.object().required(t("accounts.accountname_requierd")),
    accountList: Yup.array()
      .of(
        Yup.object().shape({
          account_id: Yup.string().required(t("accounts.account_type")),
          type: Yup.string().required("errorText.name"),
          amount: Yup.number().required("errorText.name"),
        })
      )
      .min(2, t("accounts.account_length_not_valid")),
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
    console.log("test");
    setDisableSubmit(true);
    let data = {
      transaction_type: "TJ",
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

  const account_holder_type = watch("account_holder_type");

  useEffect(() => {
    setValue("account_holder", "");
    switch (account_holder_type) {
      case "C":
        getData(GETALLCUSTOMERSLIST).then((data) => {
          setUsers(data.data);
        });
        break;
      case "E":
        getData(GETALLEMPLOYEESLIST).then((data) => {
          setUsers(data.data);
        });
        break;
      case "S":
        getData(GETALLSUPPLIERSLIST).then((data) => {
          setUsers(data.data);
        });
        break;
      default:
        getData(GETALLCUSTOMERSLIST).then((data) => {
          setUsers(data.data);
        });
    }
  }, [account_holder_type]);

  useEffect(() => {
    getData(ALLACCOUNTHEADS).then((data) => {
      accountHeadList(data.data).then((response) => {
        setOptions(response);
      });
    });
  }, []);

  const calcTotal = useWatch({
    control,
    name: "accountList",
  });

  useEffect(() => {
    var totalDebit = 0;
    var totalCredit = 0;
    calcTotal.map((item) => {
      if (item.type === "C") {
        totalCredit = totalCredit + parseFloat(item.amount);
        return true;
      } else {
        totalDebit = totalDebit + parseFloat(item.amount);
        return true;
      }
    });

    if (totalCredit === 0 && totalDebit === 0) {
      setSubmitStatus(true);
    } else {
      if (totalCredit - totalDebit === 0) {
        setSubmitStatus(false);
      } else {
        setSubmitStatus(true);
      }
    }
  }, [calcTotal]);

  return (
    <Grid container>
      <Grid item md={12}>
          <Paper sx={{ p: 1 }}>
            <Grid container>
              <Grid item md={6}>
                <ToasterContainer />
                <Paper elevation={24} sx={{ p: 2 }}>
                  <ProgressLoader open={disableSubmit} />
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormInputDropdown
                      label={t("accounts.account_holder_type")}
                      name="account_holder_type"
                      control={control}
                      options={journalHolderType}
                    />

                    <FormInputSearch
                      name="account_holder"
                      label={t("accounts.account_holder")}
                      control={control}
                      options={users}
                    />

                    <Twoside
                      name="accountList"
                      label={t("accounts.account_holder")}
                      control={control}
                      options={options}
                      errors={errors}
                    />

                    <FormInputText
                      label={t("common.comments")}
                      name="comments"
                      control={control}
                      multiline={true}
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
                      <PurpleButton type="submit" variant="contained">
                        {t("common.send")}
                      </PurpleButton>
                    </Stack>
                  </form>
                </Paper>
              </Grid>
              <Grid item md={6}>
                <AccountDescription
                  title={t("accounts.account_journal_voucher")}
                  description={t("accounts.account_journal_voucher_desc")}
                />
              </Grid>
            </Grid>
          </Paper>
      </Grid>
    </Grid>
  );
}

export default NewJournal;
