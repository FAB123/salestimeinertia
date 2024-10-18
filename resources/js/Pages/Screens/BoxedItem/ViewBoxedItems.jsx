import React, { useState } from "react";

import Breadcrumb from "../../../components/Breadcrumb";
import DeleteButton from "@mui/icons-material/DeleteRounded";
import { IconButton, Stack } from "@mui/material";
import Barcode from "@mui/icons-material/ViewHeadline";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";
import TableHelper from "../../../components/table/TableHelper";

import BarcodeView from "../items/Barcode";
import { DELETEITEMS, GETALLBOXEDITEMS } from "../../../constants/apiUrls";
import PosDrawer from "../../../components/PosDrawer";

import { IconBarcode, IconEdit } from "@tabler/icons-react";
import { router } from "@inertiajs/react";

function ViewBoxedItems() {
    const [showBarcode, setshowBarcode] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState("");
    const { t } = useTranslation();
    const title = t("tables.items_list");

    const header = [
        {
            name: "item_name",
            label: t("tables.full_name"),
        },

        {
            name: "item_name_ar",
            label: t("tables.full_name_arabic"),
        },
        {
            name: "barcode",
            label: t("items.barcode"),
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
            name: "encrypted_item",
            label: " ",
            options: {
                print: false,
                customBodyRender: (value) => {
                    return (
                        <Stack
                            direction={"row"}
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                style={{ padding: "0 5px 0 5px" }}
                                component="span"
                                onClick={() => {
                                    setBarcodeValue(value);
                                    setshowBarcode(true);
                                }}
                            >
                                {/* <Barcode variant="outlined" color="primary" /> */}
                                <IconBarcode />
                            </IconButton>

                            <IconButton
                                color="primary"
                                component="span"
                                style={{ padding: "0 5px 0 5px" }}
                                onClick={() => {
                                    router.get(
                                        `/bundleditems/edit_bundleditems/${value}`
                                    );
                                }}
                            >
                                <IconEdit />
                            </IconButton>

                            <IconButton
                                style={{ padding: "0 5px 0 5px" }}
                                component="span"
                            >
                                <DeleteButton
                                    variant="outlined"
                                    color="secondary"
                                />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];

    return (
        <Stack>
            <Breadcrumb
                labelHead="Boxed Items"
                labelSub="Add/Edit Boxed Items"
            />
            <PosDrawer
                open={showBarcode}
                setOpen={setshowBarcode}
                theme={{
                    width: "20%",
                }}
            >
                <BarcodeView value={barcodeValue} />
            </PosDrawer>

            <TableHelper
                title={title}
                header={header}
                url={GETALLBOXEDITEMS}
                deleteURL={DELETEITEMS}
                primaryKey="item_name"
                newLink="/bundleditems/add_bundleditems"
                excel={null}
                new_text="add_items"
            />
        </Stack>
    );
}

export default ViewBoxedItems;
