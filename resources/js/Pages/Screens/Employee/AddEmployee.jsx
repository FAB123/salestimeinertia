import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import toaster from "../../../helpers/toaster";

import ToasterContainer from "../../../components/ToasterContainer";
import { postData, getData } from "../../../apis/apiCalls";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { initializeStoreConfig } from "../../../helpers/Configuration";
import Stack from "@mui/material/Stack";
import { PurpleButton, PinkButton } from "../../../Utils/Theming";
import Dialogue from "../../../components/Dialogue";
import { employeeHelper, commonHelper } from "../../../helpers/FormHelper";
import {
    FormInputText,
    FormInputDropdown,
    FormInputSwitch,
} from "../../../components/mui/";

import ProgressLoader from "../../../components/ProgressLoader";
import { employeeValidation } from "../../../helpers/FormTrasilationHelper";
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    List,
    Paper,
    Typography,
} from "@mui/material";
import { SAVEEMPLOYEE } from "../../../constants/apiUrls";
import { router, usePage } from "@inertiajs/react";

import EmployeeListItem from "./EmployeeListItem";
import { permissionItemList } from "../../../constants/constants";
import StorePermission from "./StorePermission";

function AddEmployee() {
    const { t } = useTranslation();

    const { employee_id, employee_data, permissions, stores } = usePage().props;

    const submitRef = useRef();

    const [showDialog, setShowDialog] = useState(false);
    const [info, setInfo] = useState(null);
    const [permission, setPermission] = React.useState(
        employee_id ? permissions : []
    );

    const deleteByValue = (value) => {
        setPermission((oldValues) => {
            return oldValues.filter((item) => item !== value);
        });
    };

    const addByValue = (value) => {
        setPermission((current) => [...current, value]);
    };

    const { handleSubmit, reset, control } = useForm({
        defaultValues: employee_id
            ? { ...employee_data, employee_id }
            : employeeHelper.initialValues,
        resolver: yupResolver(employeeValidation(employee_id)),
        mode: "onBlur",
    });

    // useEffect(() => {
    //     if (employeeId) {
    //         getData(`${GETEMPLOYEEBYID}${employeeId}`).then((response) => {
    //             employeeHelper
    //                 .initialData(employeeId, response.data)
    //                 .then((initialData) => {
    //                     reset(initialData);
    //                 });
    //         });
    //     }
    // }, [employeeId]);

    const [disableSubmit, setDisableSubmit] = useState(false);

    const onSubmit = (values) => {
        setDisableSubmit(true);

        if (!disableSubmit) {
            if (permission.length === 0) {
                toaster.error(t("employee.nopermission"));
                setDisableSubmit(false);
                return false;
            } else {
                postData(SAVEEMPLOYEE, { ...values, permission }).then(
                    (response) => {
                        if (response.error) {
                            toaster.error(t(response.message));
                            setDisableSubmit(false);
                        } else {
                            toaster.success(t(response.message));
                            setShowDialog(true);
                            setInfo(t(response.message));
                            reset(employeeHelper.initialValues);
                            initializeStoreConfig();
                        }
                    }
                );
            }
        }
    };

    // var tabindex = 0;

    return (
        <Stack>
            <Breadcrumb labelHead="Employee" labelSub="Add/Edit Employee" />
            <ToasterContainer />
            <Dialogue
                showDialog={showDialog}
                message="New Employee Created, to list all Employee click List employees else click New Employee for add new employee"
                info={`Info: ${info}`}
                options={[
                    {
                        label: "New Employee",
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                        },
                    },
                    {
                        label: "List Employee",
                        color: "secondary",
                        action: () => {
                            router.get("/employee/view_employee");
                        },
                    },
                ]}
            />
            <ProgressLoader open={disableSubmit} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container>
                    <Grid item md={12}>
                        <Box sx={{ p: 2 }}>
                            <Paper elevation={20}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item md={5} xs={12}>
                                                <Paper
                                                    elevation={10}
                                                    square={true}
                                                >
                                                    <Stack
                                                        alignItems={"center"}
                                                        p={2}
                                                    >
                                                        <Typography>
                                                            {t(
                                                                "employee.manage"
                                                            )}
                                                        </Typography>
                                                    </Stack>
                                                    <Divider />
                                                    <FormInputText
                                                        label={t("common.name")}
                                                        name="name"
                                                        control={control}
                                                    />

                                                    <FormInputText
                                                        label={t(
                                                            "common.email"
                                                        )}
                                                        name="email"
                                                        control={control}
                                                    />

                                                    <FormInputText
                                                        label={t(
                                                            "common.mobile"
                                                        )}
                                                        name="mobile"
                                                        control={control}
                                                    />

                                                    <FormInputText
                                                        label={t(
                                                            "common.address"
                                                        )}
                                                        name="address_line_1"
                                                        control={control}
                                                    />

                                                    <FormInputText
                                                        label={t(
                                                            "employee.username"
                                                        )}
                                                        name="username"
                                                        control={control}
                                                    />

                                                    <FormInputText
                                                        label={t(
                                                            "employee.password"
                                                        )}
                                                        name="password"
                                                        type="password"
                                                        control={control}
                                                    />

                                                    <FormInputText
                                                        label={t(
                                                            "employee.repeatpassword"
                                                        )}
                                                        name="repeat_password"
                                                        type="password"
                                                        control={control}
                                                    />

                                                    <FormInputDropdown
                                                        label={t(
                                                            "common.language"
                                                        )}
                                                        name="lang"
                                                        control={control}
                                                        options={
                                                            commonHelper.languages
                                                        }
                                                    />

                                                    {employee_id && (
                                                        <FormInputSwitch
                                                            label={t(
                                                                "common.active"
                                                            )}
                                                            name="active"
                                                            control={control}
                                                            onText={t(
                                                                "common.enabled"
                                                            )}
                                                            OffText={t(
                                                                "common.disabled"
                                                            )}
                                                        />
                                                    )}

                                                    <FormInputText
                                                        name="comments"
                                                        control={control}
                                                        label={t(
                                                            "items.comments"
                                                        )}
                                                        multiline={true}
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item md={7} xs={12}>
                                                <Stack
                                                    sx={{
                                                        justifyItems: "center",
                                                    }}
                                                >
                                                    <Paper
                                                        sx={{
                                                            overflow: "auto",
                                                            // margin: 2,
                                                        }}
                                                        elevation={15}
                                                    >
                                                        <Stack
                                                            alignItems={
                                                                "center"
                                                            }
                                                            p={2}
                                                        >
                                                            <Typography>
                                                                {t(
                                                                    "employee.list"
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                        <Divider />
                                                        <List dense role="list">
                                                            {permissionItemList.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <EmployeeListItem
                                                                        item={
                                                                            item
                                                                        }
                                                                        permission={
                                                                            permission
                                                                        }
                                                                        deleteByValue={
                                                                            deleteByValue
                                                                        }
                                                                        addByValue={
                                                                            addByValue
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                            <StorePermission
                                                                stores={stores}
                                                                permission={
                                                                    permission
                                                                }
                                                                deleteByValue={
                                                                    deleteByValue
                                                                }
                                                                addByValue={
                                                                    addByValue
                                                                }
                                                            />
                                                        </List>
                                                    </Paper>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <Stack
                                    spacing={2}
                                    sx={{ p: 3 }}
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <PinkButton
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            if (window.confirm("Are you Sure?"))
                                                reset();
                                            return;
                                        }}
                                    >
                                        Clear
                                    </PinkButton>
                                    <PurpleButton
                                        variant="contained"
                                        onClick={handleSubmit(onSubmit)}
                                        ref={submitRef}
                                    >
                                        Send
                                    </PurpleButton>
                                </Stack>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

export default AddEmployee;
