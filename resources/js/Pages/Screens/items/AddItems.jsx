import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import toaster from "../../../helpers/toaster";
import ToasterContainer from "../../../components/ToasterContainer";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getData } from "../../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";
import FileUpload from "../../../components/FileUpload";
import axios from "axios";

import { PurpleButton, PinkButton } from "../../../Utils/Theming";

import Stack from "@mui/material/Stack";
import Dialogue from "../../../components/Dialogue";
import { useForm } from "react-hook-form";
import {
    FormInputText,
    FormInputDropdown,
    FormInputSwitch,
    FormVatInput,
    FormInputCategory,
} from "../../../components/mui/";

import { itemHelper } from "../../../helpers/FormHelper";
import ProgressLoader from "../../../components/ProgressLoader";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    IconButton,
} from "@mui/material";
import {
    GETALLUNITS,
    GETITEMBYID,
    VALIDATEBARCODE,
} from "../../../constants/apiUrls";
import { router, usePage } from "@inertiajs/react";
import { IconCopy } from "@tabler/icons-react";

function AddItems(props) {
    const { quickRegister, quickInsert } = props;
    const { itemId, configurationData, taxScheme } = usePage().props;

    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const [cropData, setCropData] = useState(null);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [info, setInfo] = useState(null);
    const [checkImageEdited, setcheckImageEdited] = useState(false);
    const [oldbarcode, setOldbarcode] = useState(null);
    const [units, setUnits] = useState([]);

    // const barcodeRef = useRef(null);
    // const nameRef = useRef(null);
    // const commentsRef = useRef(null);
    // const categoryRef = useRef(null);
    // const costRef = useRef(null);
    // const priceRef = useRef(null);
    // const wholesalepriceRef = useRef(null);
    // const minimumpriceRef = useRef(null);
    // const reorderlevelRef = useRef(null);
    // const uomRef = useRef(null);
    // const shelfRef = useRef(null);
    //const vatListRef = useRef(null);
    const submitRef = useRef(null);

    // const _handleEnter = (event, element) => {
    //   if (event.key === "Enter") {
    //     element.current.focus();
    //   }
    // };

    useEffect(() => {
        getData(GETALLUNITS).then((result) => {
            if (result.data.result !== null) setUnits(result.data);
        });
    }, []);

    const validationSchema = Yup.object({
        barcode: Yup.string().test(
            "validateBarcode",
            t("items.barcode_found_in_database"),
            function (value) {
                return new Promise((resolve, reject) => {
                    if (!itemId || (itemId && value !== oldbarcode)) {
                        if (value) {
                            getData(`${VALIDATEBARCODE}${value}`).then(
                                (res) => {
                                    resolve(res.status);
                                }
                            );
                        } else {
                            resolve(true);
                        }
                    } else {
                        resolve(true);
                    }
                });
            }
        ),
        item_name: Yup.string().required(t("items.name_filed_requierd")),
        item_name_ar: Yup.string(),
        category: Yup.string().required(t("items.category_filed_requierd")),
        vatList: Yup.array().of(
            Yup.object().shape({
                tax_name: Yup.string(),
                percent: Yup.string().test(
                    "max",
                    t("common.not_exceed_100"),
                    function (value) {
                        if (value) {
                            return value <= 100;
                        } else {
                            return true;
                        }
                    }
                ),
            })
        ),
        shelf: Yup.string(),
        description: Yup.string(),
        cost_price: Yup.number().required(t("items.cost_filed_requierd")),
        unit_price: Yup.number().required(t("items.price_filed_requierd")),
        wholesale_price: Yup.number().required(
            t("items.wholesale_filed_requierd")
        ),
        minimum_price: Yup.number().required(
            t("items.minimum_price_filed_requierd")
        ),
        reorder_level: Yup.number().required(
            t("items.reorder_level_filed_requierd")
        ),
        // item_quantity: Yup.number(),
        unit_type: Yup.string().required(t("items.uom_filed_requierd")),
    });

    const { handleSubmit, reset, control, setValue, watch } = useForm({
        defaultValues: itemHelper.initialValues(taxScheme),
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        if (itemId) {
            getData(`${GETITEMBYID}${itemId}`).then((response) => {
                if (response.data) {
                    let itemData = response.data;
                    const data = {
                        itemID: itemId,
                        barcode: itemData.barcode || "",
                        item_name: itemData.item_name || "",
                        item_name_ar: itemData.item_name_ar || "",
                        category: itemData.category || "",
                        shelf: itemData.shelf || "",
                        description: itemData.description || "",
                        cost_price: toCurrency(itemData.cost_price) || "0",
                        unit_price: toCurrency(itemData.unit_price) || "0",
                        wholesale_price:
                            toCurrency(itemData.wholesale_price) || "0",
                        minimum_price:
                            toCurrency(itemData.minimum_price) || "0",
                        reorder_level: itemData.reorder_level,
                        // item_quantity: itemData.item_quantity || "",
                        // opening_balance:
                        //   itemData.opening_balance.amount &&
                        //   itemData.opening_balance.amount,
                        unit_type: itemData.unit_type || "1",
                        vatList: itemData.vat_list || [],
                        pos_view: itemData.pos_view === 1 ? true : false,
                        allowdesc: itemData.allowdesc === 1 ? true : false,
                        is_serialized:
                            itemData.is_serialized === 1 ? true : false,
                        stock_type: itemData.stock_type === 1 ? true : false,
                    };

                    if (itemData.pic_filename) {
                        setCropData(`${itemData.pic_filename}`);
                    }
                    // if (response.data.barcode) {
                    //   setOldbarcode(response.data.barcode);
                    // }
                    itemData.barcode && setOldbarcode(itemData.barcode);
                    //setSavedData(data);
                    reset(data);
                }
            });
        }
    }, [itemId]);

    const copyIt = () => {
        let query = watch("item_name");
        if (query) {
            setValue("item_name_ar", query);
        }
    };

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            const formData = new FormData();
            values.vatList = JSON.stringify(values.vatList);
            for (let [key, value] of Object.entries(values)) {
                formData.append(key, value);
            }

            formData.append(
                "img",
                checkImageEdited ? itemHelper.dataURLtoFile(cropData) : null
            );

            axios.post("/items/save_item", formData).then((response) => {
                if (!response.data.error) {
                    setCropData(null);
                    reset(itemHelper.initialValues());

                    if (quickRegister) {
                        quickInsert(response.data.item_id);
                    } else {
                        setShowDialog(true);
                        setInfo(t(response.data.message));
                    }

                    toaster.success(t(response.data.message));
                    setTimeout(() => {
                        setDisableSubmit(false);
                    }, 1000);
                } else {
                    setDisableSubmit(false);
                    toaster.error(response.data.message + response.data.info);
                }
            });
        } else {
            setTimeout(() => {
                setDisableSubmit(false);
            }, 1000);
        }
    };

    return (
        <Stack>
            <Breadcrumb labelHead="Item" labelSub="Add/Edit Item" />
            <ToasterContainer />
            <Dialogue
                showDialog={showDialog}
                message="New Item Created, to list all items click view items else click new item for add new item"
                info={`Info: ${info}`}
                options={[
                    {
                        label: "New Item",
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                            router.get("/items/add_items");
                        },
                    },
                    {
                        label: "List Items",
                        color: "secondary",
                        action: () => {
                            router.get("/items/view_items");
                        },
                    },
                ]}
            />

            <ProgressLoader open={disableSubmit} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1} mt={1} alignItems="stretch">
                    <Grid item md={5} xs={12}>
                        <Paper elevation={20}>
                            <Card>
                                <CardContent>
                                    <FormInputText
                                        name="barcode"
                                        control={control}
                                        label={t("items.barcode")}
                                        secondary
                                        onKeyDown={(e) => {
                                            if (
                                                configurationData.fetch_from_server ===
                                                "1"
                                            ) {
                                                if (e.key === "Enter") {
                                                    setDisableSubmit(true);
                                                    axios
                                                        .post(
                                                            "https://api.ahcjed.com/api/v2/find_item",
                                                            {
                                                                barcode:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                        .then((response) => {
                                                            let rspData =
                                                                response.data
                                                                    .item;

                                                            if (
                                                                rspData !== null
                                                            ) {
                                                                const data = {
                                                                    ...itemHelper.initialValues(),
                                                                    barcode:
                                                                        e.target
                                                                            .value,
                                                                    item_name:
                                                                        rspData.item_name ||
                                                                        "",
                                                                    item_name_ar:
                                                                        rspData.item_name_ar ||
                                                                        "",
                                                                    category:
                                                                        rspData.category ||
                                                                        "",
                                                                    cost_price:
                                                                        toCurrency(
                                                                            rspData.cost_price
                                                                        ) || "",
                                                                    unit_price:
                                                                        toCurrency(
                                                                            rspData.unit_price
                                                                        ) || "",
                                                                };
                                                                reset(data);
                                                            }
                                                        })
                                                        .finally((e) =>
                                                            setDisableSubmit(
                                                                false
                                                            )
                                                        );
                                                }
                                            }
                                        }}
                                    />

                                    <Stack direction={"row"}>
                                        <FormInputText
                                            name="item_name"
                                            control={control}
                                            label={t("items.itemname")}
                                        />
                                        <IconButton
                                            aria-label="copy it"
                                            color="warning"
                                            onClick={copyIt}
                                        >
                                            <IconCopy string={2} />
                                        </IconButton>
                                    </Stack>

                                    <FormInputText
                                        name="item_name_ar"
                                        control={control}
                                        label={t("items.itemnamear")}
                                        transilator={true}
                                    />

                                    <FormInputCategory
                                        name="category"
                                        control={control}
                                        label={t("items.product_category")}
                                    />

                                    <FormInputText
                                        name="shelf"
                                        control={control}
                                        label={t("items.shelf")}
                                    />

                                    <FormInputText
                                        name="description"
                                        control={control}
                                        label={t("common.description")}
                                        multiline={true}
                                    />
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
                                                if (
                                                    window.confirm(
                                                        "Are you Sure?"
                                                    )
                                                ) {
                                                    if (quickRegister) {
                                                        quickInsert(-1);
                                                    }
                                                    reset();
                                                }
                                                return;
                                            }}
                                        >
                                            Clear
                                        </PinkButton>
                                        <PurpleButton
                                            variant="contained"
                                            type="submit"
                                            onClick={handleSubmit(onSubmit)}
                                            ref={submitRef}
                                        >
                                            Send
                                        </PurpleButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Paper elevation={20}>
                            <Card>
                                <CardContent>
                                    <FormVatInput
                                        name="vatList"
                                        setValue={setValue}
                                        //register={register}
                                        control={control}
                                        editable={false}
                                    />

                                    <FormInputText
                                        name="cost_price"
                                        control={control}
                                        label={t("common.cost_price")}
                                        // type="number"
                                        preappend={true}
                                        postappend={true}
                                    />

                                    <FormInputText
                                        name="unit_price"
                                        control={control}
                                        label={t("items.unit_price")}
                                        // type="number"
                                        preappend={true}
                                        postappend={true}
                                    />

                                    <FormInputText
                                        name="wholesale_price"
                                        control={control}
                                        label={t("items.wholesale_price")}
                                        // type="number"
                                        preappend={true}
                                        postappend={true}
                                    />

                                    <FormInputText
                                        name="minimum_price"
                                        control={control}
                                        label={t("items.minimum_price")}
                                        // type="number"
                                        preappend={true}
                                        postappend={true}
                                    />

                                    <FormInputText
                                        name="reorder_level"
                                        control={control}
                                        label={t("items.reorder_level")}
                                        // type="number"
                                    />

                                    {/* <FormInputText
                      name="item_quantity"
                      control={control}
                      label={t("items.item_quantity")}
                      // type="number"
                      preappend={false}
                      postappend={true}
                    />

                    <FormInputText
                      label={t("common.opening_balance")}
                      name="opening_balance"
                      control={control}
                      preappend={true}
                      postappend={true}
                    /> */}

                                    <FormInputDropdown
                                        name="unit_type"
                                        control={control}
                                        label={t("items.unit_type")}
                                        options={units}
                                    />
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Grid container spacing={1}>
                            <Grid item md={12} xs={12}>
                                <Paper elevation={20}>
                                    <Card>
                                        <CardContent>
                                            <FormInputSwitch
                                                name={"stock_type"}
                                                control={control}
                                                label={t("items.stocked_item")}
                                                onText={t(
                                                    "items.stocked_goods"
                                                )}
                                                OffText={t("items.service")}
                                            />
                                            <FormInputSwitch
                                                name={"pos_view"}
                                                control={control}
                                                label={t("items.pos_view")}
                                                onText={t("items.yes")}
                                                OffText={t("items.no")}
                                            />
                                            <FormInputSwitch
                                                name={"allowdesc"}
                                                control={control}
                                                label={t(
                                                    "items.allowtocreatedescription"
                                                )}
                                                onText={t("items.yes")}
                                                OffText={t("items.no")}
                                            />
                                            <FormInputSwitch
                                                name={"is_serialized"}
                                                control={control}
                                                label={t(
                                                    "items.allow_serial_number"
                                                )}
                                                onText={t("items.yes")}
                                                OffText={t("items.no")}
                                            />
                                        </CardContent>
                                    </Card>
                                </Paper>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Paper elevation={20}>
                                    <Stack direction="column">
                                        <Box sx={{ p: 1 }}>
                                            <img
                                                className="rounded-lg"
                                                src={cropData}
                                                width="100%"
                                                style={{ borderRadius: 10 }}
                                                alt=""
                                                id="image"
                                                srcSet=""
                                            />
                                        </Box>

                                        <Stack
                                            direction={"row"}
                                            spacing={1}
                                            justifyContent="space-between"
                                            sx={{ p: 1 }}
                                        >
                                            <Button
                                                variant="contained"
                                                type="button"
                                                onClick={() => setShow(true)}
                                            >
                                                {t("items.upload_image")}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                type="button"
                                                onClick={() => {
                                                    setCropData("");
                                                }}
                                            >
                                                {t("items.remove_image")}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <FileUpload
                                setCropData={setCropData}
                                setcheckImageEdited={setcheckImageEdited}
                                show={show}
                                handleClose={() => setShow(false)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

export default AddItems;
