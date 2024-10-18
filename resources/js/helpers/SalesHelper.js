import { postData } from "../apis/apiCalls";
import {
    SAVEQUATATION,
    SAVEWORKORDER,
    GETCASHSALE,
    GETCASHSALERETURN,
    GETCREDITSALE,
    GETCREDITSALERETURN,
    SAVESALE,
    SAVEPURCHASE,
    GETQUATATIONBYID,
    GETWORKORDERBYID,
    SAVEREQUISITION,
    GETQUATATION,
} from "../constants/apiUrls";

function get_item_total(qty, price) {
    return new Promise((resolve, reject) => {
        let total = parseFloat(qty) * parseFloat(price);
        resolve(total);
    });
}

function get_item_total_tax_exclusive(qty, price, tax) {
    return new Promise(async (resolve, reject) => {
        let item_total = await get_item_total(qty, price);
        let item_total_tax_exclusive = parseFloat(item_total) - tax;
        resolve(item_total_tax_exclusive);
    });
}

function calculate_item_subtotal(qty, discount, price, vat, includeTax = 1) {
    return new Promise(async (resolve, reject) => {
        let subtotal = 0;
        if (includeTax === "1") {
            subtotal =
                subtotal +
                (await get_item_total_tax_exclusive(qty, price, vat));
        } else {
            subtotal = subtotal + (await get_item_total(qty, price));
        }
        resolve(subtotal.toFixed(2));
    });
}

function calculate_item_total(qty, discount, price, vat, includeTax = 1) {
    return new Promise(async (resolve, reject) => {
        var total = await calculate_item_subtotal(qty, price, vat, includeTax);

        // if (includeTax) {
        //   total = parseInt(total) + parseInt(vat);
        // }
        //console.log(parseFloat(total) , parseFloat(vat));
        total = parseFloat(total) + parseFloat(vat);

        resolve(parseFloat(total).toFixed(2));
    });
}

function convertCustomerType(type) {
    return type === 1 ? "sales.wholesale" : "sales.retail";
}

function cartBalance(saleType) {
    return new Promise(async (resolve, reject) => {
        let savedHistory = await JSON.parse(localStorage.getItem(saleType));
        if (savedHistory) {
            let cartItems = savedHistory.cartItems;

            let subTotal = cartItems.reduce(function (accumulator, item) {
                return accumulator + parseFloat(item.subTotal);
            }, 0);

            let tax = cartItems.reduce(function (accumulator, item) {
                return accumulator + parseFloat(item.vat);
            }, 0);

            let total = cartItems.reduce(function (accumulator, item) {
                return accumulator + parseFloat(item.total);
            }, 0);

            resolve({ subTotal, total, tax });
        }
    });
}

function submitSales(saleType, cartInfo) {
    return new Promise(async (resolve, reject) => {
        let saveUrl = getSaveLink(saleType);
        postData(saveUrl, cartInfo)
            .then((data) => resolve(data))
            .catch((e) => reject(e));
    });
}

function submitPurchase(cartInfo) {
    return new Promise(async (resolve, reject) => {
        postData(SAVEPURCHASE, cartInfo)
            .then((data) => resolve(data))
            .catch((e) => reject(e));
    });
}

function submitRequisition(cartInfo) {
    return new Promise(async (resolve, reject) => {
        postData(SAVEREQUISITION, cartInfo)
            .then((data) => resolve(data))
            .catch((e) => reject(e));
    });
}

function getSaveLink(saleType) {
    switch (saleType) {
        case "WORKORDER":
            return SAVEWORKORDER;
        case "QUATATION":
            return SAVEQUATATION;
        // case "CASHSALE":
        //   return SAVECASHSALE;
        // case "CASHSALERETURN":
        //   return SAVECASHSALERETURN;
        // case "CREDITSALE":
        //   return SAVECREDITSALE;
        // case "CREDITSALERETURN":
        //   return SAVECREDITSALERETURN;
        default:
            return SAVESALE;
    }
}

function getInvLink(saleType) {
    switch (saleType) {
        case "WORKORDER":
            return GETWORKORDERBYID;
        case "QUATATION":
            return GETQUATATION;
        case "CASHSALE":
            return GETCASHSALE;
        case "CASHSALERETURN":
            return GETCASHSALERETURN;
        case "CREDITSALE":
            return GETCREDITSALE;
        case "CREDITSALERETURN":
            return GETCREDITSALERETURN;
        default:
            return null;
    }
}

