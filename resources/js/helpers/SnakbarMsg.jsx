import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";

function SnakbarMsg(props) {
  const { msg } = props;
  const [open, setOpen] = useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
      open={open}
      onClose={handleClose}
      message={msg}
    />
  );
}

export default SnakbarMsg;
