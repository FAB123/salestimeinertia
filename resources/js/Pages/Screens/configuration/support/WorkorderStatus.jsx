import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../../apis/apiCalls";

import Stack from "@mui/material/Stack";

import IconButton from "@mui/material/IconButton";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toaster from "../../../../helpers/toaster";
import { FormInputText, FormMultiInput } from "../../../../components/mui";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    unitHelper,
    workorderStatusHelper,
} from "../../../../helpers/FormHelper";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import ToasterContainer from "../../../../components/ToasterContainer";
import SendIcon from "@mui/icons-material/Send";
import {
    DELETEWORKORDERSTATUSBYID,
    GETALLWORKORDERSTATUS,
    GETWORKORDERSTATUSBYID,
    SAVEWORKORDERSTATUS,
} from "../../../../constants/apiUrls";

function WorkorderStatus() {
    const [workorderStatus, setWorkorderStatus] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const { t } = useTranslation();

    const validationSchema = Yup.object({
        status_name_en: Yup.string().required("Status name Filed is Requierd"),
        status_name_ar: Yup.string(),
        whatsapp_message: Yup.string(),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: workorderStatusHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        getData(GETALLWORKORDERSTATUS).then((result) => {
            if (result.status) {
                setWorkorderStatus(result.data);
            }
        });
    }, []);

    const editWorkorer = (id) => {
        getData(`${GETWORKORDERSTATUSBYID}${id}`).then((result) => {
            if (result.status) {
                let response = result.data;
                let data = {
                    id: response.id || null,
                    status_name_en: response.status_name_en || "",
                    status_name_ar: response.status_name_ar || "",
                    whatsapp_message: response.whatsapp_message || "",
                };
                reset(data);
                setShowEdit(true);
            }
        });
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVEWORKORDERSTATUS, values).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message));
                } else {
                    setShowEdit(false);
                    toaster.success(t(response.message));
                    setWorkorderStatus(response.status);
                }
                setDisableSubmit(false);
            });
        }
    };

    const deleteWorkOrderStatus = (status_id) => {
        if (window.confirm("Are You sure to delete Workorder?")) {
            getData(`${DELETEWORKORDERSTATUSBYID}${status_id}`).then(
                (result) => {
                    if (result.status) {
                        toaster.success(t(result.message));
                        setWorkorderStatus(result.data);
                    } else {
                        toaster.error(t(result.message));
                    }
                }
            );
        }
    };

    return (
        <Stack direction={"row"} m={1}>
            <ToasterContainer />
            <Grid container spacing={1}>
                <Grid item md={5} xs={12}>
                    <Paper elevation={20}>
                        <Card>
                            <CardHeader
                                // title={t("configuration.workorder_list")}
                                subheader={t("configuration.workorder_list")}
                            />
                            <Divider />

                            <CardContent>
                                <List
                                    sx={{
                                        width: "100%",
                                        //maxWidth: 360,
                                        bgcolor: "background.paper",
                                    }}
                                >
                                    {workorderStatus.map((status, key) => {
                                        const labelId = `checkbox-list-label-${key}`;
                                        return (
                                            <ListItem
                                                key={key}
                                                secondaryAction={
                                                    <>
                                                        <IconButton
                                                            edge="end"
                                                            color="info"
                                                            aria-label="edit"
                                                            sx={{
                                                                m: 0.2,
                                                            }}
                                                            onClick={() => {
                                                                editWorkorer(
                                                                    status.id
                                                                );
                                                            }}
                                                        >
                                                            <ConstructionIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            aria-label="delete"
                                                            disabled={
                                                                status.editable
                                                            }
                                                            onClick={() => {
                                                                deleteWorkOrderStatus(
                                                                    status.id
                                                                );
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </>
                                                }
                                                disablePadding
                                            >
                                                <ListItemText
                                                    id={labelId}
                                                    primary={
                                                        status.status_name_en
                                                    }
                                                    secondary={
                                                        <Typography
                                                            sx={{
                                                                display:
                                                                    "inline",
                                                            }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.light"
                                                        >
                                                            {
                                                                status.status_name_ar
                                                            }
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    spacing={0}
                                    margin={1}
                                    alignItems="baseline"
                                >
                                    <IconButton
                                        color="info"
                                        sx={{ p: "10px" }}
                                        aria-label="directions"
                                        onClick={() => {
                                            reset(
                                                workorderStatusHelper.initialValues
                                            );
                                            setShowEdit(true);
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                {showEdit && (
                    <Grid item md={7} xs={12}>
                        <Paper elevation={20}>
                            <Card>
                                <CardHeader
                                    // title={t(
                                    //     "configuration.workorder_configuration"
                                    // )}
                                    subheader={t(
                                        "configuration.workorder_configuration"
                                    )}
                                />
                                <Divider />

                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormMultiInput
                                            label={t(
                                                "configuration.status_name"
                                            )}
                                            control={control}
                                            name="status_name_en"
                                            name2="status_name_ar"
                                        />

                                        <FormInputText
                                            label={t(
                                                "configuration.whatsapp_delivery_template"
                                            )}
                                            name="whatsapp_message"
                                            control={control}
                                            multiline={true}
                                            rows={2}
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
                                                    if (
                                                        window.confirm(
                                                            "Are you Sure?"
                                                        )
                                                    )
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
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Stack>
    );
}

export default WorkorderStatus;
