import { usePage } from "@inertiajs/react";

const customerType = [
    { value: 0, label: "Retail" },
    { value: 1, label: "Wholesale" },
];

const identityType = [
    { value: "TIN", label: "VAT NUMBER/TIN NUMBER" },
    { value: "CRN", label: "CRN NUMBER" },
    { value: "MOM", label: "MOMRA LICENCE NUMBER" },
    { value: "SAG", label: "SAGIA LICENCE NUMBER" },
    { value: "NAT", label: "NATIONAL ID NUMBER" },
    { value: "GCC", label: "GCC ID NUMBER" },
    { value: "IQA", label: "IQAMA NUMBER" },
    { value: "PAS", label: "PASSPORT NUMBER" },
];

const loginHelper = {
    initialValues: {
        username: "",
        password: "",
        store: 1,
    },
};

const itemHelper = {
    dataURLtoFile: (dataurl, filename) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n) {
            u8arr[n - 1] = bstr.charCodeAt(n - 1);
            n -= 1; // to make eslint happy
        }
        return new File([u8arr], { type: mime });
    },
    // uomOptions: [
    //   { value: "1", label: "PCS" },
    //   { value: "2", label: "LTR" },
    //   { value: "3", label: "KG" },
    // ],
    initialValues: (tax_scheme) => {
        return {
            barcode: "",
            item_name: "",
            item_name_ar: "",
            category: "",
            shelf: "",
            description: "",
            cost_price: "0.00",
            unit_price: "0.00",
            wholesale_price: "0.00",
            minimum_price: "0.00",
            reorder_level: "0",
            item_quantity: "0",
            opening_balance: "0",
            unit_type: "1",
            vatList: tax_scheme,
            allowdesc: false,
            pos_view: false,
            is_serialized: false,
            stock_type: true,
        };
    },
};

const BoxedItemHelper = {
    initialValues: (tax_scheme) => {
        return {
            barcode: "",
            item_name: "",
            item_name_ar: "",
            shelf: "",
            category: "",
            description: "",
            cost_price: "0.00",
            unit_price: "0.00",
            wholesale_price: "0.00",
            minimum_price: "0.00",
            // reorder_level: "0",
            // stock_type: false,
            unit_type: "1",
            vatList: tax_scheme,
            allowdesc: false,
            is_serialized: false,
            productList: [],
        };
    },
};

const customerHelper = {
    customerType: customerType,
    identityType: identityType,
    initialValues: {
        name: "",
        comments: "",
        email: "",
        mobile: "",
        street: "",
        additional_street: "",
        city_sub_division: "",
        building_number: "",
        plot_identification: "",
        identity_type: "TIN",
        party_id: "",
        city: "",
        state: "",
        zip: "",
        country: "Saudi Arabia",
        company_name: "",
        account_number: "",
        opening_balance: 0,
        customer_type: customerType[0].value,
        billing_type: true,
    },
    stocks: [
        { value: "stock1", label: "Stock 1" },
        { value: "stock2", label: "Stock 2" },
    ],
};

const supplierHelper = {
    initialValues: {
        name: "",
        email: "",
        mobile: "",
        address_line_1: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        contact_person: "",
        companyname: "",
        account_number: "",
        vat_number: "",
        opening_balance: "0",
        taxable: true,
        comments: "",
    },
};

const employeeHelper = {
    initialValues: {
        name: "",
        email: "",
        mobile: "",
        address_line_1: "",
        comments: "",
        username: "",
        password: "",
        repeat_password: "",
        lang: "en",
        active: true,
        permissions: [],
    },
    initialData: (employeeId, employee) => {
        return new Promise((resolve, reject) => {
            resolve({
                employeeId: employeeId,
                name: employee.name || "",
                email: employee.email || "",
                mobile: employee.mobile || "",
                address_line_1: employee.address_line_1 || "",
                comments: employee.comments || "",
                username: employee.username || "",
                password: "",
                repeat_password: "",
                lang: employee.lang || "1",
                permissions: employee.permissions || "",
                active: employee.status
                    ? employee.status === 1
                        ? true
                        : false
                    : true,
            });
        });
    },
};

