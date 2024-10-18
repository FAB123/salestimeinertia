import React from "react";
// import { makeStyles } from "@mui/material/styles";
import { TextField } from "@mui/material";
// const style = makeStyles(() => ({
//   style1: {
//     // height: 5,
//     backgroundColor: "pink",
//     //backgroundColor: "#ccffff",
//     fontSize: "1em",
//     fontWeight: 700,
//     textAlign: "center",
//   },
// }));

function CartinputFiled(props) {
  // const classes = style();
  return (
    <TextField
      size="small"
      variant="filled"
      fullWidth={true}
      sx={{ padding: 0 }}
      {...props}
      onFocus={(event) => {
        event.target.select();
      }}
      // InputProps={{ classes: { input: classes.style1 } }}
    />
  );
}

export default CartinputFiled;
