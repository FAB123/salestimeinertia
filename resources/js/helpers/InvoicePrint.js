import printJS from "print-js";
// import { toCurrency } from "../constants/constants";
import PrintEngine from "./CustomInvoice/PrintEngine";
import ThermalPrint from "./CustomInvoice/Thermalprint";
import StandardPDF from "./CustomInvoice/StandardPDF";
import GaztPDFTemplate from "./CustomInvoice/GaztPDFTemplate";

const RTL = {
    isOutputRtl: true,
    align: "right",
};

const callPrint = (
    response,
    saleType,
    companyLogo,
    invoiceTemplate,
    storeData,
    configurationData
) => {
    //create new object of print engine

    const transactionIds = {
        WORKORDER: response.invoice_data.workorder_id,
        QUOTATION: response.invoice_data.quotation_id,
        DEFAULT: response.invoice_data.sale_id,
    };

    const billTypes = {
        WORKORDER: "WORKORDER",
        QUOTATION: "QUOTATION",
        DEFAULT: response.invoice_data.bill_type,
    };

    const showQR = saleType !== "WORKORDER" && saleType !== "QUOTATION";

    const responseData = {
        ...response.invoice_data,
        showQR,
        bill_type: billTypes[saleType] || billTypes.DEFAULT,
        transaction_id: transactionIds[saleType] || transactionIds.DEFAULT,
    };

    let printEngine = new PrintEngine(
        responseData,
        saleType,
        storeData,
        configurationData
    );

    //generate formated invoice data
    let invoiceData = printEngine.generateInvoiceData();

    //get template type
    let templatesType = printEngine.templatesType;

    if (templatesType === "THERMAL") {
        let thermalPrint = new ThermalPrint(
            invoiceData,
            companyLogo,
            invoiceTemplate
        );
        thermalPrint.loadTemplate = "THERMAL";
        printJS({
            type: "raw-html",
            printable: thermalPrint.generateprinter,
        });
    } else if (templatesType === "STANDARD") {
        var standaredPDFPrint = new StandardPDF(
            invoiceData,
            companyLogo,
            invoiceTemplate
        );
        standaredPDFPrint.templateData = printEngine.invoiceTemplate;
        standaredPDFPrint.loadTemplate = "STANDARD";
        let genrate = standaredPDFPrint.generateprinter;
        if (genrate) {
            printJS(standaredPDFPrint.doc.output("bloburl"));
        }
    } else if (templatesType === "GAZT") {
        var standaredPDFPrint = new GaztPDFTemplate(
            invoiceData,
            companyLogo,
            invoiceTemplate
        );
        standaredPDFPrint.templateData = printEngine.invoiceTemplate;
        standaredPDFPrint.loadTemplate = "GAZT";
        standaredPDFPrint.setSaleType = saleType;
        let genrate = standaredPDFPrint.generateprinter;

        if (genrate) {
            printJS(standaredPDFPrint.doc.output("bloburl"));
        }
    }
};

export { callPrint };
