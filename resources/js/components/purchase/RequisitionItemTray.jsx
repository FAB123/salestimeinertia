import React, { useRef, useState } from "react";
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
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarcodeIcon from "../sales/BarcodeIcon";

import { getData } from "../../apis/apiCalls";

import toaster from "../../helpers/toaster";
import {
    GETITEMBYBARCODEORID,
    SEARCHPURCHASEITEMLIST,
} from "../../constants/apiUrls";

function RequisitionItemTray({ savedDatas, setSavedDatas, storeData }) {
    const { t } = useTranslation();

    const [itemList, setItemList] = useState([]);
    const [query, setQuery] = useState("");
    const [scanType, setScanType] = useState(false);
    const itemRef = useRef();

    const addToCart = async (item) => {
        let foundinCart = savedDatas.cartItems.findIndex(
            (x) => x.item_id === item.item_id
        );

        if (foundinCart !== -1) {
            let olditems = savedDatas.cartItems[foundinCart];
            let new_quantity = parseFloat(olditems["quantity"]) + 1;
            olditems["quantity"] = new_quantity;
            olditems["total"] = parseFloat(olditems.cost_price) * new_quantity;

            setSavedDatas({
                ...savedDatas,
                cartItems: [
                    ...savedDatas.cartItems.slice(0, foundinCart),
                    olditems,
                    ...savedDatas.cartItems.slice(foundinCart + 1),
                ],
            });
        } else {
            var obj = {
                item_name: item.item_name,
                item_name_ar: item.item_name_ar,
                item_id: item.item_id,
                cost_price: item.cost_price,
                quantity: 1,
                unit: item.item_unit.label,
                total: item.cost_price,
                stock: item?.item_quantity?.quantity,
                stock_type: item.stock_type,
                is_boxed: item.is_boxed,
            };

            setSavedDatas({
                ...savedDatas,
                cartItems: [...savedDatas.cartItems, obj],
            });
        }
    };

    const editCart = async (e, index, validate = false) => {
        var value = validate ? e : e.target.value;
        let olditems = savedDatas.cartItems[index];

        olditems["quantity"] = value;
        olditems["total"] = parseFloat(olditems.cost_price) * parseFloat(value);

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
        if (isNaN(parseFloat(value))) {
            toaster.error(t("common.valuemustnumber"));
            editCart(1, index, type, true);
        }
        return true;
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
    return (
        <Stack sx={{ mt: 1, p: 2 }} spacing={2}>
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
            </Stack>
            <Stack direction="row" spacing={2}>
                <TableContainer sx={{ mt: 1 }}>
                    <Paper variant="outlined">
                        <Table
                            sx={{ Width: 100 }}
                            stickyHeader
                            size="small"
                            aria-label="a dense table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="left">Item</TableCell>
                                    <TableCell align="center">Cost</TableCell>
                                    <TableCell align="center">
                                        Quantity
                                    </TableCell>
                                    <TableCell align="center">Unit</TableCell>
                                    <TableCell align="center">Total</TableCell>
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
                                                                { border: 0 },
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
                                                            {item.cost_price}
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
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    editCart(
                                                                        e,
                                                                        savedDatas
                                                                            .cartItems
                                                                            .length -
                                                                            1 -
                                                                            index
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
                                                            {item.unit}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {item.total}
                                                        </TableCell>
                                                    </TableRow>
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

export default React.memo(RequisitionItemTray);
