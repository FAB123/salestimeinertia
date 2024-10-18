import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { getData } from "../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import { SERACHBRANCHES } from "../../constants/apiUrls";
import toaster from "../../helpers/toaster";

function SelectStore({ type, savedDatas, savedValue, setSavedDatas }) {
    const { t } = useTranslation();

    const [storeList, setStoreList] = useState([]);
    const [query, setQuery] = useState("");

    return (
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
                {savedValue ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ width: "100%" }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        colSpan={2}
                                    >
                                        <Typography
                                            variant="body1"
                                            align="center"
                                        >
                                            {t(`purchase.${type}`)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="caption">
                                            {savedValue.location_name_en}
                                        </Typography>
                                        <Typography variant="caption">
                                            {savedValue.location_name_ar &&
                                                savedValue.location_name_ar}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => {
                                                if (type === "transfer_from") {
                                                    setSavedDatas({
                                                        ...savedDatas,
                                                        storeFrom: null,
                                                    });
                                                } else {
                                                    setSavedDatas({
                                                        ...savedDatas,
                                                        storeTo: null,
                                                    });
                                                }
                                            }}
                                        >
                                            <DeleteIcon color="error"></DeleteIcon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Autocomplete
                        freeSolo
                        sx={{ width: "100%" }}
                        inputValue={query}
                        clearOnEscape={true}
                        options={storeList}
                        getOptionLabel={(option) =>
                            ` ${option.location_name_en} [  ${option.location_name_ar}  ]`
                        }
                        onChange={(event, value) => {
                            setQuery("");
                            setStoreList([]);
                            if (value?.location_id) {
                                if (type === "transfer_from") {
                                    if (
                                        savedDatas?.storeTo?.location_id ===
                                        value.location_id
                                    ) {
                                        toaster.error(
                                            t("requisition.stores_not_same")
                                        );
                                        return true;
                                    }
                                    setSavedDatas({
                                        ...savedDatas,
                                        storeFrom: value,
                                    });
                                } else {
                                    if (
                                        savedDatas?.storeFrom?.location_id ===
                                        value.location_id
                                    ) {
                                        toaster.error(
                                            t("requisition.stores_not_same")
                                        );
                                        return true;
                                    }
                                    setSavedDatas({
                                        ...savedDatas,
                                        storeTo: value,
                                    });
                                }
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                label={t(`purchase.${type}`)}
                                fullWidth={true}
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
                                            `${SERACHBRANCHES}${searchItem}`
                                        ).then((data) => {
                                            setStoreList(data.data);
                                        });
                                    } else {
                                        setStoreList([]);
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
                )}
            </Stack>
        </Stack>
    );
}

export default React.memo(SelectStore);
