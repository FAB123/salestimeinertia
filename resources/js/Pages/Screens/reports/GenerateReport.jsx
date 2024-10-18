import { Box, Button, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Breadcrumb from "../../../components/Breadcrumb";
import ReportTables from "../../../components/table/ReportTables";
import { gererateReportUrl } from "../../../helpers/ReportHelper";
import Modal from "@mui/material/Modal";
import { getData } from "../../../apis/apiCalls";
import { GETPURCHASEIMAGE } from "../../../constants/apiUrls";
import { usePage } from "@inertiajs/react";
import PosDrawer from "../../../components/PosDrawer";
import ReportViewer from "../sales/ReportViewer";

function GenerateReport() {
    const { type, from, to, option1, option2, location } = usePage().props;
    const { t } = useTranslation();
    const [data, setData] = useState({
        url: null,
        header: null,
        primaryKey: null,
    });

    const [invUrl, setInvUrl] = useState(null);
    const [loadInv, setLoadInv] = useState(false);

    const [openReport, setOpenReport] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [saleType, setSaleType] = useState(null);

    const handleClose = () => {
        setInvUrl(null);
        setLoadInv(false);
    };

    const viewer = (purchase_id) => {
        getData(`${GETPURCHASEIMAGE}${purchase_id}`).then((data) => {
            if (data.pic_filename) {
                setInvUrl("data:image/png;base64," + data.pic_filename);
                setLoadInv(true);
            }
        });
    };

    const viewReport = (type, saleID) => {
        setInvoiceNumber(saleID);
        setSaleType(type);
        setOpenReport(true);
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "fitContent",
        bgcolor: "background.paper",
        // border: "2px solid #000",
        borderRadius: 2,
        boxShadow: 24,
        p: 1,
    };

    useEffect(() => {
    gererateReportUrl(
            type,
            from,
            to,
            option1,
            option2,
            location,
            viewer,
            viewReport
        ).then(({ url, header, primaryKey, detailed }) => {
            setData({
                url,
                header,
                primaryKey,
                detailed,
            });
        });
    }, []);

    return (
        <Stack>
            <Breadcrumb
                labelHead={t("reports.generatedReport")}
                labelSub={t("reports.generatedReport_desc")}
            />
            <PosDrawer open={openReport} setOpen={setOpenReport}>
                <ReportViewer
                    saleType={saleType}
                    setOpenReport={setOpenReport}
                    invoiceNumber={invoiceNumber}
                />
            </PosDrawer>
            <Modal
                open={loadInv}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <img src={invUrl}></img>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
            {data.url && (
                <ReportTables
                    title={t(`reports.${type}`)}
                    url={data.url}
                    header={data.header}
                    primaryKey={data.primaryKey}
                    type={null}
                    detailed={data.detailed}
                />
            )}
        </Stack>
    );
}

export default GenerateReport;
