class ThermalPrint {
    constructor(invoiceData, companyLogo, invoiceTemplate) {
        this.invoiceData = invoiceData;
        this.invoice_templates = invoiceTemplate;
        this.company_logo = companyLogo;
        this.head_font_size = 16;
        this.address_font_size = 10;
        this.clogo = false;
        this.clogo_size = 100;
        this.item_font_size = 10;
    }

    set loadTemplate(type) {
        const template = this.invoice_templates.find(
            (item) => item.template_name === type
        );
        var object = template.options.reduce(
            (obj, item) => Object.assign(obj, { [item.item]: item.value }),
            {}
        );

        this.item_font_size = parseInt(object.item_font_size);
        this.head_font_size = parseInt(object.head_font_size);
        this.address_font_size = parseInt(object.address_font_size);
        this.clogo = parseInt(object.clogo) === 1 ? true : false;
        this.clogo_size = parseInt(object.clogo_size);
    }

    get generateprinter() {
        let items_list = "";
        this.invoiceData.invoice_data.body.forEach(function (product) {
            let proItem = "";
            if (product.item_name_ar) {
                proItem += `<span style="font-size: 11px; font-family: 'Changa', sans-serif;" >${product.item_name_ar}</span> `;
            }
            if (product.serialnumber) {
                proItem += `<br/><span class="item_description">SERI: ${product.serialnumber}</span> `;
            }
            if (product.description) {
                proItem += `<br/><span class="item_description">DESC: ${product.description}</span> `;
            }

            items_list += `<tr style="line-height:13px">
         <td style="padding-top: 4px">
           <span class="item_name">${product.item_name}</span>
         </td>
         <td class="table-item">${product.price}</td>
         <td class="table-item">${product.qty}</td>
         <td class="table-item">${product.subtotal}</td>
         <td class="table-item">${product.vat}</td>
         <td class="table-item">${product.total.toFixed(2)}</td>
       </tr>
       <tr>
         <td colspan=4><span class="item_name_arabic">${proItem}</td>
       </tr>`;
        });

        let rawhtml = `
    <style>
    @import url("https://fonts.googleapis.com/css2?family=Changa:wght@600&display=swap");
    html,
    body {
      margin: 0;
      padding: 0;
      font-family: "Arial";
    }
    .print_container {
      width: 80mm;
      padding: 0 2mm;
      font-size: 9px;
    }
    .receipt_header {
      width: 100%;
      
      /* align-items: center; */
      justify-items: center;
      /* padding-bottom: 2mm; */
      display: table;
    }
    .company_address {
      display: flex;
      flex-direction: column;
      line-height: 13px;
    }
    .receipt_type_container {
      display: flex;
      flex-direction: column;
      margin-bottom: 3mm;
      margin-top: 1mm;
    }
    .receipt_type {
      width: 100%;
      justify-items: center;
      display: table-row;
      text-align: center;
      font-size: 13px;
      font-weight: 800;
    }
    .company_name {
      width: 100%;
      text-align: center;
      font-weight: 700;
      font-size: ${this.head_font_size}px;
      display: table-row;
    }
    .company_details {
      text-align: center;
      font-weight: 600;
      font-size: ${this.address_font_size}px;
      display: table-row;
    }
    .location_name {
      font-size: 13px;
    }
    /* .receipt_info {
      width: 100%;
      display: flex;
      font-size: 9px;
      font-weight: 600;
    }
    .receipt_info .invoice_number {
      width: 50%;
      text-align: left;
      padding-left: 2mm;
    }
    .receipt_info .date {
      text-align: right;
      padding-right: 2mm;
      width: 50%;
    } */
    .receipt_info {
      width: 100%;
      font-size: 10px;
      padding: 0 1mm;
      font-weight: 700;
    }
    .customer_info {
      text-align: center;
      display: table-row;
      font-size: 12px;
      font-weight: 700;
    }
    .item_table {
      width: 100%;
      padding: 0 2mm;
      /* line-height: 2mm; */
      border-collapse: collapse;
    }
    .table_header {
      height: 1px;
      padding: 2mm;
      border-bottom: 1px dashed #000;
    }
    .item_container {
      font-size: 10px;
      font-weight: 600;
      border-bottom: 1px dashed #000;
    }
    .table-item {
      text-align: right;
      font-size: 12px;
      font-weight: 600;
    }
    .table-footer {
      border-bottom: 1px dashed #000;
      font-weight: 700;
      line-height: 15px;
    }
    .receipt_center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
    }
    .item_name {
      font-size: ${this.item_font_size}px;
      
      font-weight: 600;
    }
    .item_name_arabic {
      font-size: 10px;
      direction: rtl;
      font-weight: 600;
      font-family: "Changa", sans-serif;
    }
    .item_description {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10px;
      padding: 0.1in;
    }
    .separate-line {
      height: 1px;
      border-top: 1px dashed #000;
      margin: 3px;
    }
    .arabic_text {
      direction: rtl;
      font-family: 'Changa', sans-serif;
    }
    </style>`;

        let customer_info = "";
        if (this.invoiceData.customer_details) {
            customer_info += `<span class="customer_info">${this.invoiceData.customer_details.name}</span>`;
            if (this.invoiceData.customer_details.customer_mobile) {
                customer_info += `<span class="customer_info"> Mobile : ${this.invoiceData.customer_details.mobile})</span>`;
            }
            if (this.invoiceData?.customer_details?.party_id) {
                customer_info += `<span class="customer_info">VAT NUMBER: ${this.invoiceData?.customer_details?.party_id} </span>`;
            }
            customer_info += `<div class="separate-line"></div>`;
        }

        let payment_details = "";
        if (this.invoiceData.payment.length > 0) {
            payment_details += `<table class="receipt_info" style="margin-top: 2mm; border: 1px solid;">`;
            this.invoiceData.payment.forEach((payment) => {
                payment_details += `<tr><td>${
                    payment.payment_name_en
                }</td><td class="arabic_text" style="text-align: center">${
                    payment.payment_name_ar
                }</td><td style="text-align: right">${payment.amount.toFixed(
                    2
                )}</td></tr>`;
            });
            payment_details += `</table>`;
        }

        let company_logo = () => {
            if (this.clogo) {
                if (this.company_logo) {
                    return `<div class="receipt_center">
                          <img
                            width="${this.clogo_size}px" 
                            height="${this.clogo_size}px" 
                            src="data:image/png;base64,${this.company_logo}"
                          />
                        </div>`;
                }
            }
            return "";
        };

        rawhtml += `<div class="print_container">
      <div class="receipt_header">
        <div class="receipt_type_container">
          <span class="receipt_type">SIMPLIFIED TAX INVOICE</span>
          <span class="receipt_type arabic_text" style="font-size: 14px"
            >فاتورة ضریبیة المبسطة
          </span>
        </div>
        ${company_logo()}
        <span class="company_name"> ${
            this.invoiceData.company_data?.company_name
        }</span>
        <span class="company_name arabic_text">${
            this.invoiceData.company_data?.company_name_ar
        } </span>
        <div class="company_address">
          <span class="company_details location_name"
            >${this.invoiceData.company_data?.location_store_name}
          </span>
          <span class="company_details location_name arabic_text"
            >${this.invoiceData.company_data?.location_store_name_ar}
          </span>
          <span class="company_details">
          ${this.invoiceData.company_data?.location_street_name_en} - ${
            this.invoiceData.company_data?.location_district_en
        } - ${this.invoiceData.company_data?.location_city_en}
          </span>
          <span class="company_details arabic_text">
          ${this.invoiceData.company_data?.location_street_name_ar} - ${
            this.invoiceData.company_data?.location_district_ar
        } - ${this.invoiceData.company_data?.location_city_ar}
          </span>

          <span class="company_details">Building Number :  ${
              this.invoiceData.company_data?.location_building_no
          }</span>

          <span class="company_details">PHONE :  ${
              this.invoiceData.company_data?.location_mobile
          }</span>

          
          <span class="company_details">VAT NUMBER :  ${
              this.invoiceData.company_data?.company_vat_number
          }</span>
        </div>

        <div class="separate-line"></div>
        <table class="receipt_info">
          <tr>
            <td>INVOICE:</td>
            <td style="text-align: center">${
                this.invoiceData.invoice_data?.invoicePatern
            }-${this.invoiceData.invoice_data?.invoice_number}</td>
            <td class="arabic_text">رقم الفاتورة</td>
          </tr>
          <tr>
            <td>DATE:</td>
            <td style="text-align: center">${
                this.invoiceData.invoice_data?.invoice_date
            }</td>
            <td class="arabic_text">تاريخ الفاتورة</td>
          </tr>
        </table>
        <div class="separate-line"></div>
        ${customer_info}
      </div>
      <div class="receipt_body">
      <table class="item_table">
          <thead class="table_header">
            <tr style="font-size: 9px">
              <th style="text-align: left; width: 30%">Description</th>
              <th style="text-align: right; width: 12%">Rate</th>
              <th style="text-align: right; width: 12%">Qty</th>
              <th style="text-align: right; width: 15%">Sub Total</th>
              <th style="text-align: right; width: 12%">VAT</th>
              <th style="text-align: right; width: 12%">Total</th>
            </tr>

            <tr style="line-height:13px; font-size: 10px; font-weight: 600; font-family: 'Changa', sans-serif;">
              <th style="text-align: left">وصف</th>
              <th style="text-align: right">سعر</th>
              <th style="text-align: right">الكمية</th>
              <th style="text-align: right">المجموع الفرعي</th>
              <th style="text-align: right">ضريبة</th>
              <th style="text-align: right">مجموع</th>
            </tr>
          </thead>
          <tbody class="item_container">${items_list}</tbody>
          <tfoot class="table-footer">
            <tr>
              <td colspan=4 class="table-item">Sub Total :</td>
              <td style="text-align: 'center'">(7 Qty)</td>
              <td class="table-item">${this.invoiceData.invoice_data.subTotal.toFixed(
                  2
              )}</td>
            </tr>
            <tr>
              <td colspan=4 class="table-item">VAT 15% :</td>
              <td colspan=2 class="table-item">${this.invoiceData.invoice_data.totalVat.toFixed(
                  2
              )}</td>
            </tr>
            <tr>
              <td colspan=4 class="table-item">TOTAL :</td>
              <td colspan=2 class="table-item">${this.invoiceData.invoice_data.total.toFixed(
                  2
              )}</td>
            </tr>
            <tr>
            <td colspan=4 class="table-item">Aditional Discount :</td>
            <td colspan=2 class="table-item">${this.invoiceData.invoice_data.discount.toFixed(
                2
            )}</td>
          </tr>
          <tr>
          <td colspan=4 class="table-item">Net Total :</td>
          <td colspan=2 class="table-item">${this.invoiceData.invoice_data.net_amount.toFixed(
              2
          )}</td>
        </tr>
 
          </tfoot>
        </table>
      </div>
      ${payment_details}
      <div class="receipt_center">
        <img
          width="100px"
          height="100px"
          src="data:image/png;base64,${this.invoiceData.invoice_data.qrData}"
        />
        <span style="margin-top: 10px; text-align: center">${
            this.invoiceData.company_data?.return_policy
        }</span>
        <span class="arabic_text" style="margin-top: 10px; text-align: center">${
            this.invoiceData.company_data?.return_policy_ar
        }</span>
        <span style="margin-top: 10px; text-align: center">
          :: Thanking you Visit again ::
        </span>
      </div>
    </div>`;

        return rawhtml;
    }
}

export default ThermalPrint;
