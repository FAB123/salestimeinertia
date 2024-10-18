import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../../apis/apiCalls";

import Stack from "@mui/material/Stack";

import IconButton from "@mui/material/IconButton";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toaster from "../../../../helpers/toaster";
import { FormMultiInput } from "../../../../components/mui";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeHelper, tableHelper } from "../../../../helpers/FormHelper";

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
    DELETETABLEBYID,
    GETALLTABLES,
    GETTABLEBYID,
    SAVETABLE,
} from "../../../../constants/apiUrls";

function TableConfig() {
    const [allTables, setAllTables] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const { t } = useTranslation();

    const validationSchema = Yup.object({
        table_name_en: Yup.string().required("Table name Filed is Requierd"),
        table_name_ar: Yup.string(),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: tableHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        getData(GETALLTABLES).then((response) => {
            if (response.data !== null) setAllTables(response.data);
        });
    }, []);

    const editStores = (table_id) => {
        getData(`${GETTABLEBYID}${table_id}`).then((result) => {
            let response = result.data;
            let data = {
                table_id: response.table_id || null,
                table_name_en: response.table_name_en || "",
                table_name_ar: response.table_name_ar || "",
            };
            reset(data);
            setShowEdit(true);
        });
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVETABLE, values).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message));
                } else {
                    setShowEdit(false);
                    toaster.success(t(response.message));
                    setAllTables(response.stores);
                }
                setDisableSubmit(false);
            });
        }
    };

    const deleteStores = (table_id) => {
        if (window.confirm("Are You sure to delete Table?")) {
            getData(`${DELETETABLEBYID}${table_id}`).then((result) => {
                if (result.status) {
                    toaster.success(t(result.message));
                    setAllTables(result.stores);
                } else {
                    toaster.error(t(result.message));
                }
            });
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
                                // title={t("configuration.table_list")}
                                subheader={t("configuration.table_list")}
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
                                    {allTables.length > 0 &&
                                        allTables.map((table, key) => {
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
                                                                    editStores(
                                                                        table.table_id
                                                                    );
                                                                }}
                                                            >
                                                                <ConstructionIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                aria-label="delete"
                                                                onClick={() => {
                                                                    deleteStores(
                                                                        table.table_id
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
                                                            table.table_name_en
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
                                                                    table.table_name_ar
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
                                            reset(storeHelper.initialValues);
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
                                    //     "configuration.table_configuration"
                                    // )}
                                    subheader={t(
                                        "configuration.table_configuration"
                                    )}
                                />
                                <Divider/>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormMultiInput
                                            label={t("common.table_name")}
                                            control={control}
                                            name="table_name_en"
                                            name2="table_name_ar"
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

export default TableConfig;
