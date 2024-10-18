import React, { forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple, pink } from "@mui/material/colors";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: pink[700],
    },
  },
});

function Dialogue(props) {
  const { showDialog, message, options, handleClose, info } = props;

  return (
    <div>
      <Dialog
        open={showDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog"
      >
        <DialogTitle>{"What can i do next?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog">{message}\n {info}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <ThemeProvider theme={theme}>
            {options.map((items, key) => {
              return (
                <Button
                  key={key}
                  variant="contained"
                  color={items.color}
                  onClick={items.action}
                >
                  {items.label}
                </Button>
              );
            })}
          </ThemeProvider>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dialogue;
