import { B2BSALE, B2CSALE, toCurrency } from "../../constants/constants";
import jsPDF from "jspdf";
import cairo from "../../font/IBMPlexSansArabic-Medium.ttf";
import autoTable from "jspdf-autotable";
import { toHijri } from "../HijriConverter";

class StandaredPDFBase {
    constructor(invoiceData, companyLogo, invoiceTemplate, view = false) {
        this.invoice_templates = invoiceTemplate;
        this.company_logo = companyLogo;
        this.invoiceData = invoiceData;
        this.view = view;
        this.height = 63.5;
        this.bottom = 50;
        this.water_x = 50;
        this.water_y = 200;
        this.water_size = 35;
        this.watermark_angle = 40;
        this.watermark = true;
        this.head_color = "#000";
        this.address_color = "#000";
        this.item_font_size = 8;
        this.rpposition_en = 270;
        this.rpposition_ar = 270;
        this.rp_font_size = 9;
        this.tamount_desc_color = "#e6005c";
        this.tamount_color = "#ff0000";
        this.clogo_x = 105;
        this.clogo_y = 20;
        this.clogo_size = 30;
        this.clogo = false;
        let splitedDate = invoiceData.invoice_data.invoice_date
            .split(" ")[0]
            .split("-");

        this.hijriDate = toHijri(
            splitedDate[2],
            splitedDate[1],
            splitedDate[0]
        );
        this.RTL = {
            isOutput: true,
            align: "right",
        };
    }

    createWatermark() {
        if (this.watermark) {
            this.doc.saveGraphicsState();
            this.doc.setFontSize(this.water_size);
            this.doc.setTextColor("#000");
            this.doc.setGState(new this.doc.GState({ opacity: 0.1 }));
            this.doc.text(
                `${this.invoiceData.company_data.location_store_name_ar}`,
                this.water_x,
                this.water_y,
                {
                    angle: this.watermark_angle,
                    // baseline: "middle",
                    // align: "left",
                    baseline: "center",
                    align: "center",
                }
            );
            this.doc.restoreGraphicsState();

            // doc.setFontSize(8);
        }

        // if (this.company_logo) {
        //     if (this.clogo) {
        //         this.doc.addImage(
        //             this.company_logo,
        //             "png",
        //             this.clogo_x,
        //             this.clogo_y,
        //             this.clogo_size,
        //             this.clogo_size,
        //             "",
        //             "FAST"
        //         );
        //     }
        // }

        if (this.company_logo && this.clogo) {
            this.doc.addImage(
                this.company_logo,
                "png",
                this.clogo_x,
                this.clogo_y,
                this.clogo_size,
                this.clogo_size,
                "",
                "FAST"
            );
        }
    }

    set setPDFHight(height) {
        this.height = height;
    }

    set setSaleType(type) {
        this.SaleType = type;
    }

    set loadTemplate(type) {
        const template = this.invoice_templates.find(
            (item) => item.template_name === type
        );
        var object = template.options.reduce(
            (obj, item) => Object.assign(obj, { [item.item]: item.value }),
            {}
        );

        if (type === "GAZT" || type === "STANDARD") {
            this.height = parseInt(object.item_start);
            this.bottom = parseInt(object.item_end);
            this.water_x = parseInt(object.watermark_x);
            this.water_y = parseInt(object.watermark_y);
            this.water_size = parseInt(object.watermark_size);
            this.watermark_angle = parseInt(object.watermark_angle);
            this.watermark = parseInt(object.watermark) === 1 ? true : false;
            this.head_color = object.head_color;
            this.address_color = object.address_color;
            this.item_font_size = parseInt(object.item_font_size);

            //return policy setup
            this.rpposition_en = parseInt(object.rpposition_en);
            this.rpposition_ar = parseInt(object.rpposition_ar);
            this.rp_font_size = parseInt(object.rp_font_size);
            //total amount color
            this.tamount_desc_color = object.tamount_desc_color;
            this.tamount_color = object.tamount_color;

            //company logo
            this.clogo_x = parseInt(object.clogo_x);
            this.clogo_y = parseInt(object.clogo_y);
            this.clogo_size = parseInt(object.clogo_size);
            this.clogo = parseInt(object.clogo) === 1 ? true : false;
        }
    }

