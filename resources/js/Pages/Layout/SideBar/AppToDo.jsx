import React, { useState, useEffect } from "react";
import { Stack, Grid, Fab, Chip, Button, Divider } from "@mui/material";
import TodoCard from "./Todo/TodoCard";

import AddTodo from "./Todo/AddTodo";

import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconSquareX } from "@tabler/icons-react";

import { IconFolderPlus } from "@tabler/icons-react";
import { getData } from "../../../apis/apiCalls";
import { GETTODOLIST, GETTODOTAGS } from "../../../constants/apiUrls";
import { useTranslation } from "react-i18next";
function AppToDo({ setShowTodo }) {
    const [data, setData] = useState([]);
    const [mode, setMode] = useState("display");
    const [event, setEvent] = useState("Today");

    const [tag, setTag] = useState("NONE");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [editableItem, setEditableItem] = useState(null);
    const events = ["Today", "Upcoming", "Due", "Deleted"];

    const [tags, setTags] = useState([]);
    const { t } = useTranslation();
    const apiCall = () => {
        getData(`${GETTODOLIST}${event}/${tag}/${page}`).then((response) => {
            if (response.status) {
                setData(response.data?.data);
                setTotalPage(response.data?.last_page);
                setMode("display");
            }
        });
    };

    const editItem = (item) => {
        setEditableItem(item);
        setMode("edit");
    };

    useEffect(() => {
        apiCall();
    }, [page, event, tag]);

    useEffect(() => {
        getData(GETTODOTAGS).then((response) => {
            // console.log(...tags, ...response.data);
            let d = response.data.map((i) => i.name);
            setTags([...tags, ...d]);
        });
    }, []);

    return (
        <Stack
            alignItems="stretch"
            direction="row"
            justifyContent="center"
            p={1}
            sx={{
                overflowY: "auto",
            }}
        >
            <Grid container spacing={1} columns={{ xs: 4, sm: 12, md: 12 }}>
                {mode === "display" ? (
                    <>
                        <Stack
                            elevation={20}
                            sx={{
                                p: 1,
                                width: "100%",
                            }}
                        >
                            <Stack
                                justifyContent="center"
                                direction={"row"}
                                spacing={1}
                                sx={{ mb: 1 }}
                            >
                                {events.map((iEvent, key) => (
                                    <Chip
                                        onClick={() => setEvent(iEvent)}
                                        variant={
                                            event === iEvent
                                                ? "filled"
                                                : "outlined"
                                        }
                                        size="small"
                                        label={iEvent}
                                        color="success"
                                        key={key}
                                    />
                                ))}
                            </Stack>
                            <Divider />
                            <Stack
                                justifyContent="center"
                                direction={"row"}
                                spacing={1}
                                sx={{ mt: 1 }}
                            >
                                {tags.map((iTag, key) => (
                                    // <Button variant="outlined" key={key}>
                                    //     {iTag}
                                    // </Button>

                                    <Chip
                                        onClick={() => setTag(iTag)}
                                        // variant="outlined"
                                        variant={
                                            tag === iTag ? "filled" : "outlined"
                                        }
                                        size="small"
                                        label={iTag}
                                        color="warning"
                                        key={key}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                        {data.map((i, key) => (
                            <Grid item xs={12} sm={12} md={6} p={1} key={key}>
                                <TodoCard
                                    data={i}
                                    apiCall={apiCall}
                                    editItem={editItem}
                                />
                            </Grid>
                        ))}
                    </>
                ) : mode === "edit" ? (
                    <AddTodo
                        apiCall={apiCall}
                        editableItem={editableItem}
                        closeIt={() => setMode("display")}
                    />
                ) : (
                    <AddTodo
                        apiCall={apiCall}
                        closeIt={() => setMode("display")}
                    />
                )}

                <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        width: "100%",
                        p: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={setShowTodo}
                        startIcon={<IconSquareX stroke={2} />}
                    >
                        {t("common.close")}
                    </Button>

                    <Stack direction={"row"} spacing={1}>
                        <Fab
                            color="secondary"
                            size="small"
                            disabled={page <= 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            <IconChevronLeft stroke={2} />
                        </Fab>
                        <Fab
                            color="primary"
                            size="small"
                            disabled={page >= totalPage}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            <IconChevronRight stroke={2} />
                        </Fab>
                    </Stack>

                    <Fab
                        color="primary"
                        size="small"
                        onClick={() => setMode("add")}
                    >
                        <IconFolderPlus stroke={2} />
                    </Fab>
                </Stack>
            </Grid>
        </Stack>
    );
}

export default AppToDo;
