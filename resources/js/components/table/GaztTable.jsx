// import React, { useRef } from "react";
// import {
//   Stack,
//   createTheme,
//   ThemeProvider,
//   Select,
//   MenuItem,
//   FormControl,
//   Button,
// } from "@mui/material";
// import PrintIcon from "@mui/icons-material/PrintRounded";
// import ToasterContainer from "../ToasterContainer";
// import ReactToPrint from "react-to-print";
// import CloudSyncTwoToneIcon from "@mui/icons-material/CloudSyncTwoTone";

// import { useState } from "react";
// import { useEffect } from "react";

// function GaztTable({ title, header, url }) {
//   const [status, setStatus] = useState(3);
//   const [type, setType] = useState("B2B");
//   const theme = createTheme({
//     typography: {
//       fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
//     },
//   });
//   const tableRef = useRef();
//   const tableBodyRef = useRef();

//   useEffect(() => {
//     tableRef.current && tableRef.current.onQueryChange();
//   }, [type, status]);

//   const handleChange = (value) => setStatus(value.target.value);

//   const options = {
//     search: false,
//     initialPage: 0,
//     pageSize: 15,
//     pageSizeOptions: [15, 25, 50, 100, 500],
//     padding: "dense",
//     selection: true,
//   };

//   return (
//     <Stack sx={{ m: 1 }}>
//       <ToasterContainer />
//       <ThemeProvider theme={theme}>
//         <MaterialTable
//           tableRef={tableRef}
//           icons={muiTableIcons}
//           localization={localization()}
//           title={title}
//           data={(query) => {
//             return new Promise((resolve, reject) => {
//               let sortField = query.orderBy ? query.orderBy.field : "null";
//               let sortDir =
//                 query.orderDirection !== "" ? query.orderDirection : "null";
//               let searchquery = query.search ? query.search : "null";
//               let dataUrl = `${url}/${query.page + 1}/${
//                 query.pageSize
//               }/${searchquery}/${sortField}/${sortDir}/${type}/${status}`;
//               getData(dataUrl).then((result) => {
//                 resolve({
//                   data: result.data.data,
//                   page: result.data.current_page - 1,
//                   totalCount: result.data.total,
//                 });
//               });
//             });
//           }}
//           columns={header}
//           options={options}
//           components={{
//             Body: (props) => <MTableBody ref={tableBodyRef} {...props} />,
//           }}
//           actions={[
//             {
//               isFreeAction: true,
//               icon: () => (
//                 <FormControl sx={{ minWidth: 160 }} size="small">
//                   <Select value={status} onChange={handleChange}>
//                     <MenuItem value={3}>Pending & Failed</MenuItem>
//                     <MenuItem value={0}>Pending</MenuItem>
//                     <MenuItem value={2}>Failed</MenuItem>
//                     <MenuItem value={1}>Compleeted</MenuItem>
//                   </Select>
//                 </FormControl>
//               ),
//             },
//             {
//               tooltip: "Refresh table data",
//               isFreeAction: true,
//               icon: () => (
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   disabled={type === "B2B" ? true : false}
//                 >
//                   Clearence
//                 </Button>
//               ),
//               onClick: () => setType("B2B"),
//             },
//             {
//               tooltip: "Refresh table data",
//               isFreeAction: true,
//               icon: () => (
//                 <Button
//                   variant="outlined"
//                   color="success"
//                   disabled={type === "B2C" ? true : false}
//                 >
//                   Reporting
//                 </Button>
//               ),
//               onClick: () => setType("B2C"),
//             },
//             {
//               tooltip: "Print",
//               isFreeAction: true,
//               icon: () => (
//                 <ReactToPrint
//                   pageStyle={`@page {size: A4;}`}
//                   trigger={() => <PrintIcon color="error" />}
//                   content={() => tableRef.current}
//                 />
//               ),
//               onClick: () => {
//                 return true;
//               },
//             },
//             {
//               tooltip: "Refresh table data",
//               isFreeAction: true,
//               icon: () => <CloudSyncTwoToneIcon color="warning" />,
//               onClick: () =>
//                 tableRef.current && tableRef.current.onQueryChange(),
//             },
//           ]}
//         ></MaterialTable>
//       </ThemeProvider>
//     </Stack>
//   );
// }

import React, { forwardRef, useEffect, useState } from "react";
import { getData } from "../../apis/apiCalls";
import {
    Stack,
    Button,
    FormControl,
    Select,
    MenuItem,
    CircularProgress,
    Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import ToasterContainer from "../ToasterContainer";
import MUIDataTable from "mui-datatables";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterIcon from "@mui/icons-material/FilterList";
import SaveAlt from "@mui/icons-material/SaveAlt";

import { PosAlert } from "../../Utils/Theming";
import { useTranslation } from "react-i18next";

const GaztTable = forwardRef((props, ref) => {
    const { title, header, url, primaryKey } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    //table status
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(3);
    const [type, setType] = useState("B2B");

    const [pageStatus, setPageStatus] = useState({
        name: primaryKey ? primaryKey : "id",
        direction: "asc",
        query: "null",
        count: 10,
        page: 0,
    });
    const [message, setMessage] = useState(null);
    const { t } = useTranslation();

    const handleTableChange = (action, tableState) => {
        if (action === "sort") {
            setPageStatus({
                ...pageStatus,
                name: tableState.sortOrder.name,
                direction: tableState.sortOrder.direction,
            });
        }
        // if (action === "search") {
        //     setPageStatus({
        //         ...pageStatus,
        //         query: tableState.searchText,
        //     });
        // }
        if (action === "changePage") {
            setPageStatus({
                ...pageStatus,
                page: tableState.page,
                count: tableState.rowsPerPage,
            });
        }
        if (action === "changeRowsPerPage") {
            setPageStatus({
                ...pageStatus,
                page: 0,
                count: tableState.rowsPerPage,
            });
        }
    };

    const apiCall = () => {
        return new Promise((resolve, reject) => {
            let dataUrl = `${url}/${pageStatus.page + 1}/${pageStatus.count}/${
                pageStatus.name
            }/${pageStatus.direction}/${type}/${status}`;

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
    }, [pageStatus, url, type, status]);

    const handleChange = (value) => setStatus(value.target.value);

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
        enableNestedDataAccess: ".",
        count: totalCount,
        // onRowsDelete: deleteWithID,
        onTableChange: handleTableChange,
        customToolbar: () => {
            return (
                <Stack spacing={1} direction={"row"}>
                    <FormControl sx={{ minWidth: 160 }}>
                        <Select
                            size="small"
                            value={status}
                            onChange={handleChange}
                        >
                            <MenuItem value={3}>Pending & Failed</MenuItem>
                            <MenuItem value={0}>Pending</MenuItem>
                            <MenuItem value={2}>Failed</MenuItem>
                            <MenuItem value={1}>Compleeted</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setType("B2B")}
                        disabled={type === "B2B" ? true : false}
                    >
                        Clearence
                    </Button>

                    <Button
                        variant="outlined"
                        color="success"
                        disabled={type === "B2C" ? true : false}
                        onClick={() => setType("B2C")}
                    >
                        Reporting
                    </Button>
                </Stack>
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
            ViewColumnIcon: () => <ViewColumnIcon color="dark" />,
            FilterIcon: () => <FilterIcon color="error" />,
        },
    };

    return (
        <Stack sx={{ m: 1 }}>
            <ToasterContainer />
            <PosAlert message={message} setMessage={setMessage} />

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
                ref={ref}
            />
        </Stack>
    );
});

export default GaztTable;
