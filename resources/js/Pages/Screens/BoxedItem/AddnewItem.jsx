import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import axios from "axios";

import toaster from "../../../helpers/toaster";

import ToasterContainer from "../../../components/ToasterContainer";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getData } from "../../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";
import FileUpload from "../../../components/FileUpload";
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
import { itemHelper, BoxedItemHelper } from "../../../helpers/FormHelper";
import ProgressLoader from "../../../components/ProgressLoader";
import BoxedCart from "./support/BoxedCart";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import {
    SAVEBOXEDITEM,
    GETALLUNITS,
    GETBOXEDITEMBYID,
    VALIDATEBARCODE,
} from "../../../constants/apiUrls";
import { router, usePage } from "@inertiajs/react";

function AddnewBoxedItem(props) {
    const { itemId, storeID, configurationData, taxScheme } = usePage().props;
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const [cropData, setCropData] = useState(null);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [info, setInfo] = useState(null);
    const [checkImageEdited, setcheckImageEdited] = useState(false);
    const [oldbarcode, setOldbarcode] = useState(null);
    const [units, setUnits] = useState([]);
    //const [productList, setProductList] = useState([]);

    const submitRef = useRef(null);

    useEffect(() => {
        getData(GETALLUNITS).then((result) => {
            if (result.data.result !== null) setUnits(result.data);
        });
    }, []);

    useEffect(() => {
        if (itemId) {
            // let { storeId } = JSON.parse(localStorage.getItem("store_data"));
            getData(`${GETBOXEDITEMBYID}/${itemId}`).then((response) => {
                if (response.data) {
                    let itemData = response.data;
                    const data = {
                        itemID: itemId,
                        barcode: itemData.barcode || "",
                        item_name: itemData.item_name || "",
                        item_name_ar: itemData.item_name_ar || "",
                        shelf: itemData.shelf || "",
                        category: itemData.category || "",
                        description: itemData.description || "",
                        cost_price: toCurrency(itemData.cost_price) || "",
                        unit_price: toCurrency(itemData.unit_price) || "",
                        wholesale_price:
                            toCurrency(itemData.wholesale_price) || "",
                        minimum_price: toCurrency(itemData.minimum_price) || "",
                        // reorder_level: itemData.reorder_level || "",
                        // item_quantity: itemData.item_quantity || "",
                        unit_type: itemData.unit_type || "1",
                        vatList: itemData.vat_list || [],
                        allowdesc: itemData.allowdesc === 1 ? true : false,
                        is_serialized:
                            itemData.is_serialized === 1 ? true : false,
                        // stock_type: itemData.stock_type === 1 ? true : false,
                        productList: itemData.boxed_items || [],
                    };

                    //setProductList(itemData.productList || []);
                    // if (response.data.image) {
                    //     setCropData(`${baseUrl}/product-images/${itemId}.jpg`);
                    // }

                    if (response.data.pic_filename) {
                        setCropData(`${response.data.pic_filename}`);
                    }

              
                    if (response.data.barcode) {
                        setOldbarcode(response.data.barcode);
                    }
                    reset(data);
                }
            });
        }
    }, [itemId]);

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
        shelf: Yup.string(),
        category: Yup.string().required(t("items.category_filed_requierd")),
        vatList: Yup.array().of(
            Yup.object().shape({
                tax_name: Yup.string().required(t("common.tax_name_required")),
                percent: Yup.number()
                    .required("errorText.name")
                    .test("max", t("common.not_exceed_100"), function (value) {
                        return value <= 100;
                    }),
            })
        ),
        description: Yup.string(),
        cost_price: Yup.number().required(t("items.cost_filed_requierd")),
        unit_price: Yup.number().required(t("items.price_filed_requierd")),
        wholesale_price: Yup.number().required(
            t("items.wholesale_filed_requierd")
        ),
        minimum_price: Yup.number().required(
            t("items.minimum_price_filed_requierd")
        ),
        // reorder_level: Yup.number().required(
        //   t("items.reorder_level_filed_requierd")
        // ),
        unit_type: Yup.string().required(t("items.uom_filed_requierd")),
        productList: Yup.array()
            .min(1)
            .required(t("items.product_list_required")),
    });

    //const methods =
    const {
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: BoxedItemHelper.initialValues(taxScheme),
        resolver: yupResolver(validationSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        shouldFocusError: true,
    });

    const onSubmit = (values) => {
        setDisableSubmit(true);
        if (!disableSubmit) {
            const formData = new FormData();
            // let { storeId } = JSON.parse(localStorage.getItem("store_data"));

            values.productList = JSON.stringify(values.productList);
            values.vatList = JSON.stringify(values.vatList);
            for (let [key, value] of Object.entries(values)) {
                formData.append(key, value);
            }

            formData.append(
                "img",
                checkImageEdited ? itemHelper.dataURLtoFile(cropData) : null
            );

            formData.append("store", storeID);

            axios.post(SAVEBOXEDITEM, formData).then((response) => {
                if (!response.data.error) {
                    setCropData(null);
                    reset(BoxedItemHelper.initialValues());
                    setShowDialog(true);
                    setInfo(t(response.data.message));
                    toaster.success(response.data.message);
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
            <Breadcrumb
                labelHead={t("bundleditem.bundleditem")}
                labelSub={t("bundleditem.bundleditem_dec")}
            />
            <ToasterContainer />
            <Dialogue
                showDialog={showDialog}
                message="New Boxed Item Created, to list all items click view items else click new item for add new Boxed item"
                info={`Info: ${info}`}
                options={[
                    {
                        label: "New Item",
                        color: "primary",
                        action: () => {
                            setShowDialog(false);
                        },
                    },
                    {
                        label: "List Items",
                        color: "secondary",
                        action: () => {
                            router.get("/bundleditems/view_bundleditems");
                        },
                    },
                ]}
            />

            <ProgressLoader open={disableSubmit} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1} mt={1}>
                    <Grid item md={4} xs={12}>
                            <Paper elevation={20}>
                                <Card>
                                    <CardContent>
                                        <FormInputText
                                            name="barcode"
                                            control={control}
                                            label={t("items.barcode")}
                                            onKeyDown={(e) => {
                                                if (
                                                    configurationData.fetch_from_server ===
                                                    "1"
                                                ) {
                                                    if (e.key === "Enter") {
                                                        setDisableSubmit(true);
                                                        apiAxios
                                                            .post(
                                                                "https://api.ahcjed.com/api/v2/find_item",
                                                                {
                                                                    barcode:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                            .then(
                                                                (response) => {
                                                                    let rspData =
                                                                        response
                                                                            .data
                                                                            .item;
                                                                    if (
                                                                        rspData !==
                                                                        null
                                                                    ) {
                                                                        const data =
                                                                            {
                                                                                ...BoxedItemHelper.initialValues(),
                                                                                barcode:
                                                                                    e
                                                                                        .target
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
                                                                                    ) ||
                                                                                    0,
                                                                                unit_price:
                                                                                    toCurrency(
                                                                                        rspData.unit_price
                                                                                    ) ||
                                                                                    0,
                                                                            };
                                                                        reset(
                                                                            data
                                                                        );
                                                                    }
                                                                }
                                                            )
                                                            .finaly((e) =>
                                                                setDisableSubmit(
                                                                    false
                                                                )
                                                            );
                                                    }
                                                }
                                            }}
                                            secondary
                                        />

                                        <FormInputText
                                            name="item_name"
                                            control={control}
                                            label={t("items.itemname")}
                                        />

                                        <FormInputText
                                            name="item_name_ar"
                                            control={control}
                                            label={t("items.itemnamear")}
                                        />

                                        <FormInputCategory
                                            name="category"
                                            control={control}
                                            label={t("items.product_category")}
                                        />

                                        <FormVatInput
                                            name="vatList"
                                            setValue={setValue}
                                            control={control}
                                            editable={false}
                                        />

                                        <FormInputText
                                            name="description"
                                            control={control}
                                            label={t("items.comments")}
                                            multiline={true}
                                        />

                                        <FormInputText
                                            name="shelf"
                                            control={control}
                                            label={t("items.shelf")}
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
                                                    )
                                                        reset();
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
                    <Grid item md={3} xs={12}>
                            <Paper elevation={20} sx={{mb:1}}>
                                <Card>
                                    <CardContent>
                                        <FormInputText
                                            name="cost_price"
                                            control={control}
                                            label={t("items.cost_price")}
                                            type="number"
                                            preappend={true}
                                            postappend={true}
                                        />

                                        <FormInputText
                                            name="unit_price"
                                            control={control}
                                            label={t("items.unit_price")}
                                            type="number"
                                            preappend={true}
                                            postappend={true}
                                        />

                                        <FormInputText
                                            name="wholesale_price"
                                            control={control}
                                            label={t("items.wholesale_price")}
                                            type="number"
                                            preappend={true}
                                            postappend={true}
                                        />

                                        <FormInputText
                                            name="minimum_price"
                                            control={control}
                                            label={t("items.minimum_price")}
                                            type="number"
                                            preappend={true}
                                            postappend={true}
                                        />

                                        <FormInputDropdown
                                            name="unit_type"
                                            control={control}
                                            label={t("items.uom")}
                                            options={units}
                                        />

                                        {/* <FormInputText
                      name="reorder_level"
                      control={control}
                      label={t("items.reorder_level")}
                      type="number"
                    />

                    <FormInputText
                      name="item_quantity"
                      control={control}
                      label={t("items.item_quantity")}
                      // type="number"
                      preappend={false}
                      postappend={true}
                    />

                    <FormInputDropdown
                      name="unit_type"
                      control={control}
                      label={t("items.uom")}
                      options={itemHelper.uomOptions}
                    /> */}
                                    </CardContent>
                                </Card>
                            </Paper>
                            <Paper elevation={20}>
                                {/* <Card>
                  <CardMedia
                    style={{ height: 0, paddingTop: "56.25%" }}
                    image={cropData}
                    title="lorem ipsum"
                    id="image"
                  />
                  <CardContent>
                    <Stack
                      direction={"row"}
                      spacing={1}
                      justifyContent="space-between"
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

                    <FileUpload
                      setCropData={setCropData}
                      setcheckImageEdited={setcheckImageEdited}
                      show={show}
                      handleClose={() => setShow(false)}
                    />
                  </CardContent>
                </Card> */}

                                <Paper elevation={20}>
                                    <Stack direction="column">
                                        <Box sx={{ p: 1 }}>
                                            <img
                                                className="rounded-lg"
                                                src={cropData}
                                                style={{
                                                    borderRadius: 10,
                                                    width: "100%",
                                                    height: "180px",
                                                }}
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
                            </Paper>
                    </Grid>
                    <FileUpload
                        setCropData={setCropData}
                        setcheckImageEdited={setcheckImageEdited}
                        show={show}
                        handleClose={() => setShow(false)}
                    />

                    <Grid item md={5} xs={12}>
                            <Paper elevation={20}>
                                <Card>
                                    <CardContent>
                                        <Stack direction={"row"}>
                                            <FormInputSwitch
                                                name={"allowdesc"}
                                                control={control}
                                                label={t(
                                                    "items.allowtocreatedescription"
                                                )}
                                                onText={t("items.allow")}
                                                OffText={t("items.deny")}
                                            />
                                            <Divider
                                                orientation="vertical"
                                                variant="middle"
                                                flexItem
                                            />
                                            <FormInputSwitch
                                                name={"is_serialized"}
                                                control={control}
                                                label={t(
                                                    "items.allow_serial_number"
                                                )}
                                                onText={t("items.allow")}
                                                OffText={t("items.deny")}
                                            />
                                        </Stack>
                                        <Divider sx={{ mb: 2, p: 0 }}>
                                            <Chip
                                                label={t("tables.items_list")}
                                                color={"secondary"}
                                            />
                                        </Divider>
                                        <BoxedCart
                                            setValue={setValue}
                                            control={control}
                                            watch={watch}
                                            errors={errors}
                                        />
                                    </CardContent>
                                </Card>
                            </Paper>
                    </Grid>
                </Grid>
            </form>
        </Stack>
    );
}

export default AddnewBoxedItem;