    set templateData(type) {
        const blueColor = [41, 128, 185]; //Blue
        // const sangiColor = [230, 138, 0]; //Sangi
        const blackColor = [0, 0, 0]; //Black
        const greenColor = [26, 188, 156]; //Green
        var variables = {};
        console.log("hell" + type);
        if (type === B2CSALE) {
            variables = {
                showQr: true,
                template_type: "INV",
                sequence_type: "INVOICE NUMBER",
                sequence_type_ar: "رقم الفاتورة",
                title: "Simplified Tax Invoice",
                title_ar: "فاتورة ضريبية مبسطة",
                color: blueColor,
            };
        } else if (type === B2BSALE) {
            variables = {
                showQr: true,
                template_type: "INV",
                sequence_type: "INVOICE NUMBER",
                sequence_type_ar: "رقم الفاتورة",
                title: "Tax Invoice",
                title_ar: "فاتورة ضريبية",
                color: blackColor,
            };
        } else if (type === "QUOTATION") {
            variables = {
                showQr: false,
                template_type: "QUT",
                sequence_type: "QUOTATION NUMBER",
                sequence_type_ar: "رقم الإقتباس",
                title: "QUOTATION",
                title_ar: "اقتباس",
                color: greenColor,
            };
        } else {
            variables = {
                showQr: false,
                showQr: false,
                template_type: "WORK",
                sequence_type: "WORKORDER NUMBER",
                sequence_type_ar: "رقم الإقتباس",
                title: "WORKORDER",
                title_ar: "اقتباس",
                color: greenColor,
            };
        }
        this.template = {
            showQr: variables.showQr,
            template_type: variables.template_type,
            sequence_type: variables.sequence_type,
            sequence_type_ar: variables.sequence_type_ar,
            title: variables.title,
            title_ar: variables.title_ar,
            head: [
                {
                    item: "Item",
                    qty: "QTY.",
                    unit: "UoM.",
                    price: "PRICE",
                    subtotal: "SUBTOTAL",
                    discount: "DISC.",
                    vat: "VAT",
                    total: "TOTAL",
                },
                {
                    item: "العنصر",
                    qty: "الكمية",
                    unit: "",
                    price: "سعر",
                    subtotal: "المجموع الفرعي",
                    discount: "حسم",
                    vat: "الضريبة",
                    total: "المجموع",
                },
            ],
            headStyles: {
                fillColor: variables.color,
                drawColor: "#000",
                font: "cairo",
                fontSize: 7,
                halign: "center",
                cellPadding: 0.5,
            },
            columns: [
                { header: "Item", dataKey: "item" },
                { header: "QTY.", dataKey: "qty" },
                { header: "UoM.", dataKey: "unit" },
                { header: "PRICE", dataKey: "price" },
                { header: "SUBTOTAL", dataKey: "subtotal" },
                { header: "DISCOUNT", dataKey: "discount" },
                { header: "VAT", dataKey: "vat" },
                { header: "TOTAL", dataKey: "total" },
            ],
            columnStyles: {
                tableLineColor: 0,
                overflow: "linebreak",
                lineColor: 0,
                lineWidth: 0.4,
                cellPadding: 0.6,
                item: {
                    cellWidth: 83,
                    halign: "left",
                    font: "cairo",
                },
                unit: { font: "cairo", cellWidth: 15 },
                price: { halign: "center", cellWidth: 15 },
                qty: { halign: "center", cellWidth: 12 },
                discount: { halign: "center", cellWidth: 10 },
                subtotal: { halign: "center", cellWidth: 20 },
                vat: { halign: "center", cellWidth: 15 },
                total: { halign: "center", cellWidth: 20 },
            },
            footerData: {
                returnPolicy: this.invoiceData.company_data.return_policy,
                returnPolicyAr: this.invoiceData.company_data.return_policy_ar,
            },
        };
    }

    set generateFooter(totalPagesExp) {
        var str = "Page " + this.doc.internal.getNumberOfPages();
        if (typeof this.doc.putTotalPages === "function") {
            str = str + " of " + totalPagesExp;
        }
        this.doc.setTextColor("#000");
        this.doc.setFontSize(this.rp_font_size);
        this.doc.roundedRect(10, 267, 190, 25, 1, 1);
        this.doc.text(`${str} `, 182, 291);
        this.doc.text(
            12,
            this.rpposition_en,
            this.template.footerData.returnPolicy,
            {
                maxWidth: 90,
            }
        );

        if (this.template.showQr) {
            this.doc.addImage(
                this.invoiceData.invoice_data.qrData,
                "png",
                178,
                268,
                20,
                20,
                "",
                "FAST"
            );
            this.doc.text(
                176,
                this.rpposition_ar,
                this.template.footerData.returnPolicyAr,
                {
                    ...this.RTL,
                    maxWidth: 90,
                }
            );
        } else {
            this.doc.text(200, 270, this.template.footerData.returnPolicyAr, {
                ...this.RTL,
                maxWidth: 90,
            });
        }
        this.doc.setFontSize(9);
        this.doc.setTextColor("#1a1aff");

        this.doc.text(
            8,
            200,
            `${this.invoiceData.company_data.company_name} - ${this.invoiceData.company_data.company_address}`,
            { angle: 90, align: "justify" }
        );
        this.doc.text(
            203,
            175,
            `${this.invoiceData.company_data.company_name_ar} - ${this.invoiceData.company_data.company_address_ar}`,
            { angle: 90, align: "justify", isOutput: true }
        );
    }

