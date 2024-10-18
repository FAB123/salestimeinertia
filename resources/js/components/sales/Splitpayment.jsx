import React, { useState, useEffect } from "react";

import {
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Paper,
  TableFooter,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { PurpleButton, PinkButton } from "../../Utils/Theming";

import { numberVarients } from "../../constants/constants";
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";

import { getData } from "../../apis/apiCalls";
import { GETALLACTIVEPAYMENTS } from "../../constants/apiUrls";

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: "#11cb5f",
    },
  },
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function Splitpayment(props) {
  const { show, handleClose, saleType, discount, submitSale } = props;
  const [amount, setamount] = useState(0);
  const [payments, setpayments] = useState([]);
  const [balance, setBalance] = useState(0);
  const [paymentList, setPaymentList] = useState([]);

  useEffect(() => {
    async function getBalance() {
      let savedHistory = await JSON.parse(localStorage.getItem(saleType));
      if (savedHistory) {
        let cartItems = savedHistory.cartItems;
        let totalCart = cartItems.reduce(function (accumulator, item) {
          return accumulator + parseFloat(item.total);
        }, 0);
        let payedAmount = payments.reduce(function (accumulator, item) {
          return accumulator + parseFloat(item.amount);
        }, 0);

        setBalance(totalCart - discount - payedAmount);
      }
    }
    getBalance();
  }, [payments, show]);

  useEffect(() => {
    //get payment method
    getData(GETALLACTIVEPAYMENTS).then((result) => {
      if (result.data.result !== null) setPaymentList(result.data);
    });

    return () => {
      clearList();
    };
  }, []);

  const addTolist = async (type, payment_id, name, name_ar) => {
    if (amount > balance) {
      if (balance !== 0) {
        alert(t("sales.amountisbig"));
        let foundinPayments = payments.findIndex((x) => x.type === type);
        if (foundinPayments === -1) {
          setpayments([
            ...payments,
            { name, payment_id, name_ar, type, amount: parseFloat(balance) },
          ]);
        } else {
          let editItem = payments[foundinPayments];
          editItem["amount"] =
            parseFloat(editItem["amount"]) + parseFloat(balance);
          setpayments([
            ...payments.slice(0, foundinPayments),
            editItem,
            ...payments.slice(foundinPayments + 1),
          ]);
        }
      }
      setamount(0);
    } else {
      let foundinPayments = payments.findIndex((x) => x.type === type);
      if (foundinPayments === -1) {
        setpayments([
          ...payments,
          { name, payment_id, name_ar, type, amount: parseFloat(amount) },
        ]);
      } else {
        let editItem = payments[foundinPayments];
        editItem["amount"] =
          parseFloat(editItem["amount"]) + parseFloat(amount);
        setpayments([
          ...payments.slice(0, foundinPayments),
          editItem,
          ...payments.slice(foundinPayments + 1),
        ]);
      }
      setamount(0);
    }
  };

  const deletePayment = (type) => {
    let foundinPayments = payments.findIndex((x) => x.type === type);
    setpayments([
      ...payments.slice(0, foundinPayments),
      ...payments.slice(foundinPayments + 1),
    ]);
  };

  const clearList = () => {
    setpayments([]);
    setBalance(0);
    handleClose();
  };

  const { t, i18n } = useTranslation();
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={show}
        fullWidth
        maxWidth="md"
        hideBackdrop={true}
        onBackdropClick={() => clearList()}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {t("sales.splitpayment")}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="tile">
            <div className="tile-body">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={2} p={2}>
                    <TextField
                      fullWidth
                      label={t("common.amount")}
                      name="amount"
                      autoFocus={true}
                      onChange={(e) => {
                        setamount(e.target.value);
                      }}
                      onFocus={(e) => e.target.select()}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", fontWeight: 900 },
                      }}
                      value={amount}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">SAR</InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    {amount > 0 &&
                      paymentList.map((payment, key) => {
                        return (
                          <PurpleButton
                            key={key}
                            size="large"
                            variant="outlined"
                            style={{ fontWeight: 800 }}
                            sx={{ p: 3, width: 100, height: 75 }}
                            onClick={() => {
                              addTolist(
                                payment.account_id,
                                payment.payment_id,
                                payment.payment_name_en,
                                payment.payment_name_ar
                              );
                            }}
                            //                            disabled={key === 2 ? true : false}
                          >
                            {i18n.language === "en"
                              ? payment.payment_name_en
                              : payment.payment_name_ar}
                          </PurpleButton>
                        );
                      })}
                  </Stack>
                  <TableContainer component={Paper}>
                    <Table
                      size="small"
                      aria-label="simple table"
                      sx={{ p: 3 }}
                      spacing={2}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="left">{t("common.type")}</TableCell>
                          <TableCell align="right">
                            {t("common.amount")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Delete
                                onClick={() => {
                                  deletePayment(row.type);
                                }}
                              />
                            </TableCell>

                            <TableCell align="left">
                              {i18n.language === "en" ? row.name : row.name_ar}
                            </TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} align="left">
                            <ThemeProvider theme={theme}>
                              <Typography variant="h6" color="primary">
                                {t("common.balance")}:
                              </Typography>
                            </ThemeProvider>
                          </TableCell>

                          <TableCell align="right">
                            <Typography variant="h6" color="secondary">
                              {balance}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={6}>
                  <Grid
                    container
                    // direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    // spacing={12}
                  >
                    {balance !== 0 ? (
                      numberVarients.map((type, index) => {
                        return (
                          <PinkButton
                            size="large"
                            key={index}
                            variant="outlined"
                            style={{ fontSize: "30px", fontWeight: 800 }}
                            onClick={() => {
                              if (type.value === "clr") {
                                setamount(0);
                              } else if (type.value === "bck") {
                                setamount(amount.slice(0, -1));
                              } else {
                                setamount(
                                  amount !== 0
                                    ? amount + type.value
                                    : type.value
                                );
                              }
                            }}
                            sx={{ m: 1, width: 100, height: 75 }}
                          >
                            {type.label}
                          </PinkButton>
                        );
                      })
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ p: 3, width: 200, height: 100 }}
                        onClick={() => {
                          submitSale(payments);
                          handleClose();
                        }}
                      >
                        {t("sales.compleetsale")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            sx={{ p: 3, width: 200, height: 50 }}
            onClick={clearList}
          >
            {t("common.cancel")}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default Splitpayment;
