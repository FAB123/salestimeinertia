import React from "react";
import {
    Box,
    Grid,
    Pagination,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    Typography,
} from "@mui/material";
import { t } from "i18next";

import { useEffect } from "react";
import { useState } from "react";
import { getData } from "../../../../apis/apiCalls";
import { GETINVENTORYDETAILS } from "../../../../constants/apiUrls";
import ProgressLoader from "../../../../components/ProgressLoader";
import Moment from "react-moment";

function InventoryHistory({ item }) {
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalpage, setTotalPage] = useState(0);

    const handleChangePage = (e, page) => {
        setPage(page);
    };

    useEffect(() => {
        setDisableSubmit(true);
        getData(`${GETINVENTORYDETAILS}/${item}/${page + 1}`)
            .then((response) => {
                if (response.data.data) {
                    setData(response.data.data);
                    setTotalPage(response.data.total);
                }
            })
            .finally(() => setDisableSubmit(false));
    }, [page]);

    return (
        <Box>
            <ProgressLoader open={disableSubmit} />
            <Paper elevation={10} sx={{ p: 1, m: 1, mt: 2 }}>
                <Typography align="center" sx={{ m: 2 }}>
                    {t("sales.item_details")}
                </Typography>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow />
                        <TableCell align="left">{t("common.date")}</TableCell>
                        <TableCell align="center">{`${t(
                            "common.sale_id"
                        )} / ${t("common.purchase_id")}`}</TableCell>
                        <TableCell align="center">
                            {t("common.quantity")}
                        </TableCell>
                        <TableCell align="right">
                            {t("common.location")}
                        </TableCell>
                        <TableRow />
                    </TableHead>
                    <TableBody>
                        {data &&
                            data.map((item, index) => {
                                return (
                                    //   {new Date(
                                    //     item.created_at
                                    // ).toLocaleString('en-GB')}
                                    <TableRow key={index}>
                                        <TableCell align="left">
                                            <Moment
                                                locale="en"
                                                format="DD-MM-YYYY hh:mm A"
                                            >
                                                {new Date(item.created_at)}
                                            </Moment>
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.trans_comment}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.location_name_en}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={totalpage}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    onPageChange={handleChangePage}
                    rowsPerPage={15}
                    rowsPerPageOptions={[15]}
                />
            </Paper>
        </Box>
    );
}

export default InventoryHistory;
