import {
    Autocomplete,
    FormControl,
    TextField,
    Fab,
    Stack,
    Chip,
    Card,
    CardContent,
    Divider,
} from "@mui/material";

import React, { useEffect, useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { getData, postData } from "../../../../apis/apiCalls";
import {
    SAVETODOTAG,
    GETTODOTAGS,
} from "../../../../constants/apiUrls";
import ToasterContainer from "../../../../components/ToasterContainer";
import toaster from "../../../../helpers/toaster";
import AppModel from "../../../../components/AppModel";
import { FormInputText } from "../../../../components/mui";
import { PinkButton, PurpleButton } from "../../../../Utils/Theming";

const defaultValue = { tag_name: "" };

const AddTag = ({ createItem, handleCloseButton }) => {
    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(false);
    const validationSchema = Yup.object({
        tag_name: Yup.string()
            .required(t("common.name_filed_requierd"))
            .min(3, t("common.name_is_short")),
    });

    const { handleSubmit, reset, control } = useForm({
        defaultValues: defaultValue,
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const onSubmit = (values) => {
        if (!disableSubmit) {
            setDisableSubmit(true);
            postData(SAVETODOTAG, values)
                .then((response) => {
                    if (!response.error) {
                        reset();
                        toaster.success(t(response.message));
                        handleCloseButton("update");
                    } else {
                        toaster.error(t(response.message));
                    }
                })
                .finally(() => setDisableSubmit(false));
        }
    };
    return (
        <AppModel
            open={createItem}
            onClose={() => handleCloseButton("close")}
            title={t("todo.new_tag")}
        >
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ToasterContainer />
                        <FormInputText
                            name="tag_name"
                            control={control}
                            label={t("common.name")}
                        />

                        <Divider sx={{ my: 2 }} />
                        <Stack
                            spacing={2}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <PinkButton
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    if (window.confirm("Are you Sure?")) {
                                        reset();
                                    }
                                    return;
                                }}
                            >
                                {t("common.cancel")}
                            </PinkButton>
                            <PurpleButton
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                            >
                                {t("common.save")}
                            </PurpleButton>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </AppModel>
    );
};

export const SelectTags = ({ name, control, label }) => {
    const [createItem, setCreateItem] = useState(false);
    const [optionList, setOptionList] = useState([]);

    const apiCall = useCallback((action) => {
        switch (action) {
            case "close":
                setCreateItem(false);
                break;
            case "update":
                getData(GETTODOTAGS).then((response) => {
                    setOptionList(response.data);
                    setCreateItem(false);
                });
                break;
            default:
                break;
        }
    }, []);

    const handleCloseButton = useCallback((action) => {
        apiCall(action);
    }, []);

    useEffect(() => {
        apiCall("update");
    }, []);

    return (
        <FormControl fullWidth sx={{ px: 1, py: "4px" }}>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                }) => {
                    return (
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Autocomplete
                                multiple
                                id="tags-multiselect"
                                sx={{ width: "100%" }}
                                options={optionList.map(
                                    (option) => option.name
                                )}
                                onChange={(_, data) => {
                                    data && onChange(data);
                                }}
                                value={value}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            color="warning"
                                            label={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        error={error}
                                        label={label}
                                    />
                                )}
                            />

                            <Fab
                                color="secondary"
                                size="small"
                                aria-label="add"
                                onClick={() => setCreateItem(true)}
                            >
                                <AddIcon fontSize="small" />
                            </Fab>
                        </Stack>
                    );
                }}
            />
            <AddTag
                createItem={createItem}
                handleCloseButton={handleCloseButton}
            />
        </FormControl>
    );
};
