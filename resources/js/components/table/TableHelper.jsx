import React, { forwardRef, useEffect, useRef, useState } from "react";
import { getData, postData } from "../../apis/apiCalls";
import {
    Stack,
    Tooltip,
    IconButton,
    CircularProgress,
    Typography,
    Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import { exportToEXCEL } from "../../helpers/GeneralHelper";
import ToasterContainer from "../ToasterContainer";
import MUIDataTable from "mui-datatables";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import toaster from "../../helpers/toaster";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterIcon from "@mui/icons-material/FilterList";
import SaveAlt from "@mui/icons-material/SaveAlt";
import { IconFilterCog } from "@tabler/icons-react";

import { FileUploader } from "../mui";

import { PosAlert } from "../../Utils/Theming";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import { IconFileSpreadsheet } from "@tabler/icons-react";

const TableHelper = forwardRef((props, ref) => {
    const {
        title,
        header,
        url,
        deleteURL,
        excel,
        primaryKey,
        new_text,
        newLink,
    } = props;
    const [showHideUploader, setShowHideUploader] = useState(false);
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
    const [message, setMessage] = useState(null);
    const { t } = useTranslation();

    const deleteWithID = (ids) => {
        if (window.confirm("Are You Sure?")) {
            let idToDelete = ids.data.map(
                (id) => data[id.index].encrypted_delete_key
            );

            postData(deleteURL, idToDelete).then((resp) => {
                resp.status
                    ? toaster.success(resp.message)
                    : toaster.error(resp.message);
            });
            // tableRef.current && tableRef.current.onQueryChange();
        }
    };

    const generateExcel = () => {
        let dataUrl = `${url}/0/30000/${pageStatus.query}/${pageStatus.name}/${pageStatus.direction}`;
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
    }, [pageStatus, url]);

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
        onRowsDelete: deleteWithID,
        onTableChange: handleTableChange,
        customToolbar: () => {
            return (
                <>
                    {/* <Tooltip title={t(`common.download_excel`)}>
                        <IconButton onClick={generateExcel}>
                            <IconFilterCog color="red" />
                        </IconButton>
                    </Tooltip> */}
                    <Tooltip title={t(`common.download_excel`)}>
                        <IconButton onClick={generateExcel}>
                            <IconFileSpreadsheet color="green" />
                        </IconButton>
                    </Tooltip>
                    {newLink && (
                        <Tooltip title={t(`modules.${new_text}`)}>
                            <IconButton onClick={() => router.get(newLink)}>
                                <AddCircleOutlineRoundedIcon color="secondary" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {excel && (
                        <Tooltip title={t("common.uploadfile")}>
                            <IconButton
                                onClick={() => setShowHideUploader(true)}
                            >
                                <CloudUploadIcon color="warning" />
                            </IconButton>
                        </Tooltip>
                    )}
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

            <FileUploader
                showHideUploader={showHideUploader}
                setShowHideUploader={setShowHideUploader}
                type={excel}
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
                columns={header}
                options={options}
                components={components}
                ref={ref}
            />
        </Stack>
    );
});

export default TableHelper;
