import React, { forwardRef, useEffect, useState } from "react";
import { getData, postData } from "../../apis/apiCalls";
import {
    Stack,
    Tooltip,
    IconButton,
    CircularProgress,
    Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import { exportToEXCEL } from "../../helpers/GeneralHelper";
import ToasterContainer from "../ToasterContainer";
import MUIDataTable from "mui-datatables";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import toaster from "../../helpers/toaster";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/ArrowDownward";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterIcon from "@mui/icons-material/FilterList";
import SaveAlt from "@mui/icons-material/SaveAlt";

import { FileUploader } from "../mui";

import { PosAlert } from "../../Utils/Theming";
import { useTranslation } from "react-i18next";

function TableHelper(props, tableRef) {
    const { title, header, url, deleteURL, type, newLink } = props;
    const [showHideUploader, setShowHideUploader] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [message, setMessage] = useState(null);
    const { t } = useTranslation();

    const deleteWithID = (ids) => {
        if (window.confirm("Are You Sure?")) {
            postData(deleteURL, ids).then((resp) => {
                resp.status
                    ? toaster.success(resp.message)
                    : toaster.error(resp.message);
            });
            tableRef.current && tableRef.current.onQueryChange();
        }
    };

    const generateExcel = (query) => {
        let sortField = query.orderBy ? query.orderBy : "null";
        let sortDir =
            query.orderDirection !== "" ? query.orderDirection : "null";
        let searchquery = query.search !== "" ? query.search : "null";
        url = `${url}/0/3000/${searchquery}/${sortField}/${sortDir}`;
        exportToEXCEL(url, "Download");
    };

    const columns = [
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "company",
            label: "Company",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "city",
            label: "City",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "state",
            label: "State",
            options: {
                filter: true,
                sort: false,
            },
        },
    ];

    const apiCall = (
        sortField = "null",
        sortDir = "null",
        searchquery = "null",
        pageSize = 10
    ) => {
        return new Promise((resolve, reject) => {
            let dataUrl = `${url}/${page}/${pageSize}/${searchquery}/${sortField}/${sortDir}`;
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
                setCount(parseInt(totalCount));
                setPage(page);
            })
            .finally(setIsLoading(false));
    }, []);

    const options = {
        filterType: "dropdown",
        confirmFilters: true,
        elevation: 8,
        jumpToPage: true,
        responsive: "simple",
        rowHover: true,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 25, 50, 100, 500],
        searchPlaceholder: "Search",
        serverSide: true,
        enableNestedDataAccess: ".",
        // count: { count },
        onRowsDelete: (rowsDeleted) => {
            console.log(data[rowsDeleted.data[0].index]);
        },
        customToolbar: () => {
            return (
                <>
                    <Tooltip title="custom icon">
                        <IconButton onClick={() => alert("he")}>
                            <AddCircleOutlineRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="custom icon">
                        <IconButton onClick={() => alert("he")}>
                            <SaveAlt />
                        </IconButton>
                    </Tooltip>
                </>
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
        onTableChange: (action, tableState) => {
            console.log(action, tableState);
        },
    };

    const components = {
        icons: {
            SearchIcon: () => <SearchIcon color="primary" />,
            PrintIcon: () => <PrintIcon color="secondary" />,
            DownloadIcon: () => <SaveAlt color="warning" />,
            ViewColumnIcon: () => <ViewColumnIcon color="success" />,
            FilterIcon: () => <FilterIcon color="error" />,
        },
    };

    return (
        <Stack sx={{ m: 1 }}>
            <ToasterContainer />
            <PosAlert message={message} setMessage={setMessage} />

            <FileUploader
                showHideUploader={showHideUploader}
                setShowHideUploader={setShowHideUploader}
                type={type}
            />

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
                columns={columns}
                options={options}
                components={components}
            />

            {/* <ThemeProvider theme={theme}>
                <MaterialTable
                    tableRef={tableRef}
                    icons={muiTableIcons}
                    localization={localization()}
                    title={title}
                    data={(query) => {
                        return new Promise((resolve, reject) => {
                            let sortField = query.orderBy
                                ? query.orderBy.field
                                : "null";
                            let sortDir =
                                query.orderDirection !== ""
                                    ? query.orderDirection
                                    : "null";
                            let searchquery = query.search
                                ? query.search
                                : "null";

                            let dataUrl = `${url}/${query.page + 1}/${
                                query.pageSize
                            }/${searchquery}/${sortField}/${sortDir}`;
                            getData(dataUrl).then((result) => {
                                resolve({
                                    data: result.data.data,
                                    page: result.data.current_page - 1,
                                    totalCount: result.data.total,
                                });
                            });
                        });
                    }}
                    columns={header}
                    options={options}
                    actions={[
                        {
                            tooltip: "Remove All Selected Users",
                            icon: "delete",
                            onClick: (evt, data) => {
                                console.log(data);

                                setMessage(
                                    "You want to delete " +
                                        data.length +
                                        " rows"
                                );
                                // deleteWithID(data);
                            },
                        },
                        {
                            tooltip: "Print",
                            isFreeAction: true,
                            icon: () => (
                                <ReactToPrint
                                    pageStyle={`@page {size: A4;}`}
                                    trigger={() => <PrintIcon color="info" />}
                                    content={() => tableRef.current}
                                />
                            ),
                            onClick: () => {
                                return true;
                            },
                        },
                        {
                            tooltip: "Export all items to Excel",
                            isFreeAction: true,
                            icon: () => <TextSnippetIcon color="success" />,
                            onClick: () =>
                                generateExcel(tableRef.current.state.query),
                        },
                        {
                            tooltip: "Import items From Excel",
                            isFreeAction: true,
                            hidden: type ? false : true,
                            icon: () => <FilePresentIcon color="warning" />,
                            onClick: () => {
                                setShowHideUploader(true);
                            },
                        },
                        {
                            tooltip: "Add New Item",
                            isFreeAction: true,
                            icon: () => (
                                <AddCircleOutlineRoundedIcon color="secondary" />
                            ),
                            onClick: () => {
                                navigate(newLink);
                            },
                        },
                    ]}
                ></MaterialTable>
            </ThemeProvider> */}
        </Stack>
    );
}

export default forwardRef(TableHelper);
