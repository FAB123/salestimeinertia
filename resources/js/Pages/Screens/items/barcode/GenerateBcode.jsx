import React from "react";
import { Stack, Typography } from "@mui/material";
import { useBarcode } from "next-barcode";

function GenerateBcode({
  value,
  height,
  width,
  format,
  row1text,
  row2text,
  row3text,
  row1size,
  row2size,
  row3size,
}) {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      font: "cairo",
      margin: 1,
      textMargin:1,
      height: height,
      width: width,
      format: format,
      fontSize: row3size,
    },
  });
  return (
    <Stack>
      <Stack sx={{ mt: .25, alignItems: "center" }}>
        <Typography
          variant="subtitle1"
          component="div"
          gutterBottom={true}
          sx={{ lineHeight: 0.5, fontSize: `${row1size}px` }}
        >
          {row1text}
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          gutterBottom={true}
          sx={{ lineHeight: 0.5, fontSize: `${row2size}px` }}
        >
          {row2text}
        </Typography>
        <svg ref={inputRef} />
        <Typography
          variant="subtitle1"
          component="div"
          gutterBottom={true}
          sx={{ lineHeight: 0.5, mt: .25, fontSize: `${row2size}px` }}
        >
          {row3text}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default GenerateBcode;
