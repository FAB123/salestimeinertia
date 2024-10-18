import {
    Box,
    Grid,
    Paper,
    Card,
    CardHeader,
    CardContent,
    Stack,
    Button,
    Divider,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { FormInputText } from "../../../../components/mui";
import { getData, postData } from "../../../../apis/apiCalls";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import QRCode from "react-qr-code";
import { usePage } from "@inertiajs/react";

function WhatsappWeb({ control }) {
    const [qrCode, setQrcode] = useState(null);
    const [status, setStatus] = useState(null);
    const { configurationData } = usePage().props;
    const endPoint = configurationData.whatsapp_web_endpoint;

    const { t } = useTranslation();

    useEffect(() => {
        getStatus();
    }, []);

    const getQrCode = () => {
        getData(`${endPoint}qr-code`).then((result) => {
            if (result.status) {
                setQrcode(result.qr);
            } else {
                setQrcode(null);
                setStatus(result.message);
            }
        });
    };

    const getStatus = () => {
        getData(endPoint).then((result) => {
            if (result.status) {
                setQrcode(result.qr ? result.qr : null);
                setStatus(result.message);
            }
        });
    };

    return (
        <Stack direction={"row"} m={1}>
            <Grid container spacing={1}>
                <Grid item md={7} xs={12}>
                    <Paper elevation={20}>
                        <Card>
                            <CardHeader
                                subheader={t("configuration.whatsappweb_setup")}
                            />
                            <Divider />

                            <CardContent>
                                <Stack
                                    direction={"row"}
                                    spacing={2}
                                    alignItems="center"
                                    justifyContent={"space-between"}
                                >
                                    
                                    <Stack
                                        sx={{
                                            width: "50%",
                                        }}
                                    >
                                        <Button
                                            onClick={getQrCode}
                                            disabled={
                                                !configurationData.whatsapp_web_endpoint
                                            }
                                        >
                                            {t("configuration.get_qr")}
                                        </Button>
                                        <Divider />
                                        <Button
                                            onClick={getStatus}
                                            disabled={
                                                !configurationData.whatsapp_web_endpoint
                                            }
                                        >
                                            {t("configuration.get_status")}
                                        </Button>
                                        {/* {status && (
                                            <Paper
                                                elevation={24}
                                                sx={{
                                                    py: 2,
                                                    m: 2,
                                                    px: 1,
                                                }}
                                            >
                                                <Typography>
                                                    {status}
                                                </Typography>
                                            </Paper>
                                        )} */}
                                    </Stack>
                                    <Divider orientation="vertical" flexItem />
                                    <Stack
                                        sx={{
                                            width: "50%",
                                        }}
                                        alignItems="center"
                                        justifyContent={"space-between"}
                                    >
                                        {qrCode ? (
                                            <QRCode
                                                value={qrCode}
                                                style={{
                                                    border: "2px solid #000",
                                                    padding: 2,
                                                }}
                                            />
                                        ) : (
                                            <Paper
                                                elevation={24}
                                                sx={{
                                                    py: 2,
                                                    m: 2,
                                                    px: 1,
                                                    width: "100%",
                                                }}
                                            >
                                                <Typography>
                                                    {status}
                                                </Typography>
                                            </Paper>
                                        )}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>

                <Grid item md={5} xs={12}>
                    <Paper elevation={20}>
                        <Card>
                            <CardContent>
                                <FormInputText
                                    label={t(
                                        "configuration.whatsapp_web_endpoint"
                                    )}
                                    name="whatsapp_web_endpoint"
                                    helperText={"http://192.168.1.23:3000/"}
                                    control={control}
                                />
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default WhatsappWeb;
