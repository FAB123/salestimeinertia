import React from "react";
import TableHelper from "../../../components/table/TableHelper";
import { customerHeader } from "../../../components/table/helpers/TableHeaderHelper";
import { DELETECUSTOMERS, GETALLCUSTOMERS } from "../../../constants/apiUrls";
import Breadcrumb from "../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";

function ShowCustomers() {
    const { t } = useTranslation();

    const title = "Customers List";
    return (
        <Stack>
            <Breadcrumb
                labelHead={t("modules.customers")}
                labelSub="Add/Edit Item"
            />
            <TableHelper
                title={title}
                header={customerHeader()}
                url={GETALLCUSTOMERS}
                deleteURL={DELETECUSTOMERS}
                excel="CUSTOMER"
                primaryKey="customer_id"
                newLink="/customers/add_customers"
                new_text="add_customers"
            />
        </Stack>
    );
}

export default ShowCustomers;
