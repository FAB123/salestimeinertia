import React, { useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "./Demo.css";

import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { Fab, Paper, Stack, Zoom } from "@mui/material";

const Input = styled("input")({
    display: "none",
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

function FileUpload(props) {
    const { setcheckImageEdited, setCropData, show, handleClose } = props;
    const [cropper, setCropper] = useState();
    const [image, setImage] = useState("");
    const { t } = useTranslation();

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            setcheckImageEdited(true);
        }
    };

    const onChange = (e) => {
        e.preventDefault();
        let files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        // setShow(true);
    };
    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={show}
                fullWidth
                maxWidth="md"
                hideBackdrop={true}
                //onBackdropClick="false"
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    {t("common.cropimage")}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Stack component={Paper} padding={2}>
                                <Cropper
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        minHeight: 300,
                                    }}
                                    zoomTo={0.5}
                                    initialAspectRatio={1}
                                    preview=".img-preview"
                                    src={image}
                                    viewMode={1}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false}
                                    modal={true}
                                    onInitialized={(instance) => {
                                        setCropper(instance);
                                    }}
                                    guides={true}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack
                                alignItems={"center"}
                                component={Paper}
                                padding={2}
                            >
                                <Typography>Preview</Typography>
                                <Stack
                                    className="img-preview"
                                    component="div"
                                    sx={{
                                        borderRadius: 2,
                                        borderColor: "primary.main",
                                        minHeight: 233,
                                        width: "100%",
                                        maxHeight: { xs: 233, md: 167 },
                                        // maxWidth: { xs: 350, md: 250 },
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid>
                            <label>
                                <Input
                                    accept="image/*"
                                    onChange={onChange}
                                    type="file"
                                />
                                <Button
                                    sx={{ m: 2 }}
                                    variant="contained"
                                    component="span"
                                >
                                    Upload
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                    <Typography gutterBottom>
                        To create crop product image , upload image and select
                        area click crop button.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={getCropData}
                    >
                        Crop Image
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default FileUpload;
