import {
    Card,
    IconButton,
    Paper,
    Stack,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import React, { useCallback, useRef } from "react";

import GenerateBcode from "./barcode/GenerateBcode";
import ReactToPrint from "react-to-print";
import { useEffect } from "react";
import { useState } from "react";
import { PinkButton, PurpleButton } from "../../../Utils/Theming";
import { useTranslation } from "react-i18next";
import { postData } from "../../../apis/apiCalls";
import { GENERATEBARCODE } from "../../../constants/apiUrls";
import toaster from "../../../helpers/toaster";
import { usePage } from "@inertiajs/react";
import PrintIcon from "@mui/icons-material/Print";

function BarcodeView(props) {
    const { value, updateTable } = props;

    const { configurationData } = usePage().props;

    const [barcodeData, setBarcodeData] = useState(null);
    const [typedBarcode, setTypedBarcode] = useState("");
    const barcodeRef = useRef();
    const { t } = useTranslation();

    const DrawerHeader = styled("div")(({ theme }) => ({
        ...theme.mixins.toolbar,
    }));

    const getText = useCallback(
        (data, type) => {
            switch (configurationData[type]) {
                case "COMPANYNAME":
                    return configurationData.company_name;
                case "COMPANYNAMEAR":
                    return configurationData.company_name_ar;
                case "ITEMNAME":
                    return data.item_name;
                case "ITEMNAMEAR":
                    return data.item_name_ar;
                case "ITEMCATEGORY":
                    return data.category;
                case "UNITPRICE":
                    return `PRICE: ${data.unit_price} SR`;
                default:
                    return data.unit_price;
            }
        },
        [configurationData]
    );

    const generateBarcode = (type) => {
        if (type === "manual") {
            if (typedBarcode === "") {
                toaster.error(t("items.barcode_filed_empty"));
                return;
            }
        }
        postData(GENERATEBARCODE, {
            type,
            item: value?.item_id,
            barcode: typedBarcode,
        }).then((response) => {
            if (response.status) {
                let row1 = getText(response?.data, "barcode_row1");
                let row2 = getText(response?.data, "barcode_row2");
                let row3 = getText(response?.data, "barcode_row3");
                let obj = {
                    value: response.data.barcode,
                    row1text: row1,
                    row2text: row2,
                    row3text: row3,
                    format: configurationData.barcode_type,
                    width: configurationData.barcode_width,
                    height: configurationData.barcode_height,
                    row1size: configurationData.barcode_row1_size,
                    row2size: configurationData.barcode_row2_size,
                    row3size: configurationData.barcode_row3_size,
                    label_width: configurationData.barcode_lable_width,
                    label_height: configurationData.barcode_lable_height,
                };
                setBarcodeData(obj);
            } else {
                toaster.error(t("items.barcode_error"));
            }
        });
        updateTable();
    };

    useEffect(() => {
        if (value.barcode) {
            let row1 = getText(value, "barcode_row1");
            let row2 = getText(value, "barcode_row2");
            let row3 = getText(value, "barcode_row3");
            let obj = {
                value: value.barcode,
                row1text: row1,
                row2text: row2,
                row3text: row3,
                format: configurationData.barcode_type,
                width: configurationData.barcode_width,
                height: configurationData.barcode_height,
                row1size: configurationData.barcode_row1_size,
                row2size: configurationData.barcode_row2_size,
                row3size: configurationData.barcode_row3_size,
                label_width: configurationData.barcode_lable_width,
                label_height: configurationData.barcode_lable_height,
            };
            setBarcodeData(obj);
        }
    }, []);

    return (
        <Stack sx={{ p: 1 }}>
            <DrawerHeader />
            <Card sx={{ p: 1 }} elevation={24}>
                {barcodeData ? (
                    <>
                        <Paper elevation={24} sx={{ p: 2 }}>
                            <Typography>{`${t(
                                "configuration.barcode_type"
                            )} : ${barcodeData.format}`}</Typography>
                            <Typography>{`${t("configuration.label_width")} : ${
                                barcodeData.label_width
                            }`}</Typography>

                            <Typography>{`${t(
                                "configuration.label_height"
                            )} : ${barcodeData.label_height}`}</Typography>

                            <Typography>{`${t(
                                "configuration.barcode_width"
                            )} : ${barcodeData.width}`}</Typography>

                            <Typography>{`${t(
                                "configuration.barcode_height"
                            )} : ${barcodeData.height}`}</Typography>

                            <Typography>{`${t(
                                "configuration.barcode_row1_size"
                            )} : ${barcodeData.row1size}`}</Typography>

                            <Typography>{`${t(
                                "configuration.barcode_row2_size"
                            )} : ${barcodeData.row2size}`}</Typography>

                            <Typography>{`${t(
                                "configuration.barcode_row3_size"
                            )} : ${barcodeData.row3size}`}</Typography>
                        </Paper>
                        <Paper elevation={24} sx={{ p: 2, mt: 2 }}>
                            <Stack ref={barcodeRef}>
                                <GenerateBcode
                                    value={barcodeData.value}
                                    row1text={barcodeData.row1text}
                                    row2text={barcodeData.row2text}
                                    row3text={barcodeData.row3text}
                                    format={barcodeData.format}
                                    width={barcodeData.width}
                                    height={barcodeData.height}
                                    row1size={barcodeData.row1size}
                                    row2size={barcodeData.row2size}
                                    row3size={barcodeData.row3size}
                                />
                            </Stack>
                        </Paper>
                        <Stack alignItems={"center"} sx={{ mt: 2 }}>
                            <ReactToPrint
                                pageStyle={`@page {size: ${barcodeData.label_width}cm ${barcodeData.label_height}cm;}`}
                                trigger={() => (
                                    <IconButton color="warning">
                                        <PrintIcon />
                                    </IconButton>
                                )}
                                content={() => barcodeRef.current}
                            />
                        </Stack>
                    </>
                ) : (
                    <Stack spacing={2}>
                        <Typography color="error">
                            {t("items.barcode_info")}
                        </Typography>
                        <TextField
                            label="New Barcode"
                            size="small"
                            value={typedBarcode}
                            onChange={(e) => setTypedBarcode(e.target.value)}
                        ></TextField>
                        <Stack direction="row" spacing={2}>
                            <PinkButton
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => generateBarcode("manual")}
                            >
                                Insert This Barcode
                            </PinkButton>
                            <PurpleButton
                                variant="contained"
                                size="small"
                                color="info"
                                onClick={() => generateBarcode("auto")}
                            >
                                Generate Automatically
                            </PurpleButton>
                        </Stack>
                    </Stack>
                )}
            </Card>
        </Stack>
    );
}

export default BarcodeView;
