import React from "react";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DELETEEMPLOYEE, GETALLEMPLOYEES } from "../../../constants/apiUrls";
import { employeeHeader } from "../../../components/table/helpers/TableHeaderHelper";
import Breadcrumb from "../../../components/Breadcrumb";
import TableHelper from "../../../components/table/TableHelper";

function ShowEmployee() {
    const { t } = useTranslation();
    const title = "Employees List";

    return (
        <Stack>
            <Breadcrumb labelHead="Employees" labelSub="Add/Edit Employee" />
            <TableHelper
                title={title}
                header={employeeHeader()}
                url={GETALLEMPLOYEES}
                deleteURL={DELETEEMPLOYEE}
                excel={null}
                primaryKey="employee_id"
                newLink="/employee/add_employee"
                new_text="add_employee"
            />
        </Stack>
    );
}

export default ShowEmployee;
