import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import {
    Divider,
    InputAdornment,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import AppModel from "../../components/AppModel";
import { CalcNumberVarients } from "../../constants/constants";
import { OrangeButton, PurpleButton } from "../../Utils/Theming";
const style = {
    m: 1,
    width: 75,
    height: 75,
};
function ShowCalcualtor({ show, handleClose }) {
    const [reader, setReader] = useState("0");
    const [firstNumber, setFirstNumber] = useState(null);
    const [operation, setOperation] = useState(null);
    const [history, setHistory] = useState([]);
    const { t } = useTranslation();

    const calculate = (val) => {
        if (val === "/" || val === "X" || val === "+" || val === "-") {
            setOperation(val);
            setFirstNumber(reader);
            setReader("0");
        } else if (val === "=") {
            if (operation && firstNumber) {
                var output = 0;
                let temp = `${firstNumber} ${operation} ${reader} =`;
                if (operation === "+") {
                    output = parseFloat(firstNumber) + parseFloat(reader);
                } else if (operation === "-") {
                    output = parseFloat(firstNumber) - parseFloat(reader);
                } else if (operation === "X") {
                    output = parseFloat(firstNumber) * parseFloat(reader);
                } else if (operation === "/") {
                    output = parseFloat(firstNumber) / parseFloat(reader);
                }
                setReader(output);
                setHistory([...history, `${temp}  ${output}`]);
                setFirstNumber(null);
                setOperation(null);
            }
        } else if (val === "ac") {
            setReader("0");
            setFirstNumber(null);
            setOperation(null);
        } else if (val === "sign") {
            if (reader < 0) {
                setReader((prev) => Math.abs(prev));
            } else if (reader > 0) {
                setReader((prev) => parseFloat(prev * -1));
            }
        } else if (val === "tax+") {
            setReader((prev) =>
                parseFloat(parseFloat(prev) + (parseFloat(prev) * 15) / 100)
            );
        } else if (val === "tax-") {
            setReader((prev) => parseFloat(parseFloat(prev) / 1.15));
        }
    };

    return (
        <AppModel
            open={show}
            onClose={handleClose}
            title={t("common.calculator")}
            fullWidth
            maxWidth="sm"
            hideBackdrop={true}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            paddingX={2}
                        >
                            <Typography variant="h4" padding={1}>
                                {reader}
                            </Typography>
                            <Typography variant="h5">{operation}</Typography>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={8} alignItems="center" justifyContent="center">
                    <Paper>
                        {CalcNumberVarients.map((item, index) => {
                            if (item.type === "Number") {
                                return (
                                    <PurpleButton
                                        key={index}
                                        style={{
                                            fontSize: "30px",
                                            fontWeight: 800,
                                        }}
                                        onClick={() => {
                                            setReader((prev) =>
                                                prev === "0"
                                                    ? item.value
                                                    : `${prev}${item.value}`
                                            );
                                        }}
                                        sx={style}
                                    >
                                        {item.label}
                                    </PurpleButton>
                                );
                            } else {
                                return (
                                    <OrangeButton
                                        key={index}
                                        style={{
                                            fontSize: "30px",
                                            fontWeight: 800,
                                        }}
                                        onClick={() => {
                                            calculate(item.value);
                                        }}
                                        sx={style}
                                    >
                                        {item.label}
                                    </OrangeButton>
                                );
                            }
                        })}
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper
                        sx={{
                            width: "100%",
                            p: 1,
                            m: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="body2">HISTORY</Typography>
                        <Divider />
                        {history.map((item) => (
                            <Typography>{item}</Typography>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </AppModel>
    );
}

export default ShowCalcualtor;