    get generateprinter() {
        this.doc = new jsPDF("p", "mm", "a4", true);
        this.doc.setDrawColor(0, 0, 0);
        this.doc.setTextColor(0, 0, 0);
        var totalPagesExp = "{total_pages_count_string}";
        this.doc.addFont(cairo, "cairo", "normal");
        //header
        this.doc.setFont("cairo"); // set font
        this.doc.setFontSize(10);
        autoTable(this.doc, {
            margin: {
                top: this.height,
                bottom: this.bottom,
                left: 10,
                right: 10,
            },
            styles: {
                lineColor: 0,
                fontSize: this.item_font_size,
                cellPadding: 0.5,
                valign: "middle",
            },
            pageBreak: "auto",
            tableLineColor: 10, // number, array (see color section below)
            tableLineWidth: 0.4,
            theme: "grid",
            head: this.template.head,
            headStyles: this.template.headStyles,
            columns: this.template.columns,
            columnStyles: this.template.columnStyles,
            body: this.invoiceData.invoice_data.body,
            didDrawPage: () => {
                this.generateHead();
                this.createWatermark();
                this.generateFooter = totalPagesExp;
            },
            footStyles: {
                // fillColor: [41, 128, 185], //blue
                fillColor: [0, 0, 0], //black
                font: "cairo",
            },

            // foot: this.generateFooterData(),
        });

        this.doc.line(10, this.height, 10, 237.5);
        this.doc.line(200, this.height, 200, 237.5);
        this.doc.autoTable({
            theme: "grid",
            tableLineWidth: 0.4,
            columnStyles: {
                info: { halign: "center", cellWidth: 100, font: "cairo" },
                arabic: {
                    halign: "center",
                    cellWidth: 30,
                    font: "cairo",
                    textColor: this.tamount_desc_color,
                },
                english: {
                    halign: "center",
                    cellWidth: 30,
                    font: "cairo",
                    textColor: this.tamount_desc_color,
                },
                amount: {
                    halign: "center",
                    font: "cairo",
                    textColor: this.tamount_color,
                },
            },
            body: this.generateFooterData(),
            startY: 237.5,
            tableLineColor: 10, // number, array (see color section below)
            styles: {
                overflow: "hidden",
                lineColor: 0,
                lineWidth: 0.4,
                cellPadding: 0.6,
                margin: 0,
            },
            margin: { right: 10, left: 100 },
        });

        if (typeof this.doc.putTotalPages === "function") {
            this.doc.putTotalPages(totalPagesExp);
        }

        this.generatePayment();
        return true;
    }

    generateFooterData() {
        let totalData = [
            {
                english: "SUBTOTAL",
                arabic: "المجموع الفرعي",
                amount: toCurrency(this.invoiceData.invoice_data.subTotal),
            },
            {
                english: "VAT",
                arabic: "ضريبة",
                amount: toCurrency(this.invoiceData.invoice_data.totalVat),
            },
            {
                english: "TOTAL",
                arabic: "المجموع",
                amount: toCurrency(this.invoiceData.invoice_data.total),
            },
        ];
        if (this.template.template_type === "INV") {
            totalData.push(
                {
                    english: "DISCOUNT",
                    arabic: "حسم",
                    amount: toCurrency(this.invoiceData.invoice_data.discount),
                },
                {
                    english: "NET AMOUNT",
                    arabic: "المبلغ الإجمالي",
                    amount: toCurrency(
                        this.invoiceData.invoice_data.net_amount
                    ),
                }
            );
        }
        return totalData;
    }

    generatePayment() {
        this.doc.setDrawColor(7);
        this.doc.line(10, 237.5, 100, 237.5);
        this.doc.line(10, 237.5, 10, 253.5);
        this.doc.line(10, 253.5, 100, 253.5);
        if (this.template.template_type === "INV") {
            // let payment_details = "";
            // this.invoiceData.payment.map((payment) => {
            //     payment_details += `${payment.payment_name_en} [${payment.payment_name_ar} ] : ${payment.amount} SR ,  `;
            // });

            // let payment_details = this.invoiceData.payment.map((payment) =>
            //     // `${payment.payment_name_en} ${payment.payment_name_ar} : ${payment.amount} SR`
            //     this.doc.text(12, 241, payment.payment_name_en, {
            //         maxWidth: 100,
            //     })
            // );

            let y = 242;
            this.invoiceData.payment.forEach((item) => {
                this.doc.text(15, y, item.payment_name_en, {
                    maxWidth: 100,
                });
                this.doc.text(50, y, `${item.amount} SAR`, {
                    maxWidth: 100,
                    align: "center",
                });
                this.doc.text(95, y, `${item.payment_name_ar}`, {
                    maxWidth: 100,
                    align: "right",
                });
                y = y + 4;
            });

            this.doc.text(
                12,
                257,
                this.invoiceData.invoice_data.total_as_english
                    ? `${this.invoiceData.invoice_data.total_as_english.toUpperCase()} RIYAL SAUDI`
                    : "",
                {
                    maxWidth: 100,
                }
            );
            this.doc.text(
                98,
                262,
                this.invoiceData.invoice_data.total_as_arabic
                    ? `${this.invoiceData.invoice_data.total_as_arabic} ريال السعودية`
                    : "",
                {
                    ...this.RTL,
                    maxWidth: 90,
                }
            );
            this.doc.line(10, 253.5, 10, 263.5);
            this.doc.line(10, 264, 100, 264);
        }
    }
}

export default StandaredPDFBase;
