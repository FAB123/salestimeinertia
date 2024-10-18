import { Breadcrumbs, Paper, Typography, Stack } from "@mui/material";
import React from "react";
import Link from "@mui/material/Link";
import { Head, usePage } from "@inertiajs/react";

function Breadcrumb(props) {
    const { labelHead, labelSub } = props;
    const { appName } = usePage().props;

    return (
        <>
            <Head title={`${labelHead} - ${appName}`} />

            <Paper elevation={5} sx={{ paddingX: 1 }}>
                <Stack
                    direction={"row"}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack>
                        <Typography variant="h6" gutterBottom={true}>
                            {labelHead}
                        </Typography>
                        <Typography variant="body1" gutterBottom={true}>
                            {labelSub}
                        </Typography>
                    </Stack>
                    <Breadcrumbs maxItems={3} aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="#">
                            Home
                        </Link>
                        <Link underline="hover" color="inherit" href="#">
                            {labelHead}
                        </Link>
                        <Typography
                            color="text.primary"
                            // sx={{ display: { xs: "none",md:"flex" } }}
                        >
                            {labelSub}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
            </Paper>
        </>
    );
}

export default React.memo(Breadcrumb);