const generateSalesData = (data, saleType) => {
    return new Promise(async (resolve, reject) => {
        let storeData = await JSON.parse(localStorage.getItem("store_data"));
        let itemList = data.items.map((item) => {
            let serialnumber = item.serialnumber
                ? `\n Sr : ${item.serialnumber} `
                : "";
            let description = item.description
                ? `\n DESC. : ${item.description}`
                : "";
            return {
                item: `${item.item_name} \n ${item.item_name_ar} ${serialnumber} ${description}`,
                qty: item.sold_quantity,
                unit: item.unit_name,
                price: item.item_unit_price,
                subtotal: item.item_sub_total,
                discount: `${item.discount} ${
                    item.discount_type === "P" ? "[%]" : ""
                }`,
                vat: `${item.tax_amount} [${item.tax_percent}%]`,
                total: item.item_sub_total + item.tax_amount,
            };
        });

        let invDate = new Date(data.created_at);

        let invData = {
            company_data: {
                company_name: storeData.configuration_data.company_name,
                company_name_ar: storeData.configuration_data.company_name_ar,
                company_store_name: storeData.store.location_name_en,
                company_store_name_ar: storeData.store.location_name_ar,
                company_address_1: storeData.store.location_address_en,
                company_address_2: storeData.store.location_city_en,
                company_address_1_ar: storeData.store.location_address_ar,
                company_address_2_ar: storeData.store.location_city_ar,
                company_vat_number: storeData.store.location_vat_number,
                company_phone_number: storeData.store.location_mobile,
            },
            invoice_data: {
                invoice_number: `${saleType} ${data.sale_id}`,
                invoice_date: data.sale_time,
                invoice_date_hijri: data.created_at,
                total_as_english: data.total_en,
                total_as_arabic: data.total_ar,
                subTotal: data.sub_total,
                totalVat: data.tax,
                total: data.total,
                discount: data.discount,
                payment: data.payment,
                net_amount: data.total - data.discount,
                customer_name:
                    data.customer.length > 0 ? data.customer[0].name : "",
                customer_vat:
                    data.customer.length > 0
                        ? data.customer[0].vat_number
                            ? data.customer[0].vat_number
                            : null
                        : "",
                customer_address:
                    data.customer.length > 0
                        ? data.customer[0].company_name
                        : "",
                body: itemList,
                qrData: data.qr_codes,
            },
        };
        resolve(invData);
    });
};

const generateQutationOrWorkorderData = (data, saleType) => {
    return new Promise(async (resolve, reject) => {
        let storeData = await JSON.parse(localStorage.getItem("store_data"));

        let itemList = data.items.map((item) => {
            let serialnumber = item.serialnumber
                ? `\n Ser : ${item.serialnumber} `
                : "";
            let description = item.description
                ? `\n DESC. : ${item.description}`
                : "";

            return {
                item: `${item.item_name} \n ${item.item_name_ar} ${serialnumber} ${description}`,
                qty: item.quotation_quantity,
                unit: item.unit,
                price: item.item_unit_price,
                subtotal: item.item_sub_total,
                discount: `${item.discount} ${
                    item.discount_type === "P" ? "[%]" : ""
                }`,
                vat: `${item.tax_amount} [${item.tax_percent}%]`,
                total: item.item_sub_total + item.tax_amount,
            };
        });

        let invData = {
            company_data: {
                company_name: storeData.configuration_data.company_name,
                company_name_ar: storeData.configuration_data.company_name_ar,
                company_store_name: storeData.store.location_name_en,
                company_store_name_ar: storeData.store.location_name_ar,
                company_address_1: storeData.store.location_address_en,
                company_address_2: storeData.store.location_city_en,
                company_address_1_ar: storeData.store.location_address_ar,
                company_address_2_ar: storeData.store.location_city_ar,
                company_vat_number: storeData.store.location_vat_number,
                company_phone_number: storeData.store.location_mobile,
            },
            invoice_data: {
                invoice_number: `${saleType} ${
                    saleType === "WORKORDER"
                        ? data.workorder_id
                        : data.quotation_id
                }`,
                invoice_date: data.created_at,
                invoice_date_hijri: data.created_at,
                total_as_english: data.total_en,
                total_as_arabic: data.total_ar,
                subTotal: data.sub_total,
                totalVat: data.tax,
                total: data.total,
                customer_name: data.customer[0].name,
                customer_vat: data.customer[0].vat_number
                    ? data.customer[0].vat_number
                    : null,
                customer_address: data.customer[0].company_name,
                body: itemList,
                qrData: data.qr_codes,
            },
        };
        resolve(invData);
    });
};

const round_amount = ({ number = 0, precision = 2 }) => {
    const sign = Math.sign(number);
    const power = 10 ** precision;
    return (sign * Math.round(Math.abs(number) * power)) / power;
};

export {
    calculate_item_subtotal,
    calculate_item_total,
    convertCustomerType,
    submitSales,
    cartBalance,
    getInvLink,
    generateQutationOrWorkorderData,
    generateSalesData,
    submitPurchase,
    submitRequisition,
};
