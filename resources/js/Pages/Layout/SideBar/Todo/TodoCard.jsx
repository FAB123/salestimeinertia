import * as React from "react";

import {
    Chip,
    Divider,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Stack,
} from "@mui/material";

import { createTheme } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";

import { IconEdit, IconTrash } from "@tabler/icons-react";
import { IconSquareRoundedCheck } from "@tabler/icons-react";
import { getData } from "../../../../apis/apiCalls";
import toaster from "../../../../helpers/toaster";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "@emotion/react";
import moment from "moment";
import { DONETODOBYID, DELETETODOBYID } from "../../../../constants/apiUrls";

const cardStyle = {
    minWidth: 275,
    // maxWidth: 345,
    padding: 2,
    // backgroundColor: "#9c27b0",
    borderLeft: "0.25rem solid green",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
};
export default function TodoCard({ data, apiCall, editItem }) {
    const { t } = useTranslation();
    const doneTodo = () => {
        getData(`${DONETODOBYID}/${data.encrypted_todo}`).then((response) => {
            if (response.status) {
                toaster.success(t(response.message));
                apiCall();
            } else {
                toaster.error(t(response.message));
            }
        });
    };

    const deleteTodo = () => {
        let remove = confirm(t("common.are_you_sure"));
        if (remove) {
            getData(`${DELETETODOBYID}/${data.encrypted_todo}`).then(
                (response) => {
                    if (response.status) {
                        toaster.success(t(response.message));
                        apiCall();
                    } else {
                        toaster.error(t(response.message));
                    }
                }
            );
        }
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: "#9c27b0",
            },
            text: {
                primary: "#f0a",
            },
        },
        shape: {
            borderRadius: 8,
        },
        typography: {
            fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
            color: "#fff",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Card style={cardStyle}>
                <CardHeader
                    title={data.title}
                    subheader={moment(data.todo_date).format(
                        "DD-MM-YYYY hh:mm:A"
                    )}
                    titleTypographyProps={{
                        fontSize: "20px",
                    }}
                    subheaderTypographyProps={{
                        fontSize: "12px",
                    }}
                    sx={{
                        textDecoration: data.done ? "line-through" : "none",
                        paddingY: 0,
                        m: 0,
                    }}
                />
                <Divider />
                <CardContent>
                    <Stack spacing={0.2}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            // style={contentStyle}
                            sx={{
                                fontSize: "11px",
                                color: "#f0a",
                                textDecoration: data.done
                                    ? "line-through"
                                    : "none",
                            }}
                        >
                            {data.message}
                        </Typography>
                        <Stack direction={"row"}>
                            {data.tags.map((i, q) => (
                                <Chip
                                    label={i}
                                    size="small"
                                    key={q}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ m: 0.2 }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ m: 0, p: 0 }}>
                    <Stack
                        direction={"row"}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <IconButton
                            aria-label="edit"
                            onClick={deleteTodo}
                            disabled={data.done}
                            color="error"
                        >
                            <IconTrash stroke={2} />
                        </IconButton>
                        <Stack direction={"row"}>
                            <IconButton
                                aria-label="mark done"
                                onClick={doneTodo}
                                color="warning"
                                disabled={data.done}
                            >
                                <IconSquareRoundedCheck stroke={2} />
                            </IconButton>
                            <IconButton
                                aria-label="edit"
                                disabled={data.done}
                                color="info"
                                onClick={() => editItem(data.encrypted_todo)}
                            >
                                <IconEdit stroke={2} />
                            </IconButton>
                        </Stack>
                    </Stack>
                </CardActions>
            </Card>
        </ThemeProvider>
    );
}
