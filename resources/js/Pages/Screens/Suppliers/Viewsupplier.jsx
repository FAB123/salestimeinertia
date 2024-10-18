import React, { useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";

import Stack from "@mui/material/Stack";
import { supplierHeader } from "../../../components/table/helpers/TableHeaderHelper";
import {  GETALLSUPPLIERS } from "../../../constants/apiUrls";
import TableHelper from "../../../components/table/TableHelper";

function Viewsupplier() {
    const title = "Suppliers List";

    return (
        <Stack>
            <Breadcrumb labelHead="View Suppliers" labelSub="View Suppliers" />
            <TableHelper
                title={title}
                header={supplierHeader()}
                url={GETALLSUPPLIERS}
      
                excel="SUPPLIER"
                primaryKey="supplier_id"
                newLink="/suppliers/add_suppliers"
                new_text="add_suppliers"
            />
        </Stack>
    );
}

export default Viewsupplier;
