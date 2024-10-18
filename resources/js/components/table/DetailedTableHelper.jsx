import React, { forwardRef, useEffect, useState } from "react";

import {
    Stack,
    CircularProgress,
    Typography,
    TableRow,
    TableCell,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import MUIDataTable from "mui-datatables";
import SearchIcon from "@mui/icons-material/Search";
import SaveAlt from "@mui/icons-material/SaveAlt";
import { useTranslation } from "react-i18next";
import SuspendDetails from "./SuspendDetails";
import { getData } from "../../apis/apiCalls";

function DetailedTableHelper(props, tableRef) {
    const { title, header, url, primaryKey } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    //table status
    const [data, setData] = useState([]);

    const [pageStatus, setPageStatus] = useState({
        name: primaryKey ? primaryKey : "id",
        direction: "asc",
        query: "null",
        count: 10,
        page: 0,
    });

    const { t } = useTranslation();

    const handleTableChange = (action, tableState) => {
        if (action === "sort") {
            setPageStatus({
                ...pageStatus,
                name: tableState.sortOrder.name,
                direction: tableState.sortOrder.direction,
            });
        }
        if (action === "search") {
            setPageStatus({
                ...pageStatus,
                query: tableState.searchText,
            });
        }
        if (action === "changePage") {
            setPageStatus({
                ...pageStatus,
                page: tableState.page,
                count: tableState.rowsPerPage,
            });
        }
    };

    const apiCall = () => {
        return new Promise((resolve, reject) => {
            let dataUrl = `${url}/${pageStatus.page + 1}/${pageStatus.count}/${
                pageStatus.query
            }/${pageStatus.name}/${pageStatus.direction}`;
            getData(dataUrl).then((result) => {
                resolve({
                    data: result.data.data,
                    page: result.data.current_page - 1,
                    totalCount: result.data.total,
                });
            });
        });
    };

    useEffect(() => {
        setIsLoading(true);
        apiCall()
            .then(({ data, page, totalCount }) => {
                setData(data);
                setTotalCount(parseInt(totalCount));
                // setPage(page);
            })
            .finally(setIsLoading(false));
    }, [pageStatus]);

    const options = {
        filter: false,
        confirmFilters: true,
        elevation: 8,
        jumpToPage: true,
        responsive: "simple",
        rowHover: true,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 25, 50, 100, 500],
        searchPlaceholder: "Search",
        serverSide: true,
        viewColumns: false,
        enableNestedDataAccess: ".",
        count: totalCount,
        onTableChange: handleTableChange,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData) => {
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        <SuspendDetails id={rowData[0]} />
                    </TableCell>
                </TableRow>
            );
        },

        setTableProps: () => ({
            size: "small",
        }),
        textLabels: {
            body: {
                noMatch: t("common.norecord"),
                toolTip: "Sort",
                columnHeaderTooltip: (column) => `Sort for ${column.label}`,
            },
            pagination: {
                next: t("table.nextAriaLabel"),
                previous: t("table.previousAriaLabel"),
                rowsPerPage: t("table.labelRowsPerPage"),
                displayRows: t("table.labelDisplayedRows"),
            },
            toolbar: {
                search: t("table.searchPlaceholder"),
                downloadCsv: "Download CSV",
                print: "Print",
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            filter: {
                all: "All",
                title: "FILTERS",
                reset: "RESET",
            },
            viewColumns: {
                title: t("table.showColumnsTitle"),
                titleAria: "Show/Hide Table Columns",
            },
            selectedRows: {
                text: t("table.nRowsSelected"),
                delete: t("common.delete"),
                deleteAria: t("common.deleteText"),
            },
        },
    };

    const components = {
        icons: {
            SearchIcon: () => <SearchIcon color="primary" />,
            PrintIcon: () => <PrintIcon color="secondary" />,
            DownloadIcon: () => <SaveAlt color="warning" />,
        },
    };

    return (
        <Stack sx={{ m: 1 }}>
            <MUIDataTable
                title={
                    <Typography variant="h6">
                        {title}
                        {isLoading && (
                            <CircularProgress
                                size={24}
                                style={{
                                    marginLeft: 15,
                                    position: "relative",
                                    top: 4,
                                }}
                            />
                        )}
                    </Typography>
                }
                data={data}
                columns={header}
                options={options}
                components={components}
            />
        </Stack>
    );
}

export default forwardRef(DetailedTableHelper);
