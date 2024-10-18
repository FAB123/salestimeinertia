import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import { PurpleButton } from "../../../Utils/Theming";
import Stack from "@mui/material/Stack";

import { getData, postData } from "../../../apis/apiCalls";
import OpeningList from "./support/OpeningList";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import ToasterContainer from "../../../components/ToasterContainer";
import { useTranslation } from "react-i18next";
import { GETITEMSOB, SAVEITEMOB } from "../../../constants/apiUrls";

function OpeningStock() {
    const { t } = useTranslation();
    const cart_qty = useRef(0);
    const [totalQty, setTotalQty] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [query, setQuery] = useState("null");

    useEffect(() => {
        getData(`${GETITEMSOB}/${query}`).then((response) => {
            setCartItems(response.items.data);
        });
    }, [query]);

    useEffect(() => {
        let qty = cartItems.reduce(function (accumulator, item) {
            return accumulator + parseFloat(item.quantity);
        }, 0);
        setTotalQty(qty);
        cart_qty.current.innerText = parseFloat(qty);
    }, [cartItems]);

    const submitData = () => {
        postData(SAVEITEMOB, { item: cartItems }).then((response) =>
            setCartItems(response.items.data)
        );
    };

    // const changeQty = useRef(null);
    // const addQty = useRef(null);
    // const handleEnter = (event, element) => {
    //   if (event.key === "Enter") {
    //     element.current.focus();
    //   }
    // };

    // const submitData = () => {
    //   const storeData = JSON.parse(localStorage.getItem("store_data"))
    //     ? JSON.parse(localStorage.getItem("store_data"))
    //     : { store: null };
    //   if (!storeData.store) {
    //     toaster.errorwithcallback(
    //       "Error retriving Store ID, Please Login again",
    //       () => {
    //         appCookies.remove("auth_token");
    //         navigate("/login");
    //       }
    //     );
    //   } else {
    //     postData("/items/setOpeningStocks", {
    //       cartItems,
    //       store: storeData.storeId,
    //       user: storeData._id,
    //     }).then((result) => {
    //       if (result.status) {
    //         if (result.result.errCount > 0) {
    //           toaster.error(`${result.result.errCount} item(s) Update Failed`);
    //         }
    //         if (result.result.successCount > 0) {
    //           toaster.success(`${result.result.successCount} item(s) Updated`);
    //         }
    //         setCartItems([]);
    //       } else {
    //         toaster.error(`${result.result} item(s) Update Failed`);
    //       }
    //     });
    //   }
    // };

    return (
        <Stack>
            <Breadcrumb labelHead="Items" labelSub="Opening Stock" />
            <ToasterContainer />
            <Grid container>
                <Grid item md={9} xs={12}>
                    <Paper sx={{ m: 1, p: 3 }}>
                        <OpeningList
                            cartItems={cartItems}
                            setCartItems={setCartItems}
                            setQuery={setQuery}
                        />
                    </Paper>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Paper sx={{ m: 1, p: 3 }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="body1" align="left">
                                {t("common.quantity")}
                            </Typography>
                            <Typography
                                variant="body1"
                                align="right"
                                ref={cart_qty}
                            >
                                0
                            </Typography>
                        </Stack>
                        <Divider orientation="horizontal" sx={{ m: 2 }} />
                        <Stack
                            spacing={2}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <PurpleButton
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                    if (window.confirm("Are you Sure?"))
                                        submitData();
                                    return;
                                }}
                            >
                                Submit & Save
                            </PurpleButton>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default OpeningStock;
