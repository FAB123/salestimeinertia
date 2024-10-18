import React, { useState, useEffect, memo } from "react";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

import { Document, Page } from "react-pdf";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import Fab from "@mui/material/Fab";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";

import printJS from "print-js";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import { getData, postData } from "../../../apis/apiCalls";
import { getInvLink } from "../../../helpers/SalesHelper";
import toaster from "../../../helpers/toaster";
import PrintEngine from "../../../helpers/CustomInvoice/PrintEngine";
import ThermalPrint from "../../../helpers/CustomInvoice/Thermalprint";
import StandardPDF from "../../../helpers/CustomInvoice/StandardPDF";
import GaztPDFTemplate from "../../../helpers/CustomInvoice/GaztPDFTemplate";
import { usePage } from "@inertiajs/react";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
//   ).toString();

function ReportViewer({ saleType, setOpenReport, invoiceNumber }) {
    const { t } = useTranslation();
    const {
        storeData,
        configurationData,
        storeID,
        companyLogo,
        invoiceTemplate,
    } = usePage().props;
    const [currentInv, setCurrentInv] = useState(null);
    const [lastInv, setLastInv] = useState(null);
    const [invNumber, setInvNumber] = useState(null);
    const [invPatern, setInvPatern] = useState(null);
    // const [zoom, setZoom] = useState(1.0);

    const [pdfData, setPdfData] = useState({ view: "pdf", data: null });
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () =>
        setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

    const goToNextPage = () =>
        setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

    const goToPrevInvoice = () => {
        createReport(currentInv - 1);
    };

    // const zoomInvoice = (ratio) => {
    //   setZoom(ratio);
    // };

    const goToNextInvoice = () => {
        createReport(currentInv + 1);
    };
    const goToLastInvoice = () => {
        createReport(lastInv);
    };

    const goToFirstInvoice = () => {
        createReport(1);
    };

    const createReport = (id, initial = false) => {
        getData(`${getInvLink(saleType)}/${id}`).then((response) => {
            if (response.error) {
                toaster.error(t(response.message));
            } else {
                let responseData = { ...response.invoice_data };

                switch (saleType) {
                    case "WORKORDER":
                        responseData = {
                            ...responseData,
                            showQR: false,
                            bill_type: "WORKORDER",
                            transaction_id: response.invoice_data.workorder_id,
                        };
                        break;
                    case "QUATATION":
                        responseData = {
                            ...responseData,
                            showQR: false,
                            bill_type: "QUOTATION",
                            transaction_id: response.invoice_data.quotation_id,
                        };
                        break;
                    default:
                        responseData = {
                            ...responseData,
                            showQR: true,
                            transaction_id: response.invoice_data.sale_id,
                        };
                        break;
                }

                setCurrentInv(responseData.transaction_id);
                setInvNumber(responseData.transaction_id);
                initial && setLastInv(responseData.transaction_id);

                let printEngine = new PrintEngine(
                    responseData,
                    saleType,
                    storeData,
                    configurationData
                );
                setInvPatern(printEngine.invoicePatern);

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
                    setPdfData({
                        view: "thermal",
                        data: thermalPrint.generateprinter,
                    });
                } else if (templatesType === "STANDARD") {
                    var standaredPDFPrint = new StandardPDF(
                        invoiceData,
                        companyLogo,
                        invoiceTemplate
                    );
                    standaredPDFPrint.templateData =
                        printEngine.invoiceTemplate;
                    standaredPDFPrint.loadTemplate = "STANDARD";
                    let genrate = standaredPDFPrint.generateprinter;
                    if (genrate) {
                        setPdfData({
                            view: "pdf",
                            data: standaredPDFPrint.doc.output("bloburl"),
                        });
                    }
                } else if (templatesType === "GAZT") {
                    var gaztPDFTemplate = new GaztPDFTemplate(
                        invoiceData,
                        companyLogo,
                        invoiceTemplate
                    );
                    gaztPDFTemplate.templateData = printEngine.invoiceTemplate;
                    gaztPDFTemplate.loadTemplate = "GAZT";

                    gaztPDFTemplate.setSaleType = saleType;
                    let genrate = gaztPDFTemplate.generateprinter;
                    if (genrate) {
                        setPdfData({
                            view: "pdf",
                            data: gaztPDFTemplate.doc.output("bloburl"),
                        });
                    }
                }
            }
        });
    };

    useEffect(() => {
        createReport(invoiceNumber ? invoiceNumber : null, true);
    }, []);

    return (
        <Box>
            <Stack alignItems="center" sx={{ p: 1 }}>
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="primary"
                        aria-label="first"
                        disabled={currentInv <= 1}
                        onClick={goToFirstInvoice}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        aria-label="previous"
                        disabled={currentInv <= 1}
                        onClick={goToPrevInvoice}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <TextField
                        style={{
                            width: 150,
                        }}
                        value={invNumber}
                        variant={"standard"}
                        size={"small"}
                        type={"number"}
                        onChange={(e) => setInvNumber(e.target.value)}
                        onBlur={() => createReport(invNumber)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {invPatern}-
                                </InputAdornment>
                            ),
                        }}
                    />
                    <IconButton
                        color="primary"
                        aria-label="next"
                        disabled={currentInv >= lastInv}
                        onClick={goToNextInvoice}
                    >
                        <NavigateNextRoundedIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        aria-label="next"
                        onClick={goToLastInvoice}
                    >
                        <KeyboardDoubleArrowRightIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack alignItems="center" sx={{ m: 0.2 }}>
                {pdfData.data && pdfData.view === "pdf" ? (
                    <>
                        <Document
                            file={pdfData.data}
                            onLoadSuccess={onDocumentLoadSuccess}
                            style={{ position: "relative" }}
                        >
                            <Page
                                pageNumber={pageNumber}
                                renderTextLayer={true}
                            />
                        </Document>
                        {numPages && (
                            <Box
                                sx={{ "& > :not(style)": { m: 1 } }}
                                style={{ position: "absolute", bottom: 12 }}
                            >
                                <Typography align="center">{`${t(
                                    "table.page"
                                )} ${pageNumber} ${t(
                                    "table.labelDisplayedRows"
                                )} ${numPages}`}</Typography>

                                {/* <Fab
                color="error"
                size="small"
                aria-label="previous"
                onClick={() => zoomInvoice(0.05)}
              >
                <ZoomOutIcon />
              </Fab>

              <Fab
                color="error"
                size="small"
                aria-label="previous"
                onClick={() => zoomInvoice(-0.05)}
              >
                <ZoomInIcon />
              </Fab> */}

                                <Fab
                                    color="primary"
                                    size="small"
                                    aria-label="previous"
                                    disabled={pageNumber <= 1}
                                    onClick={goToPrevPage}
                                >
                                    <ArrowBackIosNewRoundedIcon />
                                </Fab>
                                <Fab
                                    color="primary"
                                    size="small"
                                    aria-label="next"
                                    disabled={pageNumber >= numPages}
                                    onClick={goToNextPage}
                                >
                                    <NavigateNextRoundedIcon />
                                </Fab>

                                <Fab
                                    color="secondary"
                                    size="small"
                                    aria-label="print"
                                    onClick={() =>
                                        printJS({
                                            printable: pdfData.data,
                                            type:
                                                pdfData.view === "pdf"
                                                    ? "pdf"
                                                    : "raw-html",
                                            showModal: true,
                                            modalMessage:
                                                "Retrieving Document...",
                                        })
                                    }
                                >
                                    <PrintIcon />
                                </Fab>
                                <Fab
                                    color="primary"
                                    size="small"
                                    aria-label="download"
                                >
                                    <DownloadIcon />
                                </Fab>
                                <Fab
                                    color="error"
                                    onClick={() => setOpenReport(false)}
                                    size="small"
                                    aria-label="download"
                                >
                                    <CloseIcon />
                                </Fab>
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        <div
                            dangerouslySetInnerHTML={{ __html: pdfData.data }}
                        ></div>
                        <Box
                            sx={{ "& > :not(style)": { m: 1 } }}
                            style={{ position: "absolute", bottom: 12 }}
                        >
                            <Fab
                                color="secondary"
                                size="small"
                                aria-label="print"
                                onClick={() =>
                                    printJS({
                                        printable: pdfData.data,
                                        type:
                                            pdfData.view === "pdf"
                                                ? "pdf"
                                                : "raw-html",
                                        showModal: true,
                                        modalMessage: "Retrieving Document...",
                                    })
                                }
                            >
                                <PrintIcon />
                            </Fab>
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="download"
                            >
                                <DownloadIcon />
                            </Fab>
                            <Fab
                                color="error"
                                onClick={() => setOpenReport(false)}
                                size="small"
                                aria-label="download"
                            >
                                <CloseIcon />
                            </Fab>
                        </Box>
                    </>
                    // pdfData.data
                )}
            </Stack>
        </Box>
    );
}

export default memo(ReportViewer);
