import React from "react";
import i18n from "../../../i18n";
import { IconButton, Stack } from "@mui/material";
import { router } from "@inertiajs/react";
import { IconEdit } from "@tabler/icons-react";

// const deleteItem = (id) => {
//     if (window.confirm("Are You Sure?")) {
//         let data = [id];
//         postData(url, data).then((response) => {
//             response.status
//                 ? toaster.success(response.message)
//                 : toaster.error(response.message);
//         });
//     }
// };

const customerHeader = () => {
    return [
        // {
        //   name: "details.customer_id",
        //   label: "Common ID",
        //   options: {
        //     display: false,
        //   },
        // },
        {
            name: "name",
            label: i18n.t("tables.full_name"),
            options: {},
        },
        {
            name: "mobile",
            label: i18n.t("common.mobile"),
            options: {},
        },
        {
            name: "customer_type",
            label: i18n.t("common.type"),
            options: {
                customBodyRender: (row) =>
                    row === 1
                        ? i18n.t("sales.wholesale")
                        : i18n.t("sales.retail"),
            },
        },
        {
            name: "billing_type",
            label: i18n.t("customers.billing_type"),
            options: {
                customBodyRender: (row) => (row === 0 ? "B2B" : "B2C"),
            },
            sorting: false,
        },
        {
            name: "party_id",
            label: i18n.t("common.party_id"),
            // options: {
            //     customBodyRender: (row, tableMeta, updateValue) =>
            //         console.log(row, tableMeta, updateValue),
            //     // `${row.party_id}[${row.identity_type}]`,
            // },
        },
        {
            name: "location_name_en",
            label: i18n.t("common.location"),
        },
        {
            name: "comments",
            label: i18n.t("common.comments"),
            options: {
                sort: false,
            },
        },
        {
            name: "encrypted_customer",
            label: " ",
            options: {
                print: false,
                download: false,
                customBodyRender: (value) => {
                    return (
                        <Stack
                            direction={"row"}
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                component="span"
                                color="primary"
                                style={{ padding: "0 5px 0 5px" }}
                                onClick={() => {
                                    router.get(
                                        `/customers/edit_customer/${value}`
                                    );
                                }}
                            >
                                <IconEdit />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];
};
const supplierHeader = () => {
    return [
        {
            name: "name",
            label: i18n.t("tables.full_name"),
            options: {},
        },
        {
            name: "contact_person",
            label: i18n.t("tables.contact_person"),
            options: {},
        },

        {
            name: "email",
            label: i18n.t("common.email"),
            options: {},
        },

        {
            name: "mobile",
            label: i18n.t("common.mobile"),
            options: {},
        },

        {
            name: "vat_number",
            label: i18n.t("common.vat"),
            options: {},
        },
        {
            name: "details.comments",
            label: i18n.t("common.comments"),
            options: {},
        },
        {
            name: "encrypted_supplier",
            label: " ",
            options: {
                print: false,
                download: false,
                customBodyRender: (value) => {
                    return (
                        <Stack
                            direction={"row"}
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                component="span"
                                style={{ padding: "0 5px 0 5px" }}
                                color="primary"
                                onClick={() => {
                                    router.get(
                                        `/suppliers/edit_supplier/${value}`
                                    );
                                }}
                            >
                                <IconEdit />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];
};

const employeeHeader = () => {
    return [
        {
            name: "name",
            label: i18n.t("tables.full_name"),
        },
        {
            name: "username",
            label: i18n.t("employee.username"),

            options: {},
        },
        {
            name: "mobile",
            label: i18n.t("common.mobile"),
            options: {},
        },

        {
            name: "email",
            label: i18n.t("common.email"),
            options: {},
        },
        {
            name: "status",
            label: i18n.t("permission.active"),
            options: {
                customBodyRender: (value) => {
                    return value === 1
                        ? i18n.t("permission.active")
                        : i18n.t("common.disabled");
                },
            },
        },
        {
            name: "comments",
            label: i18n.t("common.comments"),
            options: {},
        },
        {
            name: "encrypted_employee",
            label: " ",
            options: {
                print: false,
                download: false,
                customBodyRender: (value) => {
                    return (
                        <Stack
                            direction={"row"}
                            justifyContent="flex-end"
                            spacing={1}
                        >
                            <IconButton
                                color="primary"
                                component="span"
                                style={{ padding: "0 5px 0 5px" }}
                                onClick={() => {
                                    router.get(
                                        `/employee/edit_employee/${value}`
                                    );
                                }}
                            >
                                <IconEdit />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        },
    ];
};

export { customerHeader, supplierHeader, employeeHeader };
