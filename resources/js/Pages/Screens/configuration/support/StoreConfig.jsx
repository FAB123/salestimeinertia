import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../../apis/apiCalls";

import Stack from "@mui/material/Stack";

import IconButton from "@mui/material/IconButton";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import toaster from "../../../../helpers/toaster";
import {
    FormInputText,
    FormMultiInput,
    FormTextMultiInput,
} from "../../../../components/mui";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeHelper } from "../../../../helpers/FormHelper";

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
    DELETESTOREBYID,
    GETALLSTORES,
    GETSTOREBYID,
    SAVESTORE,
} from "../../../../constants/apiUrls";

function StoreConfig() {
    const [allStores, setAllStores] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const { t } = useTranslation();

    const validationSchema = Yup.object({
        location_name_en: Yup.string().required(
            t("configuration.location_name_en")
        ),
        location_name_ar: Yup.string().required(
            t("configuration.location_name_ar")
        ),
        location_address_en: Yup.string().required(
            t("configuration.location_address_en")
        ),
        location_address_ar: Yup.string().required(
            t("configuration.location_address_ar")
        ),
        location_mobile: Yup.string().required(
            t("configuration.location_mobile")
        ),
        location_email: Yup.string()
            .email("Invalid email address")
            .required(t("configuration.location_email")),
        location_building_no: Yup.string().required(
            t("configuration.location_building_no")
        ),
        location_street_name_en: Yup.string().required(
            t("configuration.location_street_name_en")
        ),
        location_street_name_ar: Yup.string().required(
            t("configuration.location_street_name_ar")
        ),
        location_district_en: Yup.string().required(
            t("configuration.location_district_en")
        ),
        location_district_ar: Yup.string().required(
            t("configuration.location_district_ar")
        ),
        location_city_en: Yup.string().required(
            t("configuration.location_city_en")
        ),
        location_city_ar: Yup.string().required(
            t("configuration.location_city_ar")
        ),
        location_country_en: Yup.string().required(
            t("configuration.location_country_en")
        ),
        location_country_ar: Yup.string().required(
            t("configuration.location_country_ar")
        ),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: storeHelper.initialValues,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        getData(GETALLSTORES).then((result) => {
            if (result.data.result !== null) setAllStores(result.data);
        });
    }, []);

    const editStores = (location_id) => {
        getData(`${GETSTOREBYID}${location_id}`).then((result) => {
            let response = result.data;
            let data = {
                location_id: response.location_id || null,
                location_name_en: response.location_name_en || "",
                location_name_ar: response.location_name_ar || "",
                location_address_en: response.location_address_en || "",
                location_address_ar: response.location_address_ar || "",
                location_mobile: response.location_mobile || "",
                location_email: response.location_email || "",
                location_building_no: response.location_building_no || "",
                location_street_name_en: response.location_street_name_en || "",
                location_street_name_ar: response.location_street_name_ar || "",
                location_district_en: response.location_district_en || "",
                location_district_ar: response.location_district_ar || "",
                location_city_en: response.location_city_en || "",
                location_city_ar: response.location_city_ar || "",
                location_country_en: response.location_country_en || "",
                location_country_ar: response.location_country_ar || "",
            };
            reset(data);
            setShowEdit(true);
        });
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            postData(SAVESTORE, values).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message));
                } else {
                    setShowEdit(false);
                    toaster.success(t(response.message));
                    setAllStores(response.stores);
                }
                setDisableSubmit(false);
            });
        }
    };

    const deleteStores = (location_id) => {
        if (window.confirm("Are You sure to delete Store?")) {
            getData(`${DELETESTOREBYID}${location_id}`).then((result) => {
                if (result.status) {
                    toaster.success(t(result.message));
                    setAllStores(result.stores);
                } else {
                    toaster.error(t(result.message));
                }
            });
        }
    };

    return (
        <Stack direction={"row"} sx={{ m: 1 }}>
            <ToasterContainer />
            <Grid container spacing={1}>
                <Grid item md={5} xs={12}>
                    <Paper elevation={20}>
                        <Card>
                            <CardHeader
                                // title={t("configuration.branch_list")}
                                subheader={t("configuration.branch_list")}
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
                                    {allStores.length > 0 &&
                                        allStores.map((store, key) => {
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
                                                                        store.location_id
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
                                                                        store.location_id
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
                                                            store.location_name_en
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
                                                                    store.location_name_ar
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
                                    //     "configuration.branch_configuration"
                                    // )}
                                    subheader={t(
                                        "configuration.branch_configuration"
                                    )}
                                />
                                <Divider />
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormMultiInput
                                            label={t("common.stores")}
                                            control={control}
                                            name="location_name_en"
                                            name2="location_name_ar"
                                        />

                                        <FormMultiInput
                                            label={t(
                                                "configuration.branch_address"
                                            )}
                                            control={control}
                                            multiline={true}
                                            name="location_address_en"
                                            name2="location_address_ar"
                                        />

                                        <FormInputText
                                            label={t("common.building_number")}
                                            control={control}
                                            name="location_building_no"
                                        />

                                        <FormMultiInput
                                            label={t("common.street_name")}
                                            control={control}
                                            name="location_street_name_en"
                                            name2="location_street_name_ar"
                                        />

                                        <FormMultiInput
                                            label={t("common.city")}
                                            control={control}
                                            name="location_city_en"
                                            name2="location_city_ar"
                                        />

                                        <FormMultiInput
                                            label={t("common.district")}
                                            control={control}
                                            name="location_district_en"
                                            name2="location_district_ar"
                                        />

                                        <FormMultiInput
                                            label={t("common.country")}
                                            control={control}
                                            name="location_country_en"
                                            name2="location_country_ar"
                                        />

                                        <FormTextMultiInput
                                            label={t("common.tel")}
                                            label2={t("common.email")}
                                            multiline={false}
                                            control={control}
                                            name="location_mobile"
                                            name2="location_email"
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

export default StoreConfig;
