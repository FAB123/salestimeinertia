import React, { useEffect, useRef, useState } from "react";
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
    Fab,
    Typography,
    Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { getData } from "../../apis/apiCalls";

import { calculateItemDetails } from "../../helpers/TaxHelper";

import toaster from "../../helpers/toaster";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
    GETITEMBYBARCODEORID,
    SEARCHPURCHASEITEMLIST,
} from "../../constants/apiUrls";

import PercentIcon from "@mui/icons-material/Percent";

import FileUpload from "../../components/FileUpload";
import AddItems from "../../Pages/Screens/items/AddItems";
import PosDrawer from "../../components/PosDrawer";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarcodeIcon from "../sales/BarcodeIcon";

// import "./animation.css";

function PurchaseItemTray({ savedDatas, setSavedDatas, storeData }) {
    const { t } = useTranslation();

    const [itemList, setItemList] = useState([]);
    const [query, setQuery] = useState("");
    const [show, setShow] = useState(false);
    const [cropData, setCropData] = useState(null);
    // const [checkImageEdited, setcheckImageEdited] = useState(false);
    const [useDrawer, setUseDrawer] = useState(false);
    const [scanType, setScanType] = useState(false);

    const itemRef = useRef();
    const qtyRef = useRef();
    const costRef = useRef();
    const discountRef = useRef();

    const addToCart = async (item) => {
        let foundinCart = savedDatas.cartItems.findIndex(
            (x) => x.item_id === item.item_id
        );

        if (foundinCart !== -1) {
            let olditems = savedDatas.cartItems[foundinCart];

            let new_quantity = parseFloat(olditems["quantity"]) + 1;
            let new_cost_price = olditems.cost_price;
            let new_discount = olditems.discount;
            let new_discount_type = olditems.discount_type;

            let calculatedData = await calculateItemDetails(
                new_cost_price,
                new_quantity,
                new_discount,
                new_discount_type,
                olditems.vatList,
                savedDatas.include_tax
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
            let calculatedData = await calculateItemDetails(
                item.cost_price,
                1,
                0,
                "C",
                item.vat_list,
                savedDatas.include_tax
            );

            var obj = {
                item_name: item.item_name,
                item_name_ar: item.item_name_ar,
                item_id: item.item_id,
                cost_price: item.cost_price,
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
                stock: item?.item_quantity?.quantity,
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
                    qtyRef.current.focus();
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
        const cost_price = type === "cost_price" ? value : olditems.cost_price;
        const quantity = type === "quantity" ? value : olditems.quantity;
        const discount = type === "discount" ? value : olditems.discount;
        const vatList = olditems.vatList;
        const discount_type = olditems.discount_type;

        if (
            type === "cost_price" ||
            type === "quantity" ||
            type === "discount"
        ) {
            olditems[type] = value;

            let calculatedData = await calculateItemDetails(
                cost_price,
                quantity,
                discount,
                discount_type,
                vatList,
                savedDatas.include_tax
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

    const validate = (e, index, type) => {
        if (isNaN(parseFloat(e.target.value))) {
            toaster.error(t("common.valuemustnumber"));
            editCart(1, index, type, true);
        }
        return true;
    };

    const updateDiscount = async (index) => {
        let olditems = savedDatas.cartItems[index];
        if (olditems["discount_type"] === "C") {
            olditems["discount_type"] = "P";
        } else {
            olditems["discount_type"] = "C";
        }

        let calculatedData = await calculateItemDetails(
            olditems.cost_price,
            olditems.quantity,
            olditems.discount,
            olditems.discount_type,
            olditems.vatList,
            savedDatas.include_tax
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

    useEffect(() => {
        cropData &&
            setSavedDatas({
                ...savedDatas,
                invoiceImage: cropData,
            });
    }, [cropData]);

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
        // <div className="cart_box">
        //   <span className="animate_top"></span>
        //   <span className="animate_right"></span>
        //   <span className="animate_bottom"></span>
        //   <span className="animate_left"></span>

        <Stack sx={{ mt: 1, p: 2 }}>
            <FileUpload
                setCropData={setCropData}
                setcheckImageEdited={false}
                show={show}
                handleClose={() => setShow(false)}
            />

            <PosDrawer
                open={useDrawer}
                setOpen={setUseDrawer}
                theme={{ width: "70%" }}
            >
                <AddItems quickRegister={true} quickInsert={quickInsert} />
            </PosDrawer>
            <Stack
                direction={"row"}
                sx={{ mt: 1 }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
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
                    sx={{ width: "100%" }}
                    inputValue={query}
                    clearOnEscape={true}
                    options={itemList}
                    getOptionLabel={(option) => {
                        let item =
                            option.stock_type === 1
                                ? ` / Available Stock: ${option?.item_quantity?.quantity}`
                                : "";
                        return `${option.category} / ${option.item_name} ${item}`;
                    }}
                    onChange={(event, value) => {
                        setQuery("");
                        setItemList([]);
                        if (value) {
                            addToCart(value);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            label="Start typing Item Name or scan Barcode..."
                            inputRef={itemRef}
                            onChange={(e) => {
                                let searchItem = e.target.value;
                                if (searchItem !== "" || searchItem !== null) {
                                    setQuery(searchItem);
                                }
                                if (searchItem.length > 2) {
                                    getData(
                                        `${SEARCHPURCHASEITEMLIST}${searchItem}`
                                    ).then((data) => {
                                        setItemList(data.data);
                                    });
                                } else {
                                    setItemList([]);
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
                    )}
                />
                <Fab
                    color="warning"
                    size="small"
                    aria-label="add"
                    onClick={() => setShow(true)}
                >
                    <UploadFileIcon />
                </Fab>

                <Fab
                    color="secondary"
                    size="small"
                    aria-label="add"
                    onClick={() => setUseDrawer(true)}
                >
                    <AddIcon />
                </Fab>
            </Stack>
            <Stack direction="row" spacing={2}>
                <TableContainer
                    sx={{ mt: 1 }}
                    // style={{ minHeight: "65vh", maxHeight: "65vh" }}
                >
                    <Paper variant="outlined">
                        <Table sx={{ Width: 100 }} stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="left">
                                        {t("common.item")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.quantity")}
                                    </TableCell>
                                    <TableCell align="center">
                                        {t("common.cost_price")}
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
                            <TableBody
                            // style={{
                            //   overflowY: "scroll",
                            //   minHeight: "70vh",
                            //   maxHeight: "70vh",
                            // }}
                            >
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
                                                        >
                                                            <IconButton
                                                                color="error"
                                                                aria-label="directions"
                                                                onClick={() => {
                                                                    deleteCart(
                                                                        item.item_id
                                                                    );
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            align="left"
                                                        >
                                                            {item.item_name}
                                                            {item.item_name_ar &&
                                                                ` - ${item.item_name_ar}`}
                                                            {item.stock_type ===
                                                                1 &&
                                                                ` [${
                                                                    item.stock
                                                                }  ${t(
                                                                    "common.in"
                                                                )} ${
                                                                    storeData?.location_name_en
                                                                }]`}
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <TextField
                                                                sx={{
                                                                    maxWidth: 60,
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
                                                                        costRef.current.focus();
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
                                                                }}
                                                                value={
                                                                    item.cost_price
                                                                }
                                                                variant="standard"
                                                                inputRef={
                                                                    index === 0
                                                                        ? costRef
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
                                                                        "cost_price"
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
                                                                        "cost_price"
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <TextField
                                                                sx={{
                                                                    maxWidth: 60,
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
                                                        <TableCell align="center">
                                                            {item.unit}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.subTotal}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.vat}
                                                        </TableCell>
                                                        <TableCell align="center">
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
                                                                        Serial
                                                                        Number
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
                                                                        Description
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
        </Stack>
    );
}

export default React.memo(PurchaseItemTray);
