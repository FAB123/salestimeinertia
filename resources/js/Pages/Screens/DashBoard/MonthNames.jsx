import { FormControl, MenuItem, Select } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getLastMonths } from "../../../helpers/GeneralHelper";
import { useTranslation } from "react-i18next";

function MonthNames({ selectedMonth, setSelectedMonth }) {
    const [monthList, setMonthList] = useState([]);
    useEffect(() => {
        setMonthList(getLastMonths(5));
    }, []);
    const { t } = useTranslation();
    const handleChange = (e) => setSelectedMonth(e.target.value);
    return (
        <FormControl sx={{ width: 200 }}>
            {selectedMonth && (
                <Select
                    size="small"
                    id="datepicker"
                    value={selectedMonth}
                    onChange={handleChange}
                >
                    {monthList.map((month, key) => (
                        <MenuItem value={month.value} key={key}>
                            {month.month} {month.year}
                        </MenuItem>
                    ))}
                </Select>
            )}
        </FormControl>
    );
}

export default MonthNames;
