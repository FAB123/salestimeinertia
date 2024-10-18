import React from "react";

import { Stack, Switch, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useEffect } from "react";
import { PosTooltip } from "../../Utils/Theming";
import InfoRow from "./InfoRow";

const calculateDiscount = (item) => {
    if (item.discount_type === "P") {
        const totalPrice =
            parseFloat(item.unit_price) * parseFloat(item.quantity);
        return (totalPrice / 100) * item.discount;
    }
    return parseFloat(item.discount);
};

const aggregateVatList = (accumulator, item) => {
    item.vatList.forEach((d) => {
        if (accumulator.vatList.hasOwnProperty(d.percent)) {
            accumulator.vatList[d.percent] += parseFloat(d.amount);
        } else {
            accumulator.vatList[d.percent] = parseFloat(d.amount);
        }
    });
};

const formatVatList = (vatList) => {
    return Object.entries(vatList)
        .map(([key, value]) => `${key}% : ${parseFloat(value).toFixed(2)} SR`)
        .join("\n");
};

const updateCartData = (totalData, refs, t, additionalDiscount) => {
    refs.cart_qty.current.innerText = totalData.quantity;
    refs.cart_discount.current.innerText = `${totalData.discount.toFixed(
        2
    )} SR`;
    refs.cart_subtotal.current.innerText = totalData.subTotal.toFixed(2);
    refs.cart_vat.current.innerText = `${formatVatList(totalData.vatList)}\n${t(
        "common.total"
    )}  : ${totalData.vat.toFixed(2)} SR`;
    refs.cart_total.current.innerText = totalData.total.toFixed(2);
    refs.cart_add_discount.current.innerText = additionalDiscount.toFixed(2);
    refs.cart_net_total.current.innerText = (
        totalData.total - additionalDiscount
    ).toFixed(2);
};

function SalesTotal({ savedDatas, setSavedDatas, discount }) {
    const { t } = useTranslation();

    //assign refs
    const cart_total = useRef(0);
    const cart_subtotal = useRef(0);
    const cart_vat = useRef([]);
    const cart_qty = useRef(0);
    const cart_discount = useRef(0);

    const cart_add_discount = useRef(0);
    const cart_net_total = useRef(0);

    //update interface

    useEffect(() => {
        if (savedDatas.cartItems) {
            const totalData = savedDatas.cartItems.reduce(
                (accumulator, item) => {
                    const discount = calculateDiscount(item);
                    aggregateVatList(accumulator, item);

                    return {
                        quantity:
                            accumulator.quantity + parseFloat(item.quantity),
                        discount: accumulator.discount + discount,
                        subTotal:
                            accumulator.subTotal + parseFloat(item.subTotal),
                        vat: accumulator.vat + parseFloat(item.vat),
                        vatList: accumulator.vatList,
                        total: accumulator.total + parseFloat(item.total),
                    };
                },
                {
                    quantity: 0,
                    discount: 0,
                    subTotal: 0,
                    vat: 0,
                    vatList: {},
                    total: 0,
                }
            );

            updateCartData(
                totalData,
                {
                    cart_qty,
                    cart_discount,
                    cart_subtotal,
                    cart_vat,
                    cart_total,
                    cart_add_discount,
                    cart_net_total,
                },
                t,
                parseFloat(discount)
            );
        }
    }, [savedDatas, t, discount]);

    // useEffect(() => {
    //     if (savedDatas.cartItems) {
    //         let totalData = savedDatas.cartItems.reduce(
    //             function (accumulator, item) {
    //                 var result = item.vatList.reduce(
    //                     (accu, e) => [...accu, e],
    //                     []
    //                 );
    //                 var holder = accumulator.vatList;
    //                 result.forEach(function (d) {
    //                     if (holder.hasOwnProperty(d.percent)) {
    //                         holder[d.percent] =
    //                             holder[d.percent] + parseFloat(d.amount);
    //                     } else {
    //                         holder[d.percent] = parseFloat(d.amount);
    //                     }
    //                 });

    //                 let discount;
    //                 if (item.discount_type === "P") {
    //                     let totalPrice =
    //                         parseFloat(item.unit_price) *
    //                         parseFloat(item.quantity);
    //                     discount = (totalPrice / 100) * item.discount;
    //                 } else {
    //                     discount = item.discount;
    //                 }

    //                 return {
    //                     quantity:
    //                         accumulator.quantity + parseFloat(item.quantity),
    //                     discount: accumulator.discount + parseFloat(discount),
    //                     subTotal:
    //                         accumulator.subTotal + parseFloat(item.subTotal),
    //                     vat: accumulator.vat + parseFloat(item.vat),
    //                     vatList: holder,
    //                     total: accumulator.total + parseFloat(item.total),
    //                 };
    //             },
    //             {
    //                 quantity: 0,
    //                 discount: 0,
    //                 subTotal: 0,
    //                 vat: 0,
    //                 vatList: [],
    //                 total: 0,
    //             }
    //         );

    //         let text = "";
    //         for (const [key, value] of Object.entries(totalData.vatList)) {
    //             text += ` ${key}% : ${parseFloat(value).toFixed(2)} SR \n`;
    //         }

    //         cart_qty.current.innerText = totalData.quantity;
    //         cart_discount.current.innerText = `${parseFloat(
    //             totalData.discount
    //         ).toFixed(2)} SR`;
    //         cart_subtotal.current.innerText = parseFloat(
    //             totalData.subTotal
    //         ).toFixed(2);
    //         cart_vat.current.innerText = `${text}  ${t(
    //             "common.total"
    //         )}  : ${parseFloat(totalData.vat).toFixed(2)} SR`;
    //         cart_total.current.innerText = parseFloat(totalData.total).toFixed(
    //             2
    //         );
    //         cart_add_discount.current.innerText =
    //             parseFloat(discount).toFixed(2);
    //         cart_net_total.current.innerText = parseFloat(
    //             totalData.total - discount
    //         ).toFixed(2);
    //     }
    // }, [savedDatas, discount]);

    const onChange = (e) => {
        let convert = savedDatas.printAfterSale ? false : true;
        setSavedDatas({ ...savedDatas, printAfterSale: convert });
    };

    return (
        <Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="body1" align="left">
                    {t("configuration.print_after_sale")}
                </Typography>
                <PosTooltip title={t("tooltip.print_after_sale")}>
                    <Switch
                        checked={savedDatas.printAfterSale ? true : false}
                        onChange={onChange}
                        color="secondary"
                    />
                </PosTooltip>
            </Stack>
            <InfoRow label="common.quantity" value="0" valueRef={cart_qty} />
            <InfoRow
                label="common.discount"
                value="0"
                valueRef={cart_discount}
            />

            <InfoRow
                label="common.subtotal"
                value="0.00"
                valueRef={cart_subtotal}
            />

            <InfoRow label="common.vat" value="0.00" valueRef={cart_vat} />
            <InfoRow label="common.total" value="0" valueRef={cart_total} />
            <InfoRow
                label="common.adddisc"
                value="0"
                valueRef={cart_add_discount}
            />

            <InfoRow
                label="common.net_total"
                value="0"
                valueRef={cart_net_total}
            />
        </Stack>
    );
}

export default SalesTotal;
