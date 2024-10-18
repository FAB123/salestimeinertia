import React from "react";
import { Fab, InputAdornment, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloudSyncRoundedIcon from "@mui/icons-material/CloudSyncRounded";
import { useState } from "react";
import toaster from "../../helpers/toaster";
import { getData } from "../../apis/apiCalls";
import { GETSALEBYID } from "../../constants/apiUrls";

function FindSales({ saleType, setSavedDatas, setFindSales }) {
    const { t } = useTranslation();
    const [text, setText] = useState("");
    let { configuration_data } = JSON.parse(localStorage.getItem("store_data"));

    const updateText = (e) => {
        setText(e.target.value);
    };

    const getInvoice = () => {
        if (text) {
            let savedDatas = JSON.parse(localStorage.getItem(saleType));

            if (savedDatas.cartItems.length > 0) {
                toaster.warning(t("sales.cart_not_empty"));
            } else {
                getData(`${GETSALEBYID}/${text}`).then((response) => {
                    if (response.error) {
                        toaster.error(t(response.message));
                    } else {
                        let data = {
                            inital: false,
                            cartItems: response.data.cartItems,
                            customerInfo: response.data.customerInfo,
                            billType: response.data.billType,
                            comments: response.data.comments,
                            paymentInfo: [],
                            printAfterSale: false,
                        };
                        localStorage.setItem(saleType, JSON.stringify(data));
                        setSavedDatas(data);
                        setFindSales(false);
                        toaster.success(t("sales.cart_restored"));
                    }
                });
            }
        } else {
            toaster.error(t("sales.inv_number_error"));
        }
    };
    return (
        <Stack>
            <Stack
                direction="row"
                justifyContent="right"
                sx={{ mt: 2, alignItems: "center" }}
                spacing={2}
            >
                <TextField
                    size="small"
                    color="secondary"
                    label={t("sales.inv_number")}
                    variant="outlined"
                    type="number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {configuration_data.invoice_patern}-
                            </InputAdornment>
                        ),
                    }}
                    value={text}
                    onChange={updateText}
                ></TextField>
                <Fab color="primary" size="small" onClick={getInvoice}>
                    <CloudSyncRoundedIcon />
                </Fab>
            </Stack>
        </Stack>
    );
}

export default FindSales;
