import React, { useState } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentPaste from "@mui/icons-material/ContentPaste";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountHead from "./support/AccountHead";
import NewPayment from "./support/NewPayment";
import NewReceipt from "./support/NewReceipt";
import NewJournal from "./support/NewJournal";
import NewContra from "./support/NewContra";
import AccountHeadList from "./support/AccountHeadList";
import { t } from "i18next";
import AccountHeadOb from "./support/AccountHeadOb";
import { Grid, Stack } from "@mui/material";
import { Box } from "@mui/system";

function Main() {
    const [showPayment, setshowPayment] = useState(false);
    const [showReceipt, setshowReceipt] = useState(false);
    const [showJournal, setshowJournal] = useState(false);
    const [showContra, setshowContra] = useState(false);
    const [showHead, setshowHead] = useState(false);
    const [showListHead, setshowListHead] = useState(false);
    const [showHeadOb, setshowHeadOb] = useState(false);

    const callOptions = (option) => {
        setshowPayment(false);
        setshowReceipt(false);
        setshowJournal(false);
        setshowContra(false);
        setshowHead(false);
        setshowListHead(false);
        setshowHeadOb(false);
        if (option === "payment") setshowPayment(true);
        else if (option === "receipt") setshowReceipt(true);
        else if (option === "journal") setshowJournal(true);
        else if (option === "contra") setshowContra(true);
        else if (option === "head") setshowHead(true);
        else if (option === "listhead") setshowListHead(true);
        else if (option === "headob") setshowHeadOb(true);
    };

    return (
        <Stack>
            <Breadcrumb
                labelHead={t("modules.accounts")}
                labelSub={t("accounts.account_desc")}
            />
            <Grid container spacing={1} mt={1}>
                <Grid item md={4}>
                    <Paper>
                        <MenuList>
                            <MenuItem onClick={() => callOptions("payment")}>
                                <ListItemIcon>
                                    <PaymentIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("accounts.account_payment_voucher")}
                                </ListItemText>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ⌘X
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => callOptions("receipt")}>
                                <ListItemIcon>
                                    <ReceiptIcon fontSize="small" />
                                </ListItemIcon>

                                <ListItemText>
                                    {t("accounts.account_receipt_voucher")}
                                </ListItemText>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ⌘C
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => callOptions("journal")}>
                                <ListItemIcon>
                                    <ContentPaste fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("accounts.account_journal_voucher")}
                                </ListItemText>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ⌘V
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => callOptions("contra")}>
                                <ListItemIcon>
                                    <AccountBalanceIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("accounts.account_contra_voucher")}
                                </ListItemText>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ⌘V
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => callOptions("head")}>
                                <ListItemIcon>
                                    <AccountTreeIcon fontSize="small" />
                                </ListItemIcon>

                                <ListItemText>
                                    {t("accounts.new_account_head")}
                                </ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => callOptions("listhead")}>
                                <ListItemIcon>
                                    <AccountTreeIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("accounts.list_of_account_heads")}
                                </ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => callOptions("headob")}>
                                <ListItemIcon>
                                    <AccountTreeIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("accounts.ob_of_account_heads")}
                                </ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </Grid>
                <Grid item md={8}>
                    {showHead && <AccountHead />}
                    {showListHead && <AccountHeadList />}
                    {showHeadOb && <AccountHeadOb />}
                    {showPayment && <NewPayment />}
                    {showReceipt && <NewReceipt />}
                    {showJournal && <NewJournal />}
                    {showContra && <NewContra />}
                </Grid>
            </Grid>
        </Stack>
    );
}

export default Main;
