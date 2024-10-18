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
import { unitHelper } from "../../../../helpers/FormHelper";

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
    DELETEUNITBYID,
    GETALLUNITS,
    GETUNITBYID,
    SAVEUNIT,
} from "../../../../constants/apiUrls";

function UnitConfig() {
    const [allUnits, setAllUnits] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const { t } = useTranslation();

    const validationSchema = Yup.object({
        unit_name_en: Yup.string().required("Table name Filed is Requierd"),
        unit_name_ar: Yup.string(),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: unitHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        getData(GETALLUNITS).then((result) => {
            if (result.data.result !== null) setAllUnits(result.data);
        });
    }, []);

    const editUnit = (unit_id) => {
        getData(`${GETUNITBYID}${unit_id}`).then((result) => {
            let response = result.data;
            let data = {
                unit_id: response.unit_id || null,
                unit_name_en: response.unit_name_en || "",
                unit_name_ar: response.unit_name_ar || "",
            };
            reset(data);
            setShowEdit(true);
        });
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVEUNIT, values).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message));
                } else {
                    setShowEdit(false);
                    toaster.success(t(response.message));
                    setAllUnits(response.stores);
                }
                setDisableSubmit(false);
            });
        }
    };

    const deleteUnit = (unit_id) => {
        if (window.confirm("Are You sure to delete Table?")) {
            getData(`${DELETEUNITBYID}${unit_id}`).then((result) => {
                if (result.status) {
                    toaster.success(t(result.message));
                    setAllUnits(result.stores);
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
                                // title={t("configuration.unit_list")}
                                subheader={t("configuration.unit_list")}
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
                                    {allUnits.length > 0 &&
                                        allUnits.map((unit, key) => {
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
                                                                    editUnit(
                                                                        unit.unit_id
                                                                    );
                                                                }}
                                                            >
                                                                <ConstructionIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                aria-label="delete"
                                                                onClick={() => {
                                                                    deleteUnit(
                                                                        unit.unit_id
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
                                                            unit.unit_name_en
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
                                                                    unit.unit_name_en
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
                                            reset(unitHelper.initialValues);
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
                                    //     "configuration.unit_configuration"
                                    // )}
                                    subheader={t(
                                        "configuration.unit_configuration"
                                    )}
                                />
                                <Divider />
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormMultiInput
                                            label={t("configuration.unit_name")}
                                            control={control}
                                            name="unit_name_en"
                                            name2="unit_name_ar"
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

export default UnitConfig;
