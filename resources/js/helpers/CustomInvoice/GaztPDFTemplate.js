import StandaredPDFBase from "./StandaredPDFBase";

class GaztPDFTemplate extends StandaredPDFBase {
    generateHead = () => {
        const CENTER = {
            align: "center",
        };

        const RIGHT = {
            align: "right",
        };

        const companyData = this.invoiceData.company_data;
        const invoiceData = this.invoiceData.invoice_data;
        const customerDetails = this.invoiceData.customer_details;

        //draw border lines
        // this.doc.roundedRect(10, 5, 190, 90, 1, 1);
        // this.doc.line(10, 30, 200, 30);

        this.doc.roundedRect(70, 5, 70, 8, 0, 0);
        this.doc.roundedRect(10, 15, 190, 13, 1, 2);

        // this.doc.line(10, 13, 200, 13);
        this.doc.roundedRect(10, 30, 190, 32, 1, 1);
        this.doc.roundedRect(10, 64, 190, 27, 1, 1);
        // this.doc.roundedRect(10, 31, 190, 65, 1, 1);
        // this.doc.line(10, 64, 200, 64);

        this.doc.setFontSize(12);

        this.doc.text(
            105,
            10,
            `${this.template.title} / ${this.template.title_ar}`,
            CENTER
        );
        this.doc.setFontSize(10);
        this.doc.text(12, 20, `INVOICE NO / رقم الفاتورة :`);
        this.doc.text(
            55,
            20,
            `${invoiceData.invoicePatern}-${invoiceData.invoice_number}`
        );
        this.doc.text(12, 25.5, `SALES TYPE / نوع المبيعات :`);
        this.doc.text(55, 25.5, this.SaleType);

        this.doc.text(
            197,
            20,
            `:                          DATE / تاريخ`,
            RIGHT
        );
        this.doc.text(150, 20, invoiceData.invoice_date, RIGHT);
        this.doc.text(197, 25.5, `:  HIJRI DATE / التاريخ الهجري`, RIGHT);
        this.doc.text(150, 25.5, this.hijriDate, this.RTL);
        // this.doc.setFontSize(10);

        this.doc.setFontSize(16);
        this.doc.setTextColor(this.head_color);
        this.doc.text(197, 36, companyData.company_name_ar, RIGHT);
        this.doc.text(12, 36, companyData.company_name);
        this.doc.setTextColor(this.address_color);

        this.doc.setFontSize(12);
        this.doc.text(197, 41.5, companyData.location_store_name_ar, RIGHT);
        this.doc.text(12, 41.5, companyData.location_store_name);

        this.doc.setFontSize(9);

        //company details
        //street
        this.doc.text(197, 46, `:       Street /  اسم الشارع`, RIGHT);
        this.doc.text(162, 46, companyData.location_city_ar, RIGHT);

        //District
        this.doc.text(197, 50, `:                 District /   حي`, RIGHT);
        this.doc.text(
            162,
            50,
            companyData.location_district_ar
                ? companyData.location_district_ar
                : companyData.location_district_en,
            RIGHT
        );

        //postal code
        this.doc.text(197, 53.5, `: Postal Code / رمز بريدي`, RIGHT);
        this.doc.text(162, 53.5, companyData.postal_code, RIGHT);

        //VAT no
        this.doc.text(197, 57.5, `:       VAT No. / رقم ضريبة`, RIGHT);
        this.doc.text(162, 57.5, companyData.company_vat_number, RIGHT);

        //Other ID
        this.doc.text(197, 61, `:                Phone / تليفون`, RIGHT);
        this.doc.text(162, 61, companyData.location_phone_number, RIGHT);

        //city
        this.doc.text(12, 46, `City / مدينة`);
        this.doc.text(53, 46, `:`);
        this.doc.text(55, 46, companyData.location_city_ar);

        //Country
        this.doc.text(12, 50, `Country /بلد`);
        this.doc.text(53, 50, `:`);
        this.doc.text(55, 50, companyData.location_country_ar);

        //Building Number
        this.doc.text(12, 53.5, `Building Number / رقم المبنى :`);
        this.doc.text(55, 53.5, companyData.location_building_no);

        //Additional No.
        //     this.doc.text(12, 57.5, `Additional No. / رقم إضافي      :`);
        //     this.doc.text(55, 57.5, invoiceData.invoice_date);

        //     //Other ID
        //     this.doc.text(12, 61, `Other ID / معرف الآخر`);
        //     this.doc.text(53, 61, `:`);
        //     this.doc.text(55, 61, invoiceData.invoice_date);
        //     this.doc.setTextColor("#000");
        ///customer name

        //street
        if (customerDetails.name) {
            this.doc.setFontSize(11);
            this.doc.text(
                162,
                69,
                customerDetails.company_name
                    ? `${customerDetails.name} [${customerDetails.company_name}]`
                    : customerDetails.name,
                RIGHT
            );
        }
        this.doc.setFontSize(9);
        if (customerDetails.details.street) {
            this.doc.text(162, 73, customerDetails.details.street, RIGHT);
        }

        if (customerDetails.details.district) {
            this.doc.text(162, 77, customerDetails.details.district, RIGHT);
        }

        if (customerDetails.details.zip) {
            this.doc.text(162, 80.5, customerDetails.details.zip, RIGHT);
        }

        if (customerDetails.party_id) {
            this.doc.text(162, 84, customerDetails.party_id, RIGHT);
        }

        if (customerDetails.mobile) {
            this.doc.text(162, 88, customerDetails.mobile, RIGHT);
        }

        if (customerDetails.details.city) {
            this.doc.text(55, 73, customerDetails.details.city);
        }

        if (customerDetails.details.country) {
            this.doc.text(55, 77, customerDetails.details.country);
        }

        if (customerDetails.details.building_number) {
            this.doc.text(55, 80.5, customerDetails.details.building_number);
        }

        // this.doc.text(55, 84, invoiceData.additional_street);

        // this.doc.text(55, 88, invoiceData.other_id);

        this.doc.text(197, 69, `:  Customer /  اسم الشارع`, RIGHT);
        //street
        this.doc.text(197, 73, `:       Street /  اسم الشارع`, RIGHT);
        //District
        this.doc.text(197, 77, `:                 District /   حي`, RIGHT);
        //postal code
        this.doc.text(197, 80.5, `: Postal Code / رمز بريدي`, RIGHT);
        //VAT no
        this.doc.text(197, 84, `:       VAT No. / رقم ضريبة`, RIGHT);
        //Other ID
        this.doc.text(197, 88, `:                Phone / تليفون`, RIGHT);
        //city
        this.doc.text(12, 73, `City / مدينة`);
        this.doc.text(53, 73, `:`);
        //Country
        this.doc.text(12, 77, `Country /بلد`);
        this.doc.text(53, 77, `:`);
        //Building Number
        this.doc.text(12, 80.5, `Building Number / رقم المبنى :`);
        //Additional No.
        this.doc.text(12, 84, `Additional No. / رقم إضافي      :`);
        //Other ID
        this.doc.text(12, 88, `Other ID / معرف الآخر`);
        this.doc.text(53, 88, `:`);
    };
}

export default GaztPDFTemplate;
