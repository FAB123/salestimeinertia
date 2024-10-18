import React, { memo, useEffect } from "react";
import {
    Paper,
    Stack,
    TextField,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    Typography,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import toaster from "../../helpers/toaster";
import { getData, postData } from "../../apis/apiCalls";
import SearchIcon from "@mui/icons-material/Search";

import {
    FINDWORKORDERBYCUSTOMER,
    SEARCHCUSTOMERLIST,
} from "../../constants/apiUrls";
import { PurpleButton } from "../../Utils/Theming";
import MUIDataTable from "mui-datatables";
import { toCurrency } from "../../constants/constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { router } from "@inertiajs/react";

function FindWorkorder() {
    const { t } = useTranslation();
    const [workorder_id, setWorkorderID] = useState("");
    const [query, setQuery] = useState("");
    const [customerList, setCustomerList] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [deliverd, setDeliverd] = useState("1");

    const [data, setData] = useState([]);

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
            name: "customer.name",
            label: t("customers.customer"),
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

    const getWorkorder = () => {
        if (workorder_id || customer) {
            postData(FINDWORKORDERBYCUSTOMER, {
                customer,
                workorder_id,
                deliverd,
            }).then((response) => {
                if (response.error) {
                    toaster.error(t(response.message));
                } else {
                    if (response.data) {
                        setData(response.data);
                    } else {
                        toaster.error(t("sales.inv_number_error"));
                    }
                }
            });
        } else {
            toaster.error(t("sales.inv_number_error"));
        }
    };

    useEffect(() => {
        if (customer) {
            getWorkorder();
        }
    }, [customer]);

    const handleChange = (event) => {
        setDeliverd(event.target.checked ? "1" : "0");
    };

    return (
        <Stack>
            <Paper sx={{ m: 2, p: 2 }}>
                <Stack
                    direction="row"
                    justifyContent="right"
                    sx={{ alignItems: "center" }}
                    spacing={2}
                >
                    <FormControlLabel
                        control={
                            <Checkbox defaultChecked onChange={handleChange} />
                        }
                        label={t("sales.exclude_deliverd")}
                    />

                    <Autocomplete
                        freeSolo
                        sx={{ width: "50%" }}
                        inputValue={query}
                        clearOnEscape={true}
                        options={customerList}
                        getOptionLabel={(option) =>
                            ` ${option.name} /  Mobile: ${option.mobile}`
                        }
                        onChange={(event, value) => {
                            setQuery("");
                            setCustomerList([]);
                            if (value.name) {
                                setCustomer(value.customer_id);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                label={t("customers.findcustomer")}
                                onChange={(e) => {
                                    let searchItem = e.target.value;
                                    if (
                                        searchItem !== "" ||
                                        searchItem !== null
                                    ) {
                                        setQuery(searchItem);
                                    }

                                    if (searchItem.length > 2) {
                                        getData(
                                            `${SEARCHCUSTOMERLIST}${searchItem}`
                                        ).then((data) => {
                                            setCustomerList(data.data);
                                        });
                                    } else {
                                        setCustomerList([]);
                                    }
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Typography>OR</Typography>
                    <TextField
                        size="small"
                        color="secondary"
                        label={t("sales.inv_number")}
                        variant="outlined"
                        type="number"
                        value={workorder_id}
                        onChange={(e) => setWorkorderID(e.target.value)}
                    />

                    <PurpleButton
                        onClick={getWorkorder}
                        startIcon={
                            <SearchIcon sx={{ transform: "rotate(90deg)" }} />
                        }
                    >
                        {t("common.find")}
                    </PurpleButton>
                </Stack>
                {data.length > 0 && (
                    <MUIDataTable
                        data={data}
                        columns={header}
                        options={{
                            filterType: "checkbox",
                            download: false,
                            print: false,
                            search: false,
                            filter: false,
                            viewColumns: false,
                            pagination: false,
                            enableNestedDataAccess: ".",
                            selectableRows: "none",
                        }}
                    />
                )}
            </Paper>
        </Stack>
    );
}

export default memo(FindWorkorder);
