import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import toaster from "../../../../helpers/toaster";
import ToasterContainer from "../../../../components/ToasterContainer";
import { yupResolver } from "@hookform/resolvers/yup";
import { toDoValidation } from "../../../../helpers/FormTrasilationHelper";
import {
    Paper,
    Stack,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
} from "@mui/material";
import { PinkButton, PurpleButton } from "../../../../Utils/Theming";
import { FormInputText, FormInputDatePicker } from "../../../../components/mui";
import { SelectTags } from "./SelectTags";
import { GETTODOBYID, SAVETODO } from "../../../../constants/apiUrls";
import { getData, postData } from "../../../../apis/apiCalls";

const initialValues = {
    todo_id: null,
    title: "",
    date: new Date(),
    tags: [],
    description: "",
};

function AddTodo({ editableItem, apiCall, closeIt }) {
    const { t } = useTranslation();

    const { handleSubmit, reset, control } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(toDoValidation),
        mode: "onBlur",
    });

    useEffect(() => {
        if (editableItem) {
            getData(`${GETTODOBYID}${editableItem}`).then((response) => {
                if (!response.error) {
                    let data = {
                        ...response.data,
                        date: new Date(response.data.date + "Z"),
                    };
                    reset(data);
                }
            });
        } else {
            reset(initialValues);
        }
    }, [editableItem]);

    const onSubmit = (values) => {
        postData(SAVETODO, values).then((response) => {
            if (response.error) {
                toaster.error(t("messages.error_saving_new_item"));
            } else {
                toaster.success(t("messages.new_item_saved"));
                // resetDefault();
                apiCall();
            }
        });
    };
    return (
        <Stack sx={{ m: 1 }}>
            <ToasterContainer />

            <Grid
                container
                sx={{ justifyContent: "center", alignItems: "center" }}
            >
                <Grid item md={8} sm={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Paper elevation={20}>
                            <Card>
                                <CardHeader subheader={t("todo.add")} />
                                <Divider />
                                <CardContent>
                                    <FormInputText
                                        label={t("common.name")}
                                        name="title"
                                        control={control}
                                    />

                                    <FormInputDatePicker
                                        label={t("todo.date")}
                                        name="date"
                                        control={control}
                                    />

                                    <SelectTags
                                        label={t("todo.category")}
                                        name="tags"
                                        control={control}
                                    />

                                    <FormInputText
                                        name="description"
                                        control={control}
                                        label={t("todo.message")}
                                        multiline={true}
                                    />
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
                                        if (window.confirm("Are you Sure?")) {
                                            reset();
                                            closeIt();
                                        }
                                        return;
                                    }}
                                >
                                    {t("common.cancel")}
                                </PinkButton>
                                <PurpleButton
                                    variant="contained"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {t("common.save")}
                                </PurpleButton>
                            </Stack>
                        </Paper>
                    </form>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default AddTodo;
