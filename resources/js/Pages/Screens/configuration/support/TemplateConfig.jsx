import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ConstructionIcon from "@mui/icons-material/Construction";
import DeleteIcon from "@mui/icons-material/Delete";

import { useTranslation } from "react-i18next";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import ToasterContainer from "../../../../components/ToasterContainer";
import SendIcon from "@mui/icons-material/Send";
import {
    REMOVECOMPANYLOGO,
    SAVECOMPANYLOGO,
    SAVEINVOICETEMPLATE,
} from "../../../../constants/apiUrls";
import { getData, postData } from "../../../../apis/apiCalls";
import ProgressLoader from "../../../../components/ProgressLoader";
import toaster from "../../../../helpers/toaster";
import FileUpload from "../../../../components/FileUpload";
import { itemHelper } from "../../../../helpers/FormHelper";
import { usePage } from "@inertiajs/react";

function TemplateConfig() {
    const { invoiceTemplate, companyLogo } = usePage().props;
    const [editTemplate, setEditTemplate] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [show, setShow] = useState(false);
    const [cropData, setCropData] = useState(null);
    const [checkImageEdited, setcheckImageEdited] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        setCropData(`data:image/png;base64,${companyLogo}`);
        // getData(GETCOMPANYLOGO).then((response) => {
        //     console.log(response);
        //     if (!response.error) {
        //         if (response.logo !== null) {
        //             setCropData(response.logo);
        //         }
        //     }
        // });
    }, [editTemplate]);

    const uploadLogo = () => {
        setDisableSubmit(true);
        if (checkImageEdited) {
            const formData = new FormData();
            formData.append("img", itemHelper.dataURLtoFile(cropData));
            postData(SAVECOMPANYLOGO, formData).then((response) => {
                if (response.error) {
                    toaster.error(response.message);
                } else {
                    toaster.success(response.message);
                }
                console.log(response);
            });
        } else {
            toaster.warning("configuration.no_image");
        }
        setDisableSubmit(false);
    };

    const removeLogo = () => {
        setDisableSubmit(true);
        getData(REMOVECOMPANYLOGO).then((response) => {
            if (response.error) {
                toaster.error(response.message);
            } else {
                toaster.success(response.message);
            }
        });
        setDisableSubmit(false);
    };
    const saveTemplate = () => {
        setDisableSubmit(true);
        postData(SAVEINVOICETEMPLATE, editTemplate).then((response) => {
            if (response.error) {
                toaster.error(t(response.message));
            } else {
                toaster.success(t(response.message));
                setEditTemplate(false);
            }
        });
        setDisableSubmit(false);
    };

    return (
        <Stack direction="row" m={1}>
            <ToasterContainer />
            <ProgressLoader open={disableSubmit} />
            <Grid container spacing={1}>
                <Grid item md={5} xs={12}>
                    <Paper elevation={20}>
                        <Card>
                            <CardHeader
                                // title={t("configuration.template_list")}
                                subheader={t("configuration.template_list")}
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
                                    {invoiceTemplate.length > 0 &&
                                        invoiceTemplate.map((template, key) => {
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
                                                                    setEditTemplate(
                                                                        template
                                                                    );
                                                                }}
                                                            >
                                                                <ConstructionIcon />
                                                            </IconButton>
                                                        </>
                                                    }
                                                    disablePadding
                                                >
                                                    <ListItemText
                                                        id={labelId}
                                                        primary={
                                                            template.template_name
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
                                                                    template.template_name
                                                                }
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                </List>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
                {editTemplate && (
                    <Grid item md={7} xs={12}>
                        <Paper elevation={20}>
                            <Card>
                                <CardHeader
                                    // title={t(
                                    //     "configuration.template_configuration"
                                    // )}
                                    subheader={t(
                                        "configuration.template_configuration"
                                    )}
                                />
                                <Divider />
                                <CardContent>
                                    <Stack spacing={2} sx={{ mr: 3 }}>
                                        <Grid
                                            container
                                            rowSpacing={1}
                                            columnSpacing={{
                                                xs: 1,
                                                sm: 2,
                                                md: 3,
                                            }}
                                        >
                                            {editTemplate.options.map(
                                                (item, index) => {
                                                    if (
                                                        item.type === "text" ||
                                                        item.type === "color"
                                                    ) {
                                                        return (
                                                            <Grid
                                                                item
                                                                xs={4}
                                                                key={index}
                                                            >
                                                                <TextField
                                                                    sx={{
                                                                        m: 2,
                                                                    }}
                                                                    id="standard-basic"
                                                                    label={t(
                                                                        `configuration.${item.item.toLowerCase()}`
                                                                    )}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    fullWidth={
                                                                        true
                                                                    }
                                                                    defaultValue={
                                                                        item.value
                                                                    }
                                                                    color="secondary"
                                                                    type={
                                                                        item.type ===
                                                                        "color"
                                                                            ? "color"
                                                                            : "text"
                                                                    }
                                                                    helperText={`${t(
                                                                        "configuration.default_value"
                                                                    )} : ${
                                                                        item.default
                                                                    }`}
                                                                    required={
                                                                        true
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        let editIndex =
                                                                            editTemplate.options.findIndex(
                                                                                (
                                                                                    x
                                                                                ) =>
                                                                                    x.item ===
                                                                                    item.item
                                                                            );
                                                                        setEditTemplate(
                                                                            {
                                                                                ...editTemplate,
                                                                                options:
                                                                                    [
                                                                                        ...editTemplate.options.slice(
                                                                                            0,
                                                                                            editIndex
                                                                                        ),
                                                                                        {
                                                                                            item: item.item,
                                                                                            value: e
                                                                                                .target
                                                                                                .value,
                                                                                            type: item.type,
                                                                                            default:
                                                                                                item.default
                                                                                                    ? item.default
                                                                                                    : item.value,
                                                                                        },
                                                                                        ...editTemplate.options.slice(
                                                                                            editIndex +
                                                                                                1
                                                                                        ),
                                                                                    ],
                                                                            }
                                                                        );
                                                                    }}
                                                                />
                                                            </Grid>
                                                        );
                                                    } else {
                                                        return (
                                                            <Grid
                                                                item
                                                                xs={4}
                                                                key={index}
                                                            >
                                                                <FormControlLabel
                                                                    sx={{
                                                                        m: 2,
                                                                    }}
                                                                    value="start"
                                                                    control={
                                                                        <Switch
                                                                            color="secondary"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                let editIndex =
                                                                                    editTemplate.options.findIndex(
                                                                                        (
                                                                                            x
                                                                                        ) =>
                                                                                            x.item ===
                                                                                            item.item
                                                                                    );
                                                                                setEditTemplate(
                                                                                    {
                                                                                        ...editTemplate,
                                                                                        options:
                                                                                            [
                                                                                                ...editTemplate.options.slice(
                                                                                                    0,
                                                                                                    editIndex
                                                                                                ),
                                                                                                {
                                                                                                    item: item.item,
                                                                                                    value: e
                                                                                                        .target
                                                                                                        .checked
                                                                                                        ? "1"
                                                                                                        : "0",
                                                                                                    type: item.type,
                                                                                                },
                                                                                                ...editTemplate.options.slice(
                                                                                                    editIndex +
                                                                                                        1
                                                                                                ),
                                                                                            ],
                                                                                    }
                                                                                );
                                                                            }}
                                                                            defaultChecked={
                                                                                item.value ===
                                                                                "1"
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                        />
                                                                    }
                                                                    label={t(
                                                                        `configuration.${item.item.toLowerCase()}`
                                                                    )}
                                                                    labelPlacement="start"
                                                                />
                                                            </Grid>
                                                        );
                                                    }
                                                }
                                            )}
                                        </Grid>
                                    </Stack>
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
                                                    setEditTemplate(false);
                                                return;
                                            }}
                                        >
                                            <u>C</u>ancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            endIcon={<SendIcon />}
                                            onClick={saveTemplate}
                                        >
                                            <u>S</u>ubmit
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                )}

                {!editTemplate && (
                    <Grid item md={7} xs={12}>
                        <Paper elevation={20}>
                            <Grid container>
                                <Grid item md={6} xs={12}>
                                    <Box sx={{ p: 2 }}>
                                        <Paper elevation={20}>
                                            <Typography
                                                variant="subtitle1"
                                                textAlign="center"
                                            >
                                                {t("configuration.clogo")}
                                            </Typography>
                                            <Stack direction="row">
                                                <Stack
                                                    spacing={1}
                                                    // justifyContent="space-between"
                                                    sx={{ p: 1 }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        type="button"
                                                        onClick={() =>
                                                            setShow(true)
                                                        }
                                                    >
                                                        {t(
                                                            "configuration.edit_image"
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        type="button"
                                                        disabled={
                                                            checkImageEdited
                                                                ? false
                                                                : true
                                                        }
                                                        onClick={uploadLogo}
                                                    >
                                                        {t(
                                                            "items.upload_image"
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        type="button"
                                                        onClick={() => {
                                                            removeLogo();
                                                            setCropData(null);
                                                        }}
                                                    >
                                                        {t(
                                                            "items.remove_image"
                                                        )}
                                                    </Button>
                                                </Stack>
                                                <Stack>
                                                    <Box sx={{ p: 1 }}>
                                                        <img
                                                            className="rounded-lg"
                                                            src={cropData}
                                                            width="100%"
                                                            style={{
                                                                borderRadius: 10,
                                                                border: "3px solid #2596be",
                                                            }}
                                                            alt=""
                                                            id="image"
                                                            srcSet=""
                                                        />
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Box>
                                </Grid>
                                <FileUpload
                                    setCropData={setCropData}
                                    setcheckImageEdited={setcheckImageEdited}
                                    show={show}
                                    handleClose={() => setShow(false)}
                                />
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Stack>
    );
}

export default TemplateConfig;