const configHelper = {
    initialValues: {
        company_name: "",
        company_name_ar: "",
        company_address: "",
        company_address_ar: "",
        google_review_url: "",
        vat_number: "",
        company_email: "",
        company_telephone: "",
        company_fiscal_year_start: "1",
        return_policy: "",
        return_policy_ar: "",
        whatsapp_web_endpoint: "",
        messaging_method: "",
        quotation_return_policy: "",
        quotation_return_policy_ar: "",
        workorder_return_policy: "",
        workorder_return_policy_ar: "",
        // barcode_billing: false,
        application_lang: "en",
        currency_symbol: "SAR",
        include_tax: false,
        fetch_from_server: false,
        calc_average_cost: true,
        print_after_sale: true,
        always_focus_on_item: true,
        send_email_after_sale: true,
        vatList: [],
        sms_api_username: "",
        sms_api_password: "",
        sms_api_sender_id: "",
        email_smtp_encryption_type: "",
        email_smtp_port: "",
        email_smtp_server: "",
        email_smtp_username: "",
        email_smtp_password: "",
        //BARCODE SETTINGS
        barcode_width: "2",
        barcode_height: "30",
        barcode_lable_width: "4",
        barcode_lable_height: "2",
        barcode_type: "CODE128",
        barcode_row1: "COMPANYNAME",
        barcode_row2: "ITEMNAME",
        barcode_row3: "UNITPRICE",
        barcode_row1_size: "10",
        barcode_row2_size: "10",
        barcode_row3_size: "10",
        barcode_row4_size: "10",
        enable_einvoice: 0,
        invoice_patern: "ABCD-2022",
        egs_crn_number: "",
        egs_city_subdivision: "",
        egs_custom_id: "",
        egs_street: "",
        egs_building_number: "",
        egs_postal_zone: "",
        egs_branch_name: "",
        egs_branch_industry: "",
        egs_city: "",
        egs_plot_identification: "",
        egs_invoice_type: "1100",
        b2bprinting: "STANDARD",
        b2cprinting: "STANDARD",
    },
    api_providers: [],
};

const storeHelper = {
    initialValues: {
        location_name_en: "",
        location_name_ar: "",
        location_address_en: "",
        location_address_ar: "",
        location_mobile: "",
        location_email: "",
        location_building_no: "",
        location_street_name_en: "",
        location_street_name_ar: "",
        location_district_en: "",
        location_district_ar: "",
        location_city_en: "",
        location_city_ar: "",
        location_country_en: "",
        location_country_ar: "",
        location_cr_number: "",
        location_vat_number: "",
    },
};

const tableHelper = {
    initialValues: {
        table_name_en: "",
        table_name_ar: "",
    },
};

const paymentOptionsHelper = {
    initialValues: {
        payment_name_en: "",
        payment_name_ar: "",
        account_id: 201,
    },
};

const unitHelper = {
    initialValues: {
        unit_name_en: "",
        unit_name_ar: "",
    },
};

const workorderStatusHelper = {
    initialValues: {
        status_name_en: "",
        status_name_ar: "",
    },
};

const commonHelper = {
    languages: [
        { value: "en", label: "English" },
        { value: "ar", label: "Arabic" },
    ],
    financial_year: [
        { label: "1st of January", value: "1" },
        { label: "1st of February", value: "2" },
        { label: "1st of March", value: "3" },
        { label: "1st of April", value: "4" },
        { label: "1st of May", value: "5" },
        { label: "1st of Jun", value: "6" },
        { label: "1st of July", value: "7" },
        { label: "1st of August", value: "8" },
        { label: "1st of September", value: "9" },
        { label: "1st of October	", value: "10" },
        { label: "1st of November", value: "11" },
        { label: "1st of December", value: "12" },
    ],
};

const messagingHelper = {
    initialValues: {
        sms_template_en: "",
        sms_template_ar: "",
        email_template_en: "",
        email_template_ar: "",
        whatsapp_template_en: "",
        whatsapp_template_ar: "",
    },
};

export {
    loginHelper,
    itemHelper,
    BoxedItemHelper,
    customerHelper,
    supplierHelper,
    employeeHelper,
    configHelper,
    commonHelper,
    storeHelper,
    tableHelper,
    unitHelper,
    paymentOptionsHelper,
    workorderStatusHelper,
    messagingHelper,
};
