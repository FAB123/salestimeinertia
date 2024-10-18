import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { PinkButton, PurpleButton } from "../../Utils/Theming";
import { excelToJson, jsonToEXCEL } from "../../helpers/GeneralHelper";
import { useTranslation } from "react-i18next";
import BackupIcon from "@mui/icons-material/Backup";
import ProgressLoader from "../../components/ProgressLoader";

import {
    customerValidater,
    itemValidater,
    supplierValidater,
} from "../../helpers/FileUploadHelper";
import { postData } from "../../apis/apiCalls";
import ToasterContainer from "../../components/ToasterContainer";
import { Link } from "@inertiajs/react";

export function FileUploader(props) {
    const { t } = useTranslation();
    const { showHideUploader, setShowHideUploader, type } = props;
    const fileInput = useRef();
    const [uploading, setUploading] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [message, setMessage] = useState(null);
    var dldLink;
    var endPoint;
    var validate;

    const exitWindow = () => {
        setUploading(false);
        setShowHideUploader(false);
    };

    switch (type) {
        case "CUSTOMER":
            dldLink = "/templates/customer.xlsx";
            endPoint = "/customers/bulkinsert";
            validate = customerValidater;
            break;
        case "ITEM":
            dldLink = "/templates/items.xlsx";
            endPoint = "/items/bulkinsert";
            validate = itemValidater;
            break;
        case "SUPPLIER":
            endPoint = "/suppliers/bulkinsert";
            dldLink = "/templates/supplier.xlsx";
            validate = supplierValidater;
            break;
        default:
            return;
    }
    const handleNewFileUpload = (e) => {
        setUploading(true);
        setUpdateStatus(t("common.uploading"));
        excelToJson(e.target.files[0]).then((data) => {
            if (data.length > 0) {
                setUpdateStatus(t("common.validating"));
                let sampleData = data[0];
                let validateMe = null;
                console.log(sampleData);

                Object.keys(sampleData).every((key) => {
                    var found = false;
                    console.log('checking ', key);
                    
                    
                    validate.forEach((item) => {
                        console.log(item, key);

                        if (item === key) {
                            console.log(item);

                            found = true;
                        }
                    });
                    if (!found) {
                        setMessage(t("common.notvalid"));
                        validateMe = "err";
                        return false;
                    }
                });

                if (!validateMe) {
                    setUpdateStatus(t("common.sending"));
                    postData(endPoint, data).then((data) => {
                        if (data.failed.length > 0) {
                            jsonToEXCEL(data.failed, "Failed Datas").then(
                                () => {
                                    setUploading(false);
                                    setShowHideUploader(false);
                                }
                            );
                        } else {
                            setMessage("Bulk Upload Compleeted Successfully");
                        }
                    });
                } else {
                    setUploading(false);
                    setShowHideUploader(false);
                }
            }
        });
    };

    return (
        <Dialog
            open={showHideUploader}
            // TransitionComponent={Transition}
            onClose={setShowHideUploader}
            aria-describedby="alert-dialog"
        >
            <ToasterContainer />
            {message ? (
                <>
                    <DialogTitle id="alert-dialog-title">Message</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {message}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <PurpleButton onClick={exitWindow} autoFocus>
                            {t("common.close")}
                        </PurpleButton>
                    </DialogActions>
                </>
            ) : (
                <>
                    <DialogContent>
                        <ProgressLoader
                            open={uploading}
                            status={updateStatus}
                        />
                        <DialogContentText id="alert-dialog-description">
                            {t("common.customer_upload_msg")}
                            {/* <Link to={dldLink} target="_blank" download>
                                {t("common.download")}
                            </Link> */}
                            <Link href="dldLink"> {t("common.download")}</Link>
                        </DialogContentText>
                        <input
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            ref={fileInput}
                            type="file"
                            onChange={handleNewFileUpload}
                            style={{ display: "none" }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <PurpleButton
                            variant="outlined"
                            color="error"
                            startIcon={<BackupIcon />}
                            onClick={() => fileInput.current.click()}
                        >
                            {t("common.uploadfile")}
                        </PurpleButton>
                        <PinkButton
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                setShowHideUploader(false);
                            }}
                        >
                            Cancel
                        </PinkButton>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}
