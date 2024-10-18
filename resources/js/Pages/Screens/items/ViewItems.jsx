import React, { useRef, useState } from "react";

import Breadcrumb from "../../../components/Breadcrumb";

import { IconButton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";
import BarcodeView from "./Barcode";
import { DELETEITEMS, GETALLITEMS } from "../../../constants/apiUrls";
import PosDrawer from "../../../components/PosDrawer";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InventoryHistory from "./support/InventoryHistory";
import { IconBarcode, IconEdit } from "@tabler/icons-react";
import TableHelper from "../../../components/table/TableHelper";
import { router } from "@inertiajs/react";
function ViewItems() {
    const [showBarcode, setshowBarcode] = useState(false);
    const [viewPrice, setViewPrice] = useState(false);
    const [itemNumber, setItemNumber] = useState(false);
    const [count, setCount] = useState(0);

    const { t } = useTranslation();
    const title = t("tables.items_list");
    const [barcodeValue, setBarcodeValue] = useState("");

    const tableRef = useRef();

    const header = [
        {
            name: "barcode",
            label: t("items.barcode"),
        },
        {
            name: "item_name",
            label: t("tables.full_name"),
        },
        {
            name: "item_name_ar",
            label: t("tables.full_name_arabic"),
        },
        {
            name: "category",
            label: t("tables.category"),
        },
        {
            name: "cost_price",
            label: t("tables.cost"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "unit_price",
            label: t("tables.price"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "wholesale_price",
            label: t("tables.wholesale"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "quantity",
            label: t("common.quantity"),
        },
        {
            name: "encrypted_item",
            label: " ",
            options: {
                print: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Stack
                            direction={"row"}
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                style={{ padding: "0 5px 0 5px" }}
                                component="span"
                                variant="contained"
                                sx={{ borderRadius: 0 }}
                                onClick={() => {
                                    let item = {
                                        item_id: value,
                                        barcode: tableMeta?.rowData[0],
                                        item_name: tableMeta?.rowData[1],
                                        item_name_ar: tableMeta?.rowData[2],
                                        category: tableMeta?.rowData[3],
                                        unit_price: tableMeta?.rowData[5],
                                    };

                                    setBarcodeValue(item);
                                    setshowBarcode(true);
                                }}
                            >
                                <IconBarcode color="#ff33cc" />
                            </IconButton>

                            <IconButton
                                style={{ padding: "0 5px 0 5px" }}
                                component="span"
                                onClick={() => {
                                    setItemNumber(value);
                                    setViewPrice(true);
                                }}
                            >
                                <ListAltIcon
                                    variant="outlined"
                                    color="warning"
                                />
                            </IconButton>

                            <IconButton
                                color="primary"
                                component="span"
                                style={{ padding: "0 5px 0 5px" }}
                                onClick={() => {
                                    router.get(`/items/edit_item/${value}`);
                                }}
                            >
                                <IconEdit />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];

    return (
        <Stack>
            <Breadcrumb labelHead="Item" labelSub="Add/Edit Item" />

            <PosDrawer open={viewPrice} setOpen={setViewPrice}>
                <InventoryHistory item={itemNumber} />
            </PosDrawer>

            <PosDrawer
                open={showBarcode}
                setOpen={setshowBarcode}
                theme={{
                    width: "25%",
                }}
            >
                <BarcodeView
                    value={barcodeValue}
                    updateTable={() => {
                        tableRef?.current?.changePage(
                            tableRef?.current?.state?.page
                        );
                    }}
                />
            </PosDrawer>

            <TableHelper
                title={title}
                header={header}
                url={GETALLITEMS}
                deleteURL={DELETEITEMS}
                excel="ITEM"
                primaryKey="item_name"
                newLink="/items/add_items"
                new_text="add_items"
                ref={tableRef}
            />
        </Stack>
    );
}

export default ViewItems;
