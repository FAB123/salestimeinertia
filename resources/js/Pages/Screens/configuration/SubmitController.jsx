import React from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";

function SubmitController() {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ pl: 3, pr: 2, m: 2 }}
    >
      <Button
        type="cancel"
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => {
          if (window.confirm("Are you Sure?")) console.log("reseting..");
          return;
        }}
      >
        <u>C</u>ancel
      </Button>
      <Button type="submit" variant="contained" endIcon={<SendIcon />}>
        <u>S</u>ubmit
      </Button>
    </Stack>
  );
}

export default SubmitController;
