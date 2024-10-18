import { Fab, Stack, TextField, Typography } from "@mui/material";
import React, { useRef } from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

import { useTranslation } from "react-i18next";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

function DatePicker({ purchaseDate, setPurchaseDate }) {
    const dateRef = useRef();
    const currentDate = new Date();
    const { t } = useTranslation();
    return (
        <Stack
            sx={{ pb: 1 }}
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems={"center"}
        >
            <Typography variant="subtitle2">
                {t("purchase.purchase_date")}
            </Typography>
            <Flatpickr
                data-enable-time
                ref={dateRef}
                // value={currentDate}
                options={{
                    maxDate: currentDate,
                    dateFormat: "d-m-Y",
                    enableTime: false,
                    defaultDate: purchaseDate,
                }}
                render={({ defaultValue, value, ...props }, ref) => {
                    return (
                        <TextField
                            defaultValue={defaultValue}
                            value={defaultValue}
                            fullWidth={true}
                            inputRef={ref}
                            size="small"
                        />
                    );
                }}
                value={purchaseDate}
                defaultValue={purchaseDate}
                onChange={([date]) => {
                    setPurchaseDate(date);
                }}
            />
            <Fab
                color="secondary"
                size="small"
                onClick={() => {
                    dateRef?.current?.flatpickr?.open();
                }}
            >
                <CalendarMonthRoundedIcon />
            </Fab>
        </Stack>
    );
}

export default DatePicker;
