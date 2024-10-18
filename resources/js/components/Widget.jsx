import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";

function Widget({ title, icon, theme, themeForgound, content }) {
    const {t}= useTranslation()
    return (
        <Card sx={{ display: "flex", m: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: theme,
                }}
            >
                <CardContent sx={{ flex: "1 0 auto" }}>
                    <Avatar
                        aria-label="recipe"
                        sx={{ bgcolor: themeForgound, width: 56, height: 56 }}
                    >
                        {content === "Loading" ? (
                            <CircularProgress color="info" size={35} />
                        ) : (
                            icon
                        )}
                    </Avatar>
                </CardContent>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
                <CardHeader
                    title={title}
                    subheader={
                        <Stack direction="row">
                            <Typography variant="body1">
                                {content === "Loading"
                                    ? content
                                    : `${t("common.total")} : ${content} `}
                            </Typography>
                        </Stack>
                    }
                />
            </Box>
        </Card>

        // <Card
        //   direction="row"
        //   sx={{
        //     p: 1,
        //     m: 1,
        //     borderTopRightRadius: "16px",
        //     borderBottomRightRadius: "16px",
        //     // borderRadius: "16px",
        //     bgcolor: { theme },
        //   }}
        // >
        //   <CardHeader
        //     avatar={
        //       <Avatar aria-label="recipe" sx={{ bgcolor: pink[500] }}>
        //         <i className={`icon fa ${icon}`} />
        //       </Avatar>
        //     }
        //     title={title}
        //     subheader={
        //       <>
        //         {content === "Loading" && (
        //           <CircularProgress color="secondary" size={25} />
        //         )}
        //         <Typography variant="body2">
        //           <b>{content === "Loading" ? content : `Total: ${content} `}</b>
        //         </Typography>
        //       </>
        //     }
        //   />
        // </Card>
    );
}

export default Widget;
