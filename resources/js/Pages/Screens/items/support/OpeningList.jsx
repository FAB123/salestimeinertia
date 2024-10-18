import React, { useState, useEffect } from "react";
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
    Pagination,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import { getData, postData } from "../../../../apis/apiCalls";
import { SAVEITEMOB } from "../../../../constants/apiUrls";

function OpeningList({ cartItems, setCartItems, setQuery }) {
    const { t } = useTranslation();

    const editCart = (value, index, type) => {
        let item = cartItems[index];
        item[type] = value;
        setCartItems([
            ...cartItems.slice(0, index),
            item,
            ...cartItems.slice(index + 1),
        ]);
    };

    const saveItem = (index) => {
        let item = cartItems[index];
        postData(SAVEITEMOB, { item: [item] }).then((response) =>
            setCartItems(response.items.data)
        );
    };

    return (
        <>
            <Stack direction="row" sx={{ mt: 1 }} spacing={2}>
                <Stack sx={{ width: "50%" }}>
                    <TextField
                        size="small"
                        label="Start typing Item Name or scan Barcode..."
                        autoFocus={true}
                        fullWidth={true}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}
                    />
                </Stack>
                {/* <Stack sx={{ width: "50%" }}>
                    <Pagination
                        // className={classes.pagination}
                        // count={props.totalPage}
                        color="primary"
                    />
                </Stack> */}
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
                                    <TableCell align="left">Item</TableCell>
                                    <TableCell align="center">COST</TableCell>
                                    <TableCell align="center">
                                        Quantity
                                    </TableCell>
                                    <TableCell align="center">Unit</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item, index) => {
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
                                                    {item.item_name} -{" "}
                                                    {item.item_name_ar}
                                                </TableCell>

                                                <TableCell align="center">
                                                    <TextField
                                                        sx={{ maxWidth: 60 }}
                                                        value={item.cost_price}
                                                        variant="standard"
                                                        onChange={(e) => {
                                                            editCart(
                                                                e.target.value,
                                                                index,
                                                                "cost_price"
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        sx={{ maxWidth: 60 }}
                                                        value={item.quantity}
                                                        variant="standard"
                                                        onChange={(e) => {
                                                            editCart(
                                                                e.target.value,
                                                                index,
                                                                "quantity"
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item.unit_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item.cost_price *
                                                        item.quantity}
                                                </TableCell>
                                                <TableCell width={10}>
                                                    <IconButton
                                                        color="secondary"
                                                        // disabled={item.quantity < 1 && true}
                                                        onClick={() =>
                                                            saveItem(index)
                                                        }
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
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
        </>
    );
}

export default React.memo(OpeningList);
