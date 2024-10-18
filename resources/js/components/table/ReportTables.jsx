import React, { useEffect, useState } from "react";
import { getData } from "../../apis/apiCalls";
import {
    IconButton,
    Stack,
    Table,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterIcon from "@mui/icons-material/FilterList";
import SaveAlt from "@mui/icons-material/SaveAlt";
import { exportToEXCEL } from "../../helpers/GeneralHelper";
import { toCurrency } from "../../constants/constants";
import { useTranslation } from "react-i18next";
import MUIDataTable from "mui-datatables";
import ExpandedItem from "./ExpandedItem";

function ReportTables({
    title,
    primaryKey,
    header,
    url,
    type,
    detailed,
    customToolbar,
}) {
    const { t } = useTranslation();
    const [totalData, setTotalData] = useState(null);
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

    const generateExcel = () => {
        let dataUrl = `${url}/0/30000/${pageStatus.name}/${pageStatus.direction}`;
        exportToEXCEL(dataUrl, "Download");
    };

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
            }/${pageStatus.direction}`;
            getData(dataUrl).then((result) => {
                resolve({
                    data: result.data.data,
                    summary: result.summary_data,
                    page: result.data.current_page - 1,
                    totalCount: result.data.total,
                });
            });
        });
    };

    useEffect(() => {
        setIsLoading(true);
        apiCall()
            .then(({ data, page, totalCount, summary }) => {
                setData(data);
                setTotalCount(parseInt(totalCount));
                // setPage(page);
                if (summary) {
                    setTotalData(summary);
                }
            })
            .finally(setIsLoading(false));
    }, [pageStatus, url]);

    const options = {
        filter: false,
        confirmFilters: true,
        elevation: 8,
        jumpToPage: true,
        responsive: "simple",
        selectableRows: "none",
        rowHover: true,
        rowsPerPage: pageStatus?.count,
        rowsPerPageOptions: [10, 25, 50, 100, 500],
        search: false,
        serverSide: true,
        enableNestedDataAccess: ".",
        count: totalCount,

        expandableRows: detailed ? true : false,
        expandableRowsHeader: detailed ? false : true,
        expandableRowsOnClick: detailed ? false : true,
        renderExpandableRow: (rowData) => {
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    {detailed && (
                        <TableCell colSpan={colSpan}>
                            <ExpandedItem detailed={detailed} id={rowData[0]} />
                        </TableCell>
                    )}
                </TableRow>
            );
        },
        onTableChange: handleTableChange,
        customToolbar: () => {
            return (
                <>
                    <Tooltip title={t(`common.download_excel`)}>
                        <IconButton onClick={generateExcel}>
                            <IconFileSpreadsheet color="green" />
                        </IconButton>
                    </Tooltip>
                    {customToolbar}
                </>
            );
        },

        setTableProps: () => ({
            size: "small",
        }),
        customTableBodyFooterRender: ({ columns }) => (
            <TableCell colSpan={columns.length}>
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Stack direction="column">
                        {totalData &&
                            type === "direct" &&
                            totalData.map((item, i) => (
                                <Typography key={i}>
                                    {item.item} : {item.amount}
                                </Typography>
                            ))}
                        {totalData &&
                            type !== "direct" &&
                            Object.entries(totalData).map((key, i) => (
                                <Typography key={i}>
                                    {t(`common.${key[0]}`)} :{" "}
                                    {toCurrency(key[1])}
                                </Typography>
                            ))}
                    </Stack>
                </Stack>
            </TableCell>
        ),
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

export default ReportTables;
