import React, { useEffect, useState } from "react";
import AppModel from "../../../components/AppModel";
import { useTranslation } from "react-i18next";
import { InputAdornment, List, TextField } from "@mui/material";
import SpotLightCard from "./SpotLightCard";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

const items = [
    {
        name: "Cash Sales",
        keywords: "Create New Cash Sales.",
        keywords_ar: "إنشاء مبيعات نقدية جديدة.",
        location: "/sales/cash_sales",
    },
    {
        name: "Cash Sales Return",
        keywords_ar: "إنشاء عائد مبيعات نقدي جديد.",
        keywords: "Create New Cash Sales Return.",
        location: "/sales/cash_sales_return",
    },
    {
        name: "Credit Sales",
        keywords_ar: "إنشاء مبيعات ائتمانية جديدة.",
        keywords: "Create New Credit Sales.",
        location: "/sales/credit_sales",
    },
    {
        name: "Credit Sales Return",
        keywords_ar: "إنشاء عائد مبيعات ائتمان جديد.",
        keywords: "Create New Credit Sales Return.",
        location: "/sales/credit_sales_return",
    },
];

function AppSpotLight({ show, handleClose }) {
    const { t } = useTranslation();
    const [text, setText] = useState("");
    const [result, setResult] = useState([]);

    useEffect(() => {
        const filteredData = items.filter((obj) => {
            return (
                obj.keywords.toLowerCase().includes(text.toLowerCase()) ||
                obj.keywords_ar.toLowerCase().includes(text.toLowerCase())
            );
        });
        setResult(filteredData);
    }, [text]);

    return (
        <AppModel
            open={show}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            hideBackdrop={true}
        >
            <TextField
                id="outlined-basic"
                label="SpotLight Search"
                variant="outlined"
                fullWidth
                size="small"
                focused={true}
                onChange={(e) => setText(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="error" />
                            <DirectionsIcon color="primary" />
                        </InputAdornment>
                    ),
                }}
            />

            {text &&
                result &&
                result.map((item, index) => (
                    <SpotLightCard item={item} key={index} />
                ))}
        </AppModel>
    );
}

export default AppSpotLight;
