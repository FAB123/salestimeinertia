import { B2CSALE } from "../../constants/constants";

class PrintEngine {
    constructor(data, saleType, storeData, configurationData) {
        this.storeData = storeData;
        this.configurationData = configurationData;
        this.saleType = saleType;
        this.data = data;
    }

    get templatesType() {
        if (this.data.bill_type === B2CSALE) {
            return this.configurationData.b2cprinting;
        } else {
            return this.configurationData.b2bprinting;
        }
    }

    get invoiceTemplate() {
        console.log(this.data?.bill_type);
        return this.data?.bill_type;
    }

    get invoicePatern() {
        return this.configurationData.invoice_patern;
    }

    generateInvoiceData() {
        let itemList = this.data.items.map((item) => {
            const {
                item_name,
                item_name_ar,
                serialnumber,
                description,
                quantity,
                unit_name,
                item_unit_price,
                item_sub_total,
                discount,
                discount_type,
                tax_amount,
                tax_percent,
            } = item;

            let serialNumberText = serialnumber
                ? `\n Sr : ${serialnumber}`
                : "";
            let descriptionText = description
                ? `\n DESC. : ${description}`
                : "";

            let arabicText = item_name_ar ? `\n ${item_name_ar}` : "\n";

            let discountText = `${discount} ${
                discount_type === "P" ? "[%]" : ""
            }`;
            let vatText = `${tax_amount} [${tax_percent}%]`;
            let total = item_sub_total + tax_amount;

            return {
                item: `${item_name} ${arabicText} ${serialNumberText} ${descriptionText}`,
                item_name,
                item_name_ar,
                serialnumber,
                description,
                qty: quantity,
                unit: unit_name,
                price: item_unit_price,
                subtotal: item_sub_total,
                discount: discountText,
                vat: vatText,
                total,
            };
        });

        const returnPolicies = {
            WORKORDER: {
                return_policy: this.configurationData.workorder_return_policy,
                return_policy_ar:
                    this.configurationData.workorder_return_policy_ar,
            },
            QUOTATION: {
                return_policy: this.configurationData.quotation_return_policy,
                return_policy_ar:
                    this.configurationData.quotation_return_policy_ar,
            },
            DEFAULT: {
                return_policy: this.configurationData.return_policy,
                return_policy_ar: this.configurationData.return_policy_ar,
            },
        };

        const return_policy =
            returnPolicies[this.saleType] || returnPolicies.DEFAULT;

        return {
            company_data: {
                company_name: this.configurationData.company_name,
                company_name_ar: this.configurationData.company_name_ar,
                company_address: this.configurationData.company_address,
                company_address_ar: this.configurationData.company_address_ar,
                return_policy: return_policy.return_policy,
                return_policy_ar: return_policy.return_policy_ar,
                postal_code: this.configurationData.egs_postal_zone,
                company_vat_number: this.configurationData.vat_number,
                location_store_name: this.storeData.location_name_en,
                location_store_name_ar: this.storeData.location_name_ar,
                location_address_en: this.storeData.location_address_en,
                location_address_ar: this.storeData.location_address_ar,
                location_email: this.storeData.location_email,
                location_mobile: this.storeData.location_mobile,
                location_street_name_en: this.storeData.location_street_name_en,
                location_street_name_ar: this.storeData.location_street_name_ar,
                location_building_no: this.storeData.location_building_no,
                location_country_ar: this.storeData.location_country_ar,
                location_country_en: this.storeData.location_country_en,
                location_district_ar: this.storeData.location_district_ar,
                location_district_en: this.storeData.location_district_en,
                location_city_en: this.storeData.location_city_en,
                location_city_ar: this.storeData.location_city_ar,
                location_phone_number: this.storeData.location_mobile,
            },
            customer_details: this.data.customer ? this.data.customer : null,
            // `${this.saleType} ${this.data.sale_id}`
            payment: this.data.payment,
            invoice_data: {
                invoice_number: this.data.transaction_id,
                invoicePatern: this.configurationData.invoice_patern,
                sale_type: this.saleType,
                invoice_sale_type: this.data.sale_type,
                invoice_date: this.data.transaction_time,
                invoice_date_hijri: this.data.created_at,
                total_as_english: this.data.total_en,
                total_as_arabic: this.data.total_ar,
                subTotal: this.data.sub_total,
                totalVat: this.data.tax,
                total: this.data.total,
                discount: this.data.discount,
                net_amount: this.data.total - this.data.discount,
                body: itemList,
                qrData: this.data.qr_codes,
            },
        };
    }
}

export default PrintEngine;
