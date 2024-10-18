import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Drawer, Grid, Paper, styled, Typography } from "@mui/material";
import { getData } from "../../apis/apiCalls";
import { useTranslation } from "react-i18next";

import { GETSUPPLIERBYID, SEARCHSUPPLIERLIST } from "../../constants/apiUrls";
import AddSuppliers from "../../Pages/Screens/Suppliers/AddSuppliers";

function SelectSupplier({ savedDatas, setSavedDatas }) {
    const { t } = useTranslation();

    const [supplierList, setSupplierList] = useState([]);
    const [query, setQuery] = useState("");
    const [useDrawer, setUseDrawer] = useState(false);

    const quickInsert = (supplierId) => {
        if (supplierId !== -1) {
            getData(`${GETSUPPLIERBYID}${supplierId}`).then((response) => {
                if (response.data) {
                    setSavedDatas({
                        ...savedDatas,
                        supplierInfo: response.data,
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
            {!savedDatas.supplierInfo && (
                <>
                    <Drawer
                        open={useDrawer}
                        anchor="right"
                        PaperProps={{
                            sx: { width: "70%" },
                        }}
                    >
                        <DrawerHeader />
                        <Stack component={Paper} sx={{ p: 1 }}>
                            <AddSuppliers
                                quickRegister={true}
                                quickInsert={quickInsert}
                            />
                        </Stack>
                    </Drawer>
                    <Stack direction="row" spacing={2}>
                        <Autocomplete
                            freeSolo
                            sx={{ width: "100%" }}
                            inputValue={query}
                            clearOnEscape={true}
                            options={supplierList}
                            getOptionLabel={(option) =>
                                ` ${option.name} /  Mobile: ${option.mobile}`
                            }
                            onChange={(event, value) => {
                                setQuery("");
                                setSupplierList([]);
                                if (value.name) {
                                    setSavedDatas({
                                        ...savedDatas,
                                        supplierInfo: value,
                                    });
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    label={t("suppliers.findsupplier")}
                                    autoFocus={true}
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
                                                `${SEARCHSUPPLIERLIST}${searchItem}`
                                            ).then((data) => {
                                                setSupplierList(data.data);
                                            });
                                        } else {
                                            setSupplierList([]);
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
                        <Fab
                            color="primary"
                            size="small"
                            aria-label="add"
                            onClick={() => setUseDrawer(true)}
                        >
                            <AddIcon />
                        </Fab>
                    </Stack>
                </>
            )}
            {savedDatas.supplierInfo && (
                <>
                    <div
                        onClick={() =>
                            navigate(
                                `/suppliers/edit_supplier/${savedDatas.supplierInfo.encrypted_supplier}`
                            )
                        }
                    >
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography variant="body1" align="left">
                                {t("suppliers.supplier")}:
                            </Typography>
                            <Typography variant="body1" align="right">
                                {savedDatas.supplierInfo.name}
                            </Typography>
                        </Grid>

                        {savedDatas.supplierInfo.vat_number && (
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography variant="body1" align="left">
                                    {t("common.vatnumber")}:
                                </Typography>
                                <Typography variant="body1" align="right">
                                    {savedDatas.supplierInfo.vat_number}
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
                                {savedDatas.supplierInfo.mobile}
                            </Typography>
                        </Grid>
                    </div>
                    <Grid container alignItems="center" justifyContent="center">
                        <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => {
                                setSavedDatas({
                                    ...savedDatas,
                                    supplierInfo: null,
                                });
                            }}
                        >
                            <DeleteIcon fontSize="inherit" color="error" />
                        </IconButton>
                    </Grid>
                </>
            )}
        </div>
    );
}

export default React.memo(SelectSupplier);
