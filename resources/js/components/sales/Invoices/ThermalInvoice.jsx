import {
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

function ThermalInvoice() {
  return (
    <Stack sx={{ backgroundColor: "red" }}>
      <Stack>
        <Typography align="center">Simplified TAX Invoice</Typography>
        <Typography align="center">فاتورة ضریبیة المبسطة</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Stack sx={{ width: "50%" }}>
          <Typography align="left" variant="h6">
            Company Name
          </Typography>
          <Typography align="left" variant="h6">
            Company Name Company Name Company Name Company Name Company Name
            Company Name
          </Typography>
        </Stack>
        <Stack sx={{ width: "50%" }}>
          <Typography align="right" variant="h6">
            Company Name
          </Typography>
          <Typography align="right" variant="h6">
            Company Name Company Name Company Name Company Name Company Name
            Company Name
          </Typography>
        </Stack>
      </Stack>
      <Divider variant="fullwidth">CENTER</Divider>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography align="left" variant="h6">
          Invoice Number
        </Typography>
        <Typography align="center" variant="h6">
          7486758
        </Typography>
        <Typography align="rigth" variant="h6">
          رقم الفاتورة
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography align="left" variant="h6">
          Invoice Date
        </Typography>
        <Typography align="center" variant="h6">
          10/10/2022 10:10PM
        </Typography>
        <Typography align="rigth" variant="h6">
          تاريخ اصدار الفاتورة
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>Item / Service Name</Typography>
                <Typography>تفاصیل السلع أو الخدمات</Typography>
              </TableCell>
              <TableCell>
                <Typography>Unit price</Typography>
                <Typography>سعر الوحدة</Typography>
              </TableCell>
              <TableCell>
                <Typography>Quantity</Typography>
                <Typography>الكمیة</Typography>
              </TableCell>
              <TableCell>
                <Typography>Item Subtotal (Including VAT)</Typography>
                <Typography>المجموع (شامل ضریبة القیمة المضافة)</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>ALFA</TableCell>
              <TableCell>100</TableCell>
              <TableCell>1</TableCell>
              <TableCell>115</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ALFA</TableCell>
              <TableCell>100</TableCell>
              <TableCell>1</TableCell>
              <TableCell>115</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ALFA</TableCell>
              <TableCell>100</TableCell>
              <TableCell>1</TableCell>
              <TableCell>115</TableCell>
            </TableRow>
          </TableBody>
          <Divider></Divider>
        </Table>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography align="left" variant="h6">
          Total Taxable Amount (Excluding VAT)
        </Typography>
        <Typography align="center" variant="h6">
          الإجمالي الخاضع للضریبة (غیر شامل ضریبة القیمة (المض
        </Typography>
        <Typography align="rigth" variant="h6">
          1144
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography align="left" variant="h6">
          Total VAT
        </Typography>
        <Typography align="center" variant="h6">
          المضافة القیمة ضریبة مجموع
        </Typography>
        <Typography align="rigth" variant="h6">
          144
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography align="left" variant="h6">
          Total Amount Due
        </Typography>
        <Typography align="center" variant="h6">
          المستحق المبلغ إجمالي
        </Typography>
        <Typography align="rigth" variant="h6">
          1,035.00
        </Typography>
      </Stack>
    </Stack>
  );
}

export default ThermalInvoice;
