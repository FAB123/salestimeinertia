import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { IconButton, Paper, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toCurrency } from "../../../constants/constants";
import {
    GETALLSTORES,
    GETALLWORKORDERSTATUS,
    GETWORKORDERDETAILSBYID,
} from "../../../constants/apiUrls";

import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

import ReportTables from "../../../components/table/ReportTables";
import { FormWorkorderDropDown } from "../../../components/mui/FormWorkorderDropDown";
import { getData } from "../../../apis/apiCalls";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { router } from "@inertiajs/react";

const detailed = {
    header: [
        "item_name",
        "item_name_ar",
        "description",
        "quantity",
        "unit_name",
        "item_unit_price",
        "item_sub_total",
        "discount",
        "tax_amount",
    ],
    url: GETWORKORDERDETAILSBYID,
};

const all = { label: "All", value: "ALL" };
function WorkOrderStatus() {
    const { t } = useTranslation();
    const title = t("configuration.workorder_status");
    const primaryKey = "workorder_id";
    const header = [
        {
            name: "workorder_id",
            label: t("common.id"),
        },
        {
            name: "created_at",
            label: t("common.date"),
            options: {
                customBodyRender: (value) =>
                    value ? new Date(value).toLocaleString() : "",
            },
        },
        {
            name: "customer_name",
            label: t("customers.customer"),

            options: {},
        },
        {
            name: "workorder_quantity",
            label: t("common.quantity"),
            options: {},
        },
        {
            name: "sub_total",
            label: t("common.subtotal"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "tax",
            label: t("common.tax"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "total",
            label: t("common.total"),
            options: {
                customBodyRender: (value) => toCurrency(value),
            },
        },
        {
            name: "status",
            label: t("common.status"),
            options: {},
        },
        {
            name: "comments",
            label: t("common.comments"),
            options: {},
        },
        {
            name: "workorder_id",
            label: " ",
            options: {
                customBodyRender: (value) => (
                    <IconButton
                        onClick={() =>
                            router.get(`/sales/workorder_details/${value}`)
                        }
                    >
                        <VisibilityIcon />
                    </IconButton>
                ),
            },
        },
    ];

    const [options, setOptions] = useState([all]);
    const [type, setType] = useState("ALL");
    const [locations, setLocations] = useState([all]);
    const [location, setLocation] = useState("ALL");

    useEffect(() => {
        getData(GETALLWORKORDERSTATUS).then((response) => {
            if (response.status) {
                let status = response.data.map((item) => ({
                    label: `${item.status_name_en} [${item.status_name_ar}]`,
                    value: item.id,
                }));
                setOptions((prev) => [...prev, ...status]);
            }
        });

        getData(GETALLSTORES).then((response) => {
            let tmpLocations = response.data.map((item) => ({
                label: `${item.location_name_en} [${item.location_name_ar}]`,
                value: item.location_id,
            }));
            setLocations((prev) => [...prev, ...tmpLocations]);
        });
    }, []);

    const date = new Date();
    const fromDate = date.setHours(0, 0);
    const toDate = date.setHours(23, 59);
    const maxDate = date.setDate(date.getDate() + 1);

    const [generatedFromDate, setGeneratedFromDate] = useState(
        new Date(fromDate).toISOString()
    );

    const [generatedToDate, setGeneratedToDate] = useState(
        new Date(toDate).toISOString()
    );

    const selectDate = (
        <Paper sx={{ m: 1, p: 2 }}>
            <Stack direction="row">
                <Flatpickr
                    options={{
                        mode: "range",
                        enableTime: false,
                        dateFormat: "d-m-Y H:m:i",
                        maxDate: maxDate,
                        defaultDate: [generatedFromDate, generatedToDate],
                    }}
                    render={({ defaultValue, value, ...props }, ref) => {
                        return (
                            <TextField
                                size="small"
                                defaultValue={defaultValue}
                                inputRef={ref}
                                sx={{ width: 400 }}
                                label={t("common.date")}
                            />
                        );
                    }}
                    onChange={([fromDate, toDate]) => {
                        setGeneratedFromDate(new Date(fromDate).toISOString());
                        setGeneratedToDate(new Date(toDate).toISOString());
                    }}
                />
                <FormWorkorderDropDown
                    size="small"
                    value={type}
                    options={options}
                    onSubmit={setType}
                />

                <FormWorkorderDropDown
                    size="small"
                    value={location}
                    options={locations}
                    onSubmit={setLocation}
                />
            </Stack>
        </Paper>
    );

    return (
        <Stack>
            <Breadcrumb
                labelHead={t("modules.workorder")}
                labelSub={t("configuration.workorder_status")}
            />
            {selectDate}
            <ReportTables
                title={title}
                header={header}
                url={`/reports/detailed_workorder/${generatedFromDate}/${generatedToDate}/${type}/${location}`}
                primaryKey={primaryKey}
                type={null}
                detailed={detailed}
            />
        </Stack>
    );
}

export default WorkOrderStatus;
