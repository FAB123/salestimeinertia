import StandaredPDFBase from "./StandaredPDFBase";

class StandardPDF extends StandaredPDFBase {
    getSalesType(type) {
        const salesTypes = {
            CAS: "CASH SALE",
            CASR: "CASH SALE - RETURN",
            CRS: "CREDIT SALE",
            CRSR: "CREDIT SALE - RETURN",
        };
        return salesTypes[type] || "CASH SALE";
    }

    generateHead = () => {
        const CENTER = { align: "center" };
        const { company_data, invoice_data, customer_details } =
            this.invoiceData;
        const {
            company_name,
            location_store_name,
            location_address_en,
            company_vat_number,
            location_phone_number,
            company_name_ar,
            location_store_name_ar,
            location_address_ar,
        } = company_data;

        console.log(invoice_data);

        const setHeaderText = (x, y, text, options = {}) =>
            this.doc.text(x, y, text, options);

        this.doc.setTextColor(this.head_color).setFontSize(13);
        setHeaderText(10, 18, company_name);

        this.doc.setTextColor(this.address_color).setFontSize(10);
        setHeaderText(10, 23, location_store_name);
        setHeaderText(10, 27, location_address_en);
        setHeaderText(10, 34, `VAT NUMBER: ${company_vat_number}`);
        setHeaderText(10, 37.5, `PHONE: ${location_phone_number}`);

        this.doc.setTextColor(this.head_color).setFontSize(15);
        setHeaderText(200, 18, company_name_ar, this.RTL);
        this.doc.setTextColor(this.address_color).setFontSize(10);
        setHeaderText(200, 23, location_store_name_ar, this.RTL);
        setHeaderText(200, 27, location_address_ar, this.RTL);
        setHeaderText(
            200,
            34,
            `رقم الضريبة: ${company_vat_number}`,
            this.RTL
        );
        setHeaderText(200, 37.5, `تلفن: ${location_phone_number}`, this.RTL);

        this.doc.setTextColor("#000").setDrawColor(0).setLineWidth(0.3);
        this.doc.roundedRect(10, 39, 190, 22.5, 1, 1, "D");

        this.doc.setFontSize(8);
        setHeaderText(
            105,
            43,
            this.getSalesType(invoice_data.invoice_sale_type),
            CENTER
        );
        setHeaderText(12, 43, invoice_data.invoice_date);
        setHeaderText(198, 43, this.hijriDate, this.RTL);
        setHeaderText(12, 53, "CUSTOMER NAME");
        setHeaderText(12, 56.5, "CUSTOMER VAT NUMBER");
        setHeaderText(12, 60.5, "CUSTOMER ADDRESS");
        setHeaderText(199, 53, "اسم الزبون", this.RTL);
        setHeaderText(199, 56.5, "رقم ضريبة العميل", this.RTL);
        setHeaderText(199, 60.5, "عنوان العميل", this.RTL);
        setHeaderText(12, 48.2, this.template.sequence_type);
        setHeaderText(199, 48.2, this.template.sequence_type_ar, this.RTL);

        this.doc.setTextColor("red");
        setHeaderText(
            105,
            48.2,
            `${invoice_data.invoicePatern}-${invoice_data.invoice_number}`,
            CENTER
        );
        this.doc.setTextColor("#000");

        if (customer_details) {
            const {
                name,
                party_id,
                details: { street, city, state } = {},
            } = customer_details;
            const address = [street, city, state].filter(Boolean).join(" ");

            setHeaderText(105, 53, name, CENTER);
            setHeaderText(105, 56.5, party_id || "", CENTER);
            setHeaderText(105, 60.5, address, CENTER);
        }

        this.doc.line(10, 44.5, 200, 44.5).line(10, 50, 200, 50);

        this.doc.setFontSize(10);
        setHeaderText(105, 9, this.template.title_ar, {
            isOutputRtl: true,
            align: "center",
        });
        setHeaderText(105, 13, this.template.title, {
            align: "center",
        });
    };
    generateHead1 = () => {
        const CENTER = {
            align: "center",
        };

        const companyData = this.invoiceData.company_data;
        const invoiceData = this.invoiceData.invoice_data;
        const customerDetails = this.invoiceData.customer_details;

        console.log(invoiceData);

        this.doc.setTextColor(this.head_color);
        this.doc.setFontSize(13);
        this.doc.text(10, 18, companyData.company_name);
        // this.doc.setTextColor("#4d4dff");

        this.doc.setTextColor(this.address_color);
        // this.doc.setFontSize(13);
        this.doc.text(10, 23, companyData.location_store_name);

        this.doc.setFontSize(10);
        this.doc.text(10, 27, companyData.location_address_en);
        // this.doc.text(10, 23, this.invoiceData.company_data.company_address_2);
        this.doc.text(
            10,
            33.5,
            `VAT NUMBER: ${companyData.company_vat_number}`
        );
        this.doc.text(10, 37.5, `PHONE: ${companyData.location_phone_number}`);

        this.doc.setFontSize(15);
        this.doc.setTextColor(this.head_color);

        this.doc.text(200, 18, companyData.company_name_ar, this.RTL);
        this.doc.setTextColor(this.address_color);
        this.doc.text(200, 23, companyData.location_store_name_ar, this.RTL);

        this.doc.setFontSize(10);
        this.doc.text(200, 27, companyData.location_address_ar, this.RTL);
        // this.doc.text(
        //   200,
        //   23,
        //   this.invoiceData.company_data.company_address_2_ar,
        //   this.RTL
        // );
        this.doc.text(
            200,
            33.5,
            `رقم الضريبة: ${companyData.company_vat_number}`,
            this.RTL
        );
        this.doc.text(
            200,
            37.5,
            `تلفن: ${companyData.location_phone_number}`,
            this.RTL
        );
        this.doc.setTextColor("#000");
        //customer informations
        this.doc.setDrawColor(0);
        this.doc.setLineWidth(0.3);
        this.doc.roundedRect(10, 39, 190, 22.5, 1, 1, "D");

        this.doc.setFontSize(8);
        this.doc.text(
            105,
            43,
            this.getSalesType(invoiceData.sale_type),
            CENTER
        );
        this.doc.text(12, 43, invoiceData.invoice_date);
        this.doc.text(198, 43, this.hijriDate, this.RTL);

        this.doc.text(12, 54, "CUSTOMER NAME");
        this.doc.text(12, 57.5, "CUSTOMER VAT NUMBER");
        this.doc.text(12, 60.5, "CUSTOMER ADDRESS");

        this.doc.text(199, 54, "اسم الزبون", this.RTL);
        this.doc.text(199, 57.5, "رقم ضريبة العميل", this.RTL);
        this.doc.text(199, 60.5, "عنوان العميل", this.RTL);

        this.doc.text(12, 48.2, this.template.sequence_type);
        this.doc.text(199, 48.2, this.template.sequence_type_ar, this.RTL);

        this.doc.setTextColor("red");

        this.doc.text(
            105,
            48.2,
            `${invoiceData.invoicePatern}-${invoiceData.invoice_number}`,
            CENTER
        );

        this.doc.setTextColor("#000");

        if (customerDetails) {
            const { name, party_id, details } = customerDetails;
            const { street, city, state } = details;

            this.doc.text(105, 54, name, CENTER);
            this.doc.text(105, 57.5, party_id || "", CENTER);

            const addressParts = [street, city, state].filter(Boolean);
            const address = addressParts.join(" ");

            this.doc.text(105, 60.5, address, CENTER);
        }

        this.doc.line(10, 44.5, 200, 44.5);
        this.doc.line(10, 50, 200, 50);

        //description & date and time
        // this.doc.roundedRect(10, 2, 190, 6, 1, 1);
        this.doc.setFontSize(10);
        // this.doc.text(12, 60, invoiceData.invoice_date);
        // this.doc.text(198, 60, this.hijriDate, this.RTL);

        this.doc.text(105, 9, this.template.title_ar, {
            isOutputRtl: true,
            align: "center",
        });
        this.doc.text(105, 13, this.template.title, {
            align: "center",
            rotationDirection: 1,
        });

        // this.doc.roundedRect(75, 2, 60, 8, 1, 1, "D");

        // this.doc.line(10, 15, 10, 15);
    };
}

export default StandardPDF;
