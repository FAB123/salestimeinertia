import React, { useState } from "react";
import {
    Autocomplete,
    Stack,
    TextField,
    TableHead,
    Table,
    TableContainer,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    Typography,
    Switch,
    Fab,
    Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import OnlinePredictionRoundedIcon from "@mui/icons-material/OnlinePredictionRounded";

import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { getData } from "../../apis/apiCalls";

import { calculateItemDetails } from "../../helpers/TaxHelper";

import PercentIcon from "@mui/icons-material/Percent";

import toaster from "../../helpers/toaster";
import { useEffect } from "react";
import ReportViewer from "../../Pages/Screens/sales/ReportViewer";
import {
    GETITEMBYBARCODEORID,
    SEARCHSALEITEMLIST,
} from "../../constants/apiUrls";
import AddItems from "../../Pages/Screens/items/AddItems";
import { useRef } from "react";
import PriceList from "./PriceList";
import { PosTooltip } from "../../Utils/Theming";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import SearchIcon from "@mui/icons-material/Search";
import FindSales from "./FindSales";
import PosDrawer from "../../components/PosDrawer";

import { purple } from "@mui/material/colors";
import BarcodeIcon from "./BarcodeIcon";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { router } from "@inertiajs/react";
import FindWorkorder from "./FindWorkorder";

const colorTheme = {
    backgroundColor: purple[100],
    color: "#fff",
};

function CartControll({
    savedDatas,
    setSavedDatas,
    saleType,
    storeData,
    configurationData,
}) {
    const { t } = useTranslation();

    const [arrangeInterface, setArrangeInterface] = useState({
        width: "60%",
        show: true,
    });

    const [itemList, setItemList] = useState([]);
    const [query, setQuery] = useState("");
    const [openReport, setOpenReport] = useState(false);
    const [useDrawer, setUseDrawer] = useState(false);
    const [viewPrice, setViewPrice] = useState(false);
    const [itemNumber, setItemNumber] = useState(null);
    const [findSales, setFindSales] = useState(false);
    const [findWorkorder, setFindWorkorder] = useState(false);

    const [scanType, setScanType] = useState(true);
    const [einvoiceisEnabled, setEinvoiceisEnabled] = useState(null);

    const itemRef = useRef();
    const qtyRef = useRef();
    const priceRef = useRef();
    const discountRef = useRef();

    useEffect(() => {
        setEinvoiceisEnabled(configurationData?.enable_einvoice);
        setScanType(configurationData?.barcode_billing === "1" ? true : false);
    }, [storeData]);

    useEffect(() => {
        if (
            saleType === "WORKORDER" ||
            saleType === "QUATATION" ||
            saleType === "opening_stock"
        ) {
            setArrangeInterface({
                width: "70%",
                show: false,
            });
        }
        // itemRef.current.focus();
    }, [saleType]);

    const addToCart = async (item) => {
        var foundinCart = savedDatas.cartItems.findIndex(
            (x) => x.item_id === item.item_id
        );

        const useSingleLine =
            item.allowdesc === 1
                ? false
                : item.is_serialized === 1
                ? false
                : foundinCart > 0
                ? true
                : false;

        if (useSingleLine) {
            let olditems = savedDatas.cartItems[foundinCart];
            let new_quantity = parseFloat(olditems["quantity"]) + 1;
            let new_unit_price = olditems.unit_price;
            let new_discount = olditems.discount;
            let new_discount_type = olditems.discount_type;

            let calculatedData = await calculateItemDetails(
                new_unit_price,
                new_quantity,
                new_discount,
                new_discount_type,
                olditems.vatList,
                configurationData.include_tax
            );

            olditems["quantity"] = new_quantity;
            olditems["vatList"] = calculatedData.vatDetails.taxDetails;
            olditems[
                "vat"
            ] = `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`;
            olditems["subTotal"] = calculatedData.total.calculatedSubTotal;
            olditems["total"] = calculatedData.total.calculatedTotal;

            setSavedDatas({
                ...savedDatas,
                cartItems: [
                    ...savedDatas.cartItems.slice(0, foundinCart),
                    olditems,
                    ...savedDatas.cartItems.slice(foundinCart + 1),
                ],
            });
        } else {
            var unit_price;
            if (savedDatas.customerInfo) {
                let customer = savedDatas.customerInfo;
                unit_price =
                    customer.customer_type === 1
                        ? item.wholesale_price
                        : item.unit_price;
            } else {
                unit_price = item.unit_price;
            }

            let calculatedData = await calculateItemDetails(
                unit_price,
                1,
                0,
                "C",
                item.vat_list,
                configurationData.include_tax
            );

            if (item.item_quantity < item.reorder_level) {
                toaster.warning(t("items.current_qty_less"));
            }

            var obj = {
                item_name: item.item_name,
                item_name_ar: item.item_name_ar,
                item_id: item.item_id,
                unit_price: unit_price,
                quantity: 1,
                discount: 0,
                discount_type: "C",
                unit: item.item_unit.label,
                subTotal: calculatedData.total.calculatedSubTotal,
                vatList: calculatedData.vatDetails.taxDetails,
                vat: `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`,
                total: calculatedData.total.calculatedTotal,
                vatPercentage: calculatedData.vatDetails.totalVatPercent,
                allowdesc: item.allowdesc,
                is_serialized: item.is_serialized,
                minimum_price: item.minimum_price,
                cost_price: item.cost_price,
                originalprice: item.price,
                stock: item?.item_quantity?.quantity, // option?.item_quantity?.quantity
                stock_type: item.stock_type,
                is_boxed: item.is_boxed,
            };

            setSavedDatas({
                ...savedDatas,
                cartItems: [...savedDatas.cartItems, obj],
            });

            if (scanType) {
                itemRef.current.focus();
            } else {
                setTimeout(() => {
                    priceRef.current.focus();
                }, 100);
            }
        }
    };

    const deleteCart = (item_id) => {
        let foundinCart = savedDatas.cartItems.findIndex(
            (x) => x.item_id === item_id
        );
        setSavedDatas({
            ...savedDatas,
            cartItems: [
                ...savedDatas.cartItems.slice(0, foundinCart),
                ...savedDatas.cartItems.slice(foundinCart + 1),
            ],
        });
    };

    const editCart = async (e, index, type, validate = false) => {
        var value = validate ? e : e.target.value;

        let olditems = savedDatas.cartItems[index];
        const unit_price = type === "unit_price" ? value : olditems.unit_price;
        const quantity = type === "quantity" ? value : olditems.quantity;
        const discount = type === "discount" ? value : olditems.discount;
        const vatList = olditems.vatList;
        const discount_type = olditems.discount_type;

        if (
            type === "unit_price" ||
            type === "quantity" ||
            type === "discount"
        ) {
            olditems[type] = value;

            let calculatedData = await calculateItemDetails(
                unit_price,
                quantity,
                discount,
                discount_type,
                vatList,
                configurationData.include_tax
            );

            olditems["vatList"] = calculatedData.vatDetails.taxDetails;
            olditems[
                "vat"
            ] = `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`;
            olditems["subTotal"] = calculatedData.total.calculatedSubTotal;
            olditems["total"] = calculatedData.total.calculatedTotal;

            setSavedDatas({
                ...savedDatas,
                cartItems: [
                    ...savedDatas.cartItems.slice(0, index),
                    olditems,
                    ...savedDatas.cartItems.slice(index + 1),
                ],
            });
        } else if (type === "description" || type === "serial") {
            olditems[type] = value;
            setSavedDatas({
                ...savedDatas,
                cartItems: [
                    ...savedDatas.cartItems.slice(0, index),
                    olditems,
                    ...savedDatas.cartItems.slice(index + 1),
                ],
            });
        }
    };

    const updateDiscount = async (index) => {
        let olditems = savedDatas.cartItems[index];
        if (olditems["discount_type"] === "C") {
            olditems["discount_type"] = "P";
        } else {
            olditems["discount_type"] = "C";
        }

        let calculatedData = await calculateItemDetails(
            olditems.unit_price,
            olditems.quantity,
            olditems.discount,
            olditems.discount_type,
            olditems.vatList,
            configurationData.include_tax
        );

        olditems["vatList"] = calculatedData.vatDetails.taxDetails;
        olditems[
            "vat"
        ] = `${calculatedData.vatDetails.totalVatAmount} [${calculatedData.vatDetails.totalVatPercent}%]`;
        olditems["subTotal"] = calculatedData.total.calculatedSubTotal;
        olditems["total"] = calculatedData.total.calculatedTotal;

        setSavedDatas({
            ...savedDatas,
            cartItems: [
                ...savedDatas.cartItems.slice(0, index),
                olditems,
                ...savedDatas.cartItems.slice(index + 1),
            ],
        });
    };

    const validate = (e, index, type) => {
        let value = e.target.value;
        if (type === "unit_price") {
            let olditems = savedDatas.cartItems[index];
            if (isNaN(parseFloat(value))) {
                toaster.error(t("common.valuemustnumber"));
                editCart(olditems.minimum_price, index, "unit_price", true);
            } else if (value < olditems.minimum_price) {
                toaster.warning(t("sales.minimum_price"));
                editCart(olditems.minimum_price, index, "unit_price", true);
            }
        } else if (type === "discount") {
            let olditems = savedDatas.cartItems[index];
            if (isNaN(parseFloat(value))) {
                toaster.error(t("common.valuemustnumber"));
                editCart(0, index, "discount", true);
            } else {
                let totalMinimumPrice =
                    olditems.minimum_price * olditems.quantity;
                let totalUnitPrice =
                    olditems.unit_price * olditems.quantity - value;
                if (totalUnitPrice < totalMinimumPrice) {
                    toaster.warning(t("sales.minimum_price"));
                    editCart(0, index, "discount", true);
                }
            }
        } else {
            if (isNaN(parseFloat(value))) {
                toaster.error(t("common.valuemustnumber"));
                editCart(1, index, type, true);
            }
        }
        return true;
    };

    const quickInsert = (item_id) => {
        if (item_id !== -1) {
            getData(`${GETITEMBYBARCODEORID}/${item_id}`).then((result) => {
                if (result.data) {
                    addToCart(result.data);
                }
            });
        }
        setUseDrawer(false);
    };

    return (
        <Paper sx={{ p: 1 }}>
            <PosDrawer
                open={useDrawer}
                setOpen={setUseDrawer}
                theme={{
                    width: "70%",
                }}
            >
                <AddItems quickRegister={true} quickInsert={quickInsert} />
            </PosDrawer>

            <PosDrawer open={viewPrice} setOpen={setViewPrice}>
                <PriceList item={itemNumber} savedDatas={savedDatas} />
            </PosDrawer>

            <PosDrawer open={openReport} setOpen={setOpenReport}>
                <ReportViewer
                    saleType={saleType}
                    setOpenReport={setOpenReport}
                />
            </PosDrawer>

            <Stack
                direction="row"
                sx={{ mt: 1 }}
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
            >
                <Stack
                    direction="row"
                    sx={{ width: arrangeInterface.width }}
                    spacing={1}
                >
                    <Button
                        size="small"
                        color="secondary"
                        onClick={() => setScanType(!scanType)}
                    >
                        {scanType ? <BarcodeIcon /> : <BorderColorIcon />}
                    </Button>

                    <Autocomplete
                        freeSolo
                        inputValue={query}
                        clearOnEscape={true}
                        fullWidth={true}
                        options={itemList}
                        getOptionLabel={(option) => {
                            let stock =
                                option.stock_type === 1
                                    ? ` / ${t("sales.available_stock")}: ${
                                          option?.item_quantity?.quantity
                                      }`
                                    : "";
                            return `${option.category} / ${option.item_name} [${option.item_name_ar}] ${stock}`;
                        }}
                        onChange={(event, value) => {
                            setQuery("");
                            setItemList([]);
                            if (value) {
                                addToCart(value);
                            }
                        }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    size="small"
                                    label="Start typing Item Name or scan Barcode..."
                                    sx={{
                                        "& .MuiFormLabel-root": {
                                            fontStyle: "italic",
                                        },
                                    }}
                                    inputRef={itemRef}
                                    onChange={(e) => {
                                        let searchItem = e.target.value;
                                        if (
                                            searchItem !== "" ||
                                            searchItem !== null
                                        ) {
                                            setQuery(searchItem);
                                        }
                                        if (!scanType) {
                                            if (searchItem.length > 2) {
                                                getData(
                                                    `${SEARCHSALEITEMLIST}${searchItem}`
                                                ).then((data) => {
                                                    setItemList(data.data);
                                                });
                                            } else {
                                                setItemList([]);
                                            }
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                            if (scanType) {
                                                getData(
                                                    `${GETITEMBYBARCODEORID}/${query}`
                                                ).then((result) => {
                                                    if (result.data) {
                                                        addToCart(result.data);
                                                        setQuery("");
                                                    }
                                                });
                                            }
                                        }
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            );
                        }}
                    />
                </Stack>

                <Stack
                    direction="row"
                    // sx={{ width: arrangeInterface.width }}
                    spacing={1}
                >
                    <PosTooltip title={t("tooltip.add_item")}>
                        <Fab
                            color="secondary"
                            size="small"
                            aria-label="add"
                            onClick={() => setUseDrawer(true)}
                        >
                            <AddIcon />
                        </Fab>
                    </PosTooltip>

                    {saleType === "WORKORDER" || saleType === "QUATATION" ? (
                        <PosTooltip title={t("tooltip.restore_workorder_sale")}>
                            <Fab
                                color="success"
                                size="small"
                                aria-label="add"
                                onClick={() =>
                                    router.get("/sales/workorder_status")
                                }
                            >
                                <SettingsBackupRestoreIcon />
                            </Fab>
                        </PosTooltip>
                    ) : (
                        <PosTooltip title={t("tooltip.restore_suspended_sale")}>
                            <Fab
                                color="success"
                                size="small"
                                aria-label="add"
                                onClick={() => router.get("/sales/suspended")}
                            >
                                <SettingsBackupRestoreIcon />
                            </Fab>
                        </PosTooltip>
                    )}

                    <PosTooltip title={t("tooltip.view_invoice")}>
                        <Fab
                            color="warning"
                            size="small"
                            aria-label="add"
                            onClick={() => {
                                setOpenReport(true);
                            }}
                        >
                            <ReceiptLongRoundedIcon />
                        </Fab>
                    </PosTooltip>

                    {einvoiceisEnabled === "1" && (
                        <PosTooltip title={t("tooltip.e_invoice_details")}>
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="add"
                                onClick={() => router.get("/sales/e_invoice")}
                            >
                                <OnlinePredictionRoundedIcon />
                            </Fab>
                        </PosTooltip>
                    )}

                    {(saleType === "CASHSALERETURN" ||
                        saleType === "CREDITSALERETURN") && (
                        <PosTooltip title={t("tooltip.restore_previus_sale")}>
                            <Fab
                                color="info"
                                size="small"
                                aria-label="add"
                                onClick={() => {
                                    setFindSales(!findSales);
                                }}
                            >
                                <SearchIcon />
                            </Fab>
                        </PosTooltip>
                    )}
                    {saleType === "WORKORDER" || saleType === "QUATATION" ? (
                        <PosTooltip title={t("tooltip.daily_sales")}>
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="add"
                                onClick={() => {
                                    setFindWorkorder(!findWorkorder);
                                }}
                            >
                                <SearchIcon />
                            </Fab>
                        </PosTooltip>
                    ) : (
                        <PosTooltip title={t("tooltip.daily_sales")}>
                            <Fab
                                color="error"
                                size="small"
                                aria-label="add"
                                onClick={() => {
                                    router.get("/sales/daily_sales");
                                }}
                            >
                                <AttachMoneyRoundedIcon />
                            </Fab>
                        </PosTooltip>
                    )}

                    {arrangeInterface.show && (
                        <Stack
                            direction={"row"}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography>B2C</Typography>
                            <PosTooltip title={t("tooltip.sale_type")}>
                                <Switch
                                    color="secondary"
                                    checked={
                                        savedDatas.billType === "B2C"
                                            ? false
                                            : true
                                    }
                                    onChange={(e) => {
                                        var customerInfo =
                                            savedDatas.customerInfo;
                                        if (savedDatas.billType === "B2C") {
                                            if (savedDatas.customerInfo) {
                                                if (
                                                    savedDatas.customerInfo
                                                        .billing_type === 0
                                                ) {
                                                    toaster.error(
                                                        "Selected customer is B2C, For B2B Sale need more details about customer. please edit customer and add once more. "
                                                    );
                                                    customerInfo = null;
                                                }
                                            }
                                        }
                                        setSavedDatas({
                                            ...savedDatas,
                                            customerInfo: customerInfo,
                                            billType: e.target.checked
                                                ? "B2B"
                                                : "B2C",
                                        });
                                    }}
                                />
                            </PosTooltip>
                            <Typography>B2B</Typography>
                        </Stack>
                    )}
                </Stack>
            </Stack>
            {findSales && (
                <FindSales
                    saleType={saleType}
                    setSavedDatas={setSavedDatas}
                    setFindSales={setFindSales}
                />
            )}
            {findWorkorder && <FindWorkorder setFindSales={setFindSales} />}
            <Stack direction="row" spacing={2}>
                <TableContainer sx={{ mt: 1 }}>
                    <Paper variant="outlined" sx={{ ...colorTheme }}>
                        <Table
                            // sx={{ Width: 100 }}
                            stickyHeader
                            size="small"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="left">
                                        {t("common.item")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.price")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.quantity")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.discount")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.unit")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.subtotal")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.tax")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.total")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {savedDatas &&
                                    savedDatas.cartItems
                                        .slice(0)
                                        .reverse()
                                        .map((item, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableRow
                                                        sx={{
                                                            "&:last-child td, &:last-child th":
                                                                {
                                                                    border: 0,
                                                                },
                                                        }}
                                                    >
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            align="left"
                                                            sx={{
                                                                p: 0,
                                                            }}
                                                        >
                                                            <IconButton
                                                                color="secondary"
                                                                aria-label="directions"
                                                                onClick={() => {
                                                                    deleteCart(
                                                                        item.item_id
                                                                    );
                                                                }}
                                                            >
                                                                <DeleteIcon size="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            align="left"
                                                            sx={{
                                                                p: 0,
                                                            }}
                                                            onClick={() => {
                                                                setItemNumber(
                                                                    item.item_id
                                                                );
                                                                setViewPrice(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <p>
                                                                {item.item_name}
                                                                {item.item_name_ar &&
                                                                    ` - ${item.item_name_ar}`}
                                                                <br></br>
                                                                {item.stock_type ===
                                                                    1 &&
                                                                    ` [${
                                                                        item.stock
                                                                    }  ${t(
                                                                        "common.in"
                                                                    )} ${
                                                                        storeData?.location_name_en
                                                                    } - ${
                                                                        storeData?.location_name_ar
                                                                    }]`}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                sx={{
                                                                    maxWidth: 60,
                                                                    p: 0,
                                                                }}
                                                                value={
                                                                    item.unit_price
                                                                }
                                                                inputRef={
                                                                    index === 0
                                                                        ? priceRef
                                                                        : null
                                                                }
                                                                variant="standard"
                                                                onFocus={(
                                                                    event
                                                                ) => {
                                                                    event.target.select();
                                                                }}
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.code ===
                                                                        "Enter"
                                                                    ) {
                                                                        qtyRef.current.focus();
                                                                    }
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    editCart(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index,
                                                                        "unit_price"
                                                                    );
                                                                }}
                                                                onBlur={(e) => {
                                                                    validate(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index,
                                                                        "unit_price"
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                sx={{
                                                                    maxWidth: 60,
                                                                    p: 0,
                                                                }}
                                                                value={
                                                                    item.quantity
                                                                }
                                                                variant="standard"
                                                                inputRef={
                                                                    index === 0
                                                                        ? qtyRef
                                                                        : null
                                                                }
                                                                onFocus={(
                                                                    event
                                                                ) => {
                                                                    event.target.select();
                                                                }}
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.code ===
                                                                        "Enter"
                                                                    ) {
                                                                        discountRef.current.focus();
                                                                    }
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    editCart(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index,
                                                                        "quantity"
                                                                    );
                                                                }}
                                                                onBlur={(e) => {
                                                                    validate(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index,
                                                                        "quantity"
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TextField
                                                                sx={{
                                                                    maxWidth: 60,
                                                                    p: 0,
                                                                }}
                                                                value={
                                                                    item.discount
                                                                }
                                                                variant="standard"
                                                                inputRef={
                                                                    index === 0
                                                                        ? discountRef
                                                                        : null
                                                                }
                                                                onFocus={(
                                                                    event
                                                                ) => {
                                                                    event.target.select();
                                                                }}
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.code ===
                                                                        "Enter"
                                                                    ) {
                                                                        itemRef.current.focus();
                                                                    }
                                                                }}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    editCart(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index,
                                                                        "discount"
                                                                    );
                                                                }}
                                                                onBlur={(e) => {
                                                                    validate(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index,
                                                                        "discount"
                                                                    );
                                                                }}
                                                            />
                                                            <IconButton
                                                                color="info"
                                                                onClick={() =>
                                                                    updateDiscount(
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index
                                                                    )
                                                                }
                                                            >
                                                                {item.discount_type ===
                                                                "P" ? (
                                                                    <PercentIcon />
                                                                ) : (
                                                                    <Typography variant="body1">
                                                                        SAR
                                                                    </Typography>
                                                                )}
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                p: 0,
                                                            }}
                                                            align="center"
                                                        >
                                                            {item.unit}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                p: 0,
                                                            }}
                                                            align="center"
                                                        >
                                                            {item.subTotal}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                p: 0,
                                                            }}
                                                            align="center"
                                                        >
                                                            {item.vat}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                p: 0,
                                                            }}
                                                            align="center"
                                                        >
                                                            {item.total}
                                                        </TableCell>
                                                    </TableRow>
                                                    {item.is_serialized ||
                                                    item.allowdesc ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={2}
                                                            ></TableCell>
                                                            {item.is_serialized ? (
                                                                <>
                                                                    <TableCell align="center">
                                                                        {t(
                                                                            "items.allow_serial_number"
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                    >
                                                                        <TextField
                                                                            fullWidth
                                                                            value={
                                                                                item.serial
                                                                            }
                                                                            variant="standard"
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                editCart(
                                                                                    e,
                                                                                    savedDatas
                                                                                        .cartItems
                                                                                        .length -
                                                                                        1 -
                                                                                        index,
                                                                                    "serial"
                                                                                );
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                </>
                                                            ) : (
                                                                <TableCell
                                                                    colSpan={3}
                                                                ></TableCell>
                                                            )}

                                                            {item.allowdesc ? (
                                                                <>
                                                                    <TableCell align="center">
                                                                        {t(
                                                                            "common.description"
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="center"
                                                                        colSpan={
                                                                            2
                                                                        }
                                                                    >
                                                                        <TextField
                                                                            fullWidth
                                                                            value={
                                                                                item.description
                                                                            }
                                                                            variant="standard"
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                editCart(
                                                                                    e,
                                                                                    savedDatas
                                                                                        .cartItems
                                                                                        .length -
                                                                                        1 -
                                                                                        index,
                                                                                    "description"
                                                                                );
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                </>
                                                            ) : (
                                                                <TableCell
                                                                    colSpan={3}
                                                                ></TableCell>
                                                            )}
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow></TableRow>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                            </TableBody>
                        </Table>
                    </Paper>
                </TableContainer>
            </Stack>
        </Paper>
    );
}

export default React.memo(CartControll);
