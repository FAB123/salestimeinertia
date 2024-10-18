import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";
import { forwardRef } from "react";
import i18n from "../i18n";

const muiTableIcons = {
    Add: forwardRef((props, ref) => <AddBoxIcon {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
        <ArrowDownwardIcon {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
        <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const localization = () => {
    return {
        body: {
            emptyDataSourceMessage: i18n.t("common.norecord"),
            addTooltip: i18n.t("common.add"),
            deleteTooltip: i18n.t("common.delete"),
            editTooltip: i18n.t("common.edit"),
            filterRow: {
                filterTooltip: i18n.t("table.filterTooltip"),
            },
            editRow: {
                deleteText: i18n.t("common.deleteText"),
                cancelTooltip: i18n.t("common.cancel"),
                saveTooltip: i18n.t("table.saveTooltip"),
            },
        },
        grouping: {
            placeholder: i18n.t("table.placeholder"),
            groupedBy: i18n.t("table.groupedBy"),
        },
        header: {
            actions: i18n.t("table.actions"),
        },
        pagination: {
            labelDisplayedRows: `{from}-{to} ${i18n.t(
                "table.labelDisplayedRows"
            )} {count}
    `,
            labelRowsSelect: i18n.t("table.labelRowsSelect"),
            labelRowsPerPage: i18n.t("table.labelRowsPerPage"),
            firstAriaLabel: i18n.t("table.firstAriaLabel"),
            firstTooltip: i18n.t("table.firstTooltip"),
            previousAriaLabel: i18n.t("table.previousAriaLabel"),
            previousTooltip: i18n.t("table.previousTooltip"),
            nextAriaLabel: i18n.t("table.nextAriaLabel"),
            nextTooltip: i18n.t("table.nextTooltip"),
            lastAriaLabel: i18n.t("table.lastAriaLabel"),
            lastTooltip: i18n.t("table.lastTooltip"),
        },
        toolbar: {
            addRemoveColumns: i18n.t("table.addRemoveColumns"),
            nRowsSelected: `{0} ${i18n.t("table.nRowsSelected")}`,
            showColumnsTitle: i18n.t("table.showColumnsTitle"),
            showColumnsAriaLabel: i18n.t("table.showColumnsAriaLabel"),
            exportTitle: i18n.t("table.exportTitle"),
            exportAriaLabel: i18n.t("table.exportAriaLabel"),
            exportName: i18n.t("table.exportName"),
            searchTooltip: i18n.t("table.searchTooltip"),
            searchPlaceholder: i18n.t("table.searchPlaceholder"),
        },
    };
};

export { muiTableIcons, localization };
