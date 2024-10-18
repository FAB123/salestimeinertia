import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getData } from "../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";



function ExpandedItem({ detailed, id }) {
    const [data, setDate] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        getData(`${detailed.url}/${id}`).then((response) => {
            console.log(response);
            if (response.status) {
                setDate(response.data.cartItems);
            }
        });
    }, []);
    return (
        <TableContainer component={Paper}>
            <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="detailed_table"
            >
                <TableHead>
                    <TableRow
                        sx={{
                            // backgroundColor: theme.palette.primary.main,
                            backgroundColor: '#a345f5'
                        }}
                    >
                        {detailed.header.map((item) => (
                            <TableCell sx={{ color: "#fff" }}>
                                {t(`common.${item}`)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            {detailed.header.map((header) => (
                                <TableCell component="th" scope="row">
                                    {item[header]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ExpandedItem;
