import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Drawer, Grid, Paper, styled, Typography } from "@mui/material";

import { getData } from "../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import { convertCustomerType } from "../../helpers/SalesHelper";
import { GETCUSTOMERBYID, SEARCHCUSTOMERLIST } from "../../constants/apiUrls";
import Addcustomer from "../../Pages/Screens/Customers/AddCustomer";
import { PosTooltip } from "../../Utils/Theming";

const getOptionLabel = (option) => {
    const mobileLabel = option.mobile ? `Mobile: ${option.mobile}` : "";
    const partyIdLabel = option.party_id ? `Party ID: ${option.party_id}` : "";

    return `${option.name} ${mobileLabel ? `/ ${mobileLabel}` : ""} ${
        partyIdLabel ? `/ ${partyIdLabel}` : ""
    }`;
};

function SelectCustomer({ savedDatas, setSavedDatas }) {
    const { t } = useTranslation();

    const [customerList, setCustomerList] = useState([]);
    const [query, setQuery] = useState("");
    const [useDrawer, setUseDrawer] = useState(false);
    const [customerId, SetCustomerId] = useState(null);

    const quickInsert = (customerId) => {
        if (customerId !== -1) {
            getData(`${GETCUSTOMERBYID}${customerId}`).then((response) => {
                if (response.data) {
                    setSavedDatas({
                        ...savedDatas,
                        customerInfo: response.data,
                    });
                }
            });
        }
        setUseDrawer(false);
    };

    const DrawerHeader = styled("div")(({ theme }) => ({
        ...theme.mixins.toolbar,
    }));

    return (
        <div className="form-group">
            <Drawer
                open={useDrawer}
                anchor="right"
                PaperProps={{
                    sx: { width: "70%" },
                }}
            >
                <DrawerHeader />
                <Stack component={Paper} sx={{ p: 1 }}>
                    <Addcustomer
                        quickRegister={true}
                        customer_id={customerId}
                        quickInsert={quickInsert}
                    />
                </Stack>
            </Drawer>
            {!savedDatas.customerInfo && (
                <>
                    <Stack direction="row" spacing={2}>
                        <Autocomplete
                            freeSolo
                            sx={{ width: "100%" }}
                            inputValue={query}
                            clearOnEscape={true}
                            options={customerList}
                            getOptionLabel={getOptionLabel}
                            onChange={(event, value) => {
                                setQuery("");
                                setCustomerList([]);
                                if (value.name) {
                                    setSavedDatas({
                                        ...savedDatas,
                                        customerInfo: value,
                                    });
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    label={t("customers.findcustomer")}
                                    // autoFocus={true}
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
                        <PosTooltip title={t("tooltip.add_customer")}>
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="add"
                                onClick={() => setUseDrawer(true)}
                            >
                                <AddIcon />
                            </Fab>
                        </PosTooltip>
                    </Stack>
                </>
            )}
            {savedDatas.customerInfo && (
                <>
                    <div>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography variant="body1" align="left">
                                {t("customers.customer")}:
                            </Typography>
                            <Typography variant="body1" align="right">
                                {savedDatas.customerInfo.name}
                            </Typography>
                        </Grid>
                        {savedDatas.customerInfo.company_name && (
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1" align="left">
                                    {t("common.company")}:
                                </Typography>
                                <Typography variant="body1" align="right">
                                    {savedDatas.customerInfo.company_name}
                                </Typography>
                            </Grid>
                        )}

                        {savedDatas.customerInfo.party_id && (
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1" align="left">
                                    {t("common.vatnumber")}:
                                </Typography>
                                <Typography variant="body1" align="right">
                                    {savedDatas.customerInfo.party_id}
                                </Typography>
                            </Grid>
                        )}

                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography variant="body1" align="left">
                                {t("common.mobile")}:
                            </Typography>
                            <Typography variant="body1" align="right">
                                {savedDatas.customerInfo.mobile}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography variant="body1" align="left">
                                {t("common.type")}:
                            </Typography>
                            <Typography variant="body1" align="right">
                                {t(
                                    convertCustomerType(
                                        savedDatas.customerInfo.customer_type
                                    )
                                )}
                            </Typography>
                        </Grid>
                    </div>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => {
                                setSavedDatas({
                                    ...savedDatas,
                                    customerInfo: null,
                                });
                            }}
                        >
                            <DeleteIcon fontSize="inherit" color="error" />
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            size="large"
                            onClick={() => {
                                SetCustomerId(
                                    savedDatas.customerInfo.encrypted_customer
                                );
                                setUseDrawer(true);
                            }}
                        >
                            <EditIcon fontSize="inherit" color="secondary" />
                        </IconButton>
                    </Grid>
                </>
            )}
        </div>
    );
}

export default React.memo(SelectCustomer);
