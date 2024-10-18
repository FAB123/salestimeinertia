import React, { forwardRef, useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import { FormInputText } from "../../../components/mui/FormInputText";
import { FormInputDropdown } from "../../../components/mui/FormInputDropdown";

import { FormInputSwitch } from "../../../components/mui/FormInputSwitch";
import { FormVatInput } from "../../../components/mui/FormVatInput";
import { itemHelper } from "../../../helpers/FormHelper";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { PurpleButton, PinkButton } from "../../../Utils/Theming";
import axios from "axios";

import toaster from "../../../helpers/toaster";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

function SimpleAddItem(props) {
    const { t } = useTranslation();
    const { showDialog, setshowDialog } = props;
    const [disableSubmit, setDisableSubmit] = useState(false);

    const validationSchema = Yup.object({
        barcode: Yup.string().test(
            "Unique Email",
            t("items.barcode_found_in_database"),
            function (value) {
                return new Promise((resolve, reject) => {
                    if (value) {
                        axios
                            .get(`/items/validatebarcode/?barcode=${value}`)
                            .then((res) => {
                                if (res.data.status) {
                                    resolve(false);
                                }
                                resolve(true);
                            });
                    }
                });
            }
        ),
        name: Yup.string().required(t("items.name_filed_requierd")),
        itemnamear: Yup.string(),
        stocked: Yup.string(),
        category: Yup.string().required(t("items.category_filed_requierd")),
        cost: Yup.number().required(t("items.cost_filed_requierd")),
        price: Yup.number().required(t("items.price_filed_requierd")),
        wholesaleprice: Yup.number().required(
            t("items.wholesale_filed_requierd")
        ),
        minimumprice: Yup.number().required(
            t("items.minimum_price_filed_requierd")
        ),
        reorderlevel: Yup.number().required(
            t("items.reorder_level_filed_requierd")
        ),
        uom: Yup.string().required(t("items.uom_filed_requierd")),
        shelf: Yup.string(),
        vat: Yup.string(),
        type: Yup.string(),
        taxable: Yup.boolean(),
        comments: Yup.string(),
    });

    const { handleSubmit, reset, control, setValue } = useForm({
        defaultValues: itemHelper.initialValues(),
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            const data = new FormData();
            data.append("datas", JSON.stringify(values));
            let userId = JSON.parse(localStorage.getItem("store_data"));
            data.append("user_id", userId._id);
            data.append("img", null);
            axios.post("/items/add_new_item", data).then((response) => {
                if (response.data.result) {
                    toaster.success("New Item Added");
                    setshowDialog(false);
                    reset();
                    setTimeout(() => {
                        setDisableSubmit(false);
                    }, 1000);
                } else
                    toaster.error(
                        "Error Adding new Item, Error Code " +
                            response.data.msg.code
                    );
            });
        } else {
            setTimeout(() => {
                setDisableSubmit(false);
            }, 1000);
        }
    };

    return (
        <div>
            <Dialog
                open={showDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={setshowDialog}
                aria-describedby="alert-dialog"
            >
                <DialogTitle>{"Add Item"}</DialogTitle>
                <DialogContent>
                    <FormInputText
                        name="barcode"
                        control={control}
                        label={t("items.barcode")}
                    />

                    <FormInputText
                        name="name"
                        control={control}
                        label={t("items.itemname")}
                    />

                    <FormInputText
                        name="name_ar"
                        control={control}
                        label={t("items.itemnamear")}
                    />

                    <FormInputText
                        name="category"
                        control={control}
                        label={t("items.product_category")}
                    />

                    <FormVatInput
                        name="vatList"
                        setValue={setValue}
                        control={control}
                    />

                    <FormInputText
                        name="comments"
                        control={control}
                        label={t("items.comments")}
                        multiline={true}
                    />

                    <FormInputText
                        name="cost"
                        control={control}
                        label={t("items.cost_price")}
                        type="number"
                        preappend={true}
                        postappend={true}
                    />

                    <FormInputText
                        name="price"
                        control={control}
                        label={t("items.unit_price")}
                        type="number"
                        preappend={true}
                        postappend={true}
                    />

                    <FormInputText
                        name="wholesaleprice"
                        control={control}
                        label={t("items.wholesale_price")}
                        type="number"
                        preappend={true}
                        postappend={true}
                    />

                    <FormInputText
                        name="minimumprice"
                        control={control}
                        label={t("items.minimum_price")}
                        type="number"
                        preappend={true}
                        postappend={true}
                    />

                    <FormInputText
                        name="reorderlevel"
                        control={control}
                        label={t("items.reorder_level")}
                        type="number"
                    />

                    <FormInputDropdown
                        name="uom"
                        control={control}
                        label={t("items.uom")}
                        options={itemHelper.uomOptions}
                    />

                    <FormInputText
                        name="shelf"
                        control={control}
                        label={t("items.shelf")}
                    />
                    <FormInputSwitch
                        name={"stocked"}
                        control={control}
                        label={t("items.stocked_item")}
                        onText={t("items.stocked_goods")}
                        OffText={t("items.service")}
                    />

                    <FormInputSwitch
                        name={"allowdesc"}
                        control={control}
                        label={t("items.allowtocreatedescription")}
                        onText={t("items.allow")}
                        OffText={t("items.deny")}
                    />
                    <FormInputSwitch
                        name={"allowserial"}
                        control={control}
                        label={t("items.allow_serial_number")}
                        onText={t("items.allow")}
                        OffText={t("items.deny")}
                    />
                </DialogContent>
                <DialogActions>
                    <PinkButton
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setshowDialog(false);
                        }}
                    >
                        Cancel
                    </PinkButton>
                    <PurpleButton
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        // ref={submitRef}
                    >
                        Save
                    </PurpleButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SimpleAddItem;
