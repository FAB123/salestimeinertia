import { Button, Stack } from "@mui/material";
import printJS from "print-js";
import React from "react";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { PurpleButton } from "../../../../../Utils/Theming";
import "./style.css";

function SimpleReceipt() {
  const receiptRef = useRef();
  return (
    <div>
      <Button
        onClick={() => {
          printJS({
            printable: "receipt",
            type: "html",
            style: ["@page { size: 80mm 400mm;}"],
            targetStyles: ["*"],
          });
        }}
      >
        Tst
      </Button>

      <div className="content" id="receipt" style={{ marginTop: "10px" }}>
        <div style={{ textAlign: "center" }}>
          <img
            style={{
              display: "inline-block",
              height: "50px",
              width: "180px",
              overflow: "auto",
            }}
            src="https://laundry.redplanetcomputers.com/demo//assets/images/logo.png"
          />
        </div>
        <div className="title" style={{ marginTop: "0px" }}>
          <span style={{ fontWeight: "bold" }}> Bright Gerji </span>
          <br />
          <span style={{ fontWeight: "bold" }}> يبمنتيمن نيتب </span>
          <br />
          Gerji <br />
          Addis Ababa Addis Ababa - 1000 <br />
          Contact : 0931729242 Email : alsa@gmail.com
          <br />
          Tax/Vat No : 473642736273
        </div>
        <div className="separate-line" />
        <div className="transaction">
          <table
            className="transaction-table"
            cellSpacing={0}
            cellPadding={0}
            style={{ fontSize: "10px" }}
          >
            <tbody>
              <tr>
                <td colSpan={6}>
                  <div className="separate-line" />
                </td>
              </tr>
              <tr>
                <td colSpan={2}> Invoice : RPL137 </td>
                <td colSpan={4} style={{ textAlign: "right" }}>
                  Date : 1-Dec-22
                </td>
              </tr>
              <tr>
                <td colSpan={6}>
                  <div className="separate-line" />
                </td>
              </tr>
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Joseph ( 0700357895 )
                </td>
              </tr>
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  <img
                    src="https://laundry.redplanetcomputers.com/demo/barcode/R P L 1 3 7 .png"
                    style={{ height: "80%", width: "80%" }}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={6}>
                  <div className="separate-line" />
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: "left" }}>Description</th>
                <th style={{ textAlign: "center" }}> Rate</th>
                <th style={{ textAlign: "right" }}> Qty</th>
                <th style={{ textAlign: "right" }}> Sub Total</th>
                <th style={{ textAlign: "right" }}> VAT</th>
                <th style={{ textAlign: "right" }}> Total</th>
              </tr>
              <tr style={{ fontSize: "5px" }}>
                <th style={{ textAlign: "left" }}>وصف</th>
                <th style={{ textAlign: "center" }}> سعر</th>
                <th style={{ textAlign: "right" }}> الكمية</th>
                <th style={{ textAlign: "right" }}> المجموع الفرعي</th>
                <th style={{ textAlign: "right" }}> ضريبة</th>
                <th style={{ textAlign: "right" }}> مجموع</th>
              </tr>
              <tr>
                <td colSpan={6}>
                  <div className="separate-line" />
                </td>
              </tr>
              <tr>
                <td style={{ width: "180px", paddingBottom: "4px" }}>
                  SHIRT
                  <br />
                  <span style={{ fontSize: "7px" }}>DRY CLEANING</span> <br />
                  <span style={{ fontSize: "7px" }}>
                    Adidas/ Button Loose/ Green
                  </span>
                </td>
                <td align="right"> 60.00 </td>
                <td className="sell-price" align="left">
                  4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>

                <td className="final-price">240.00</td>
                <td className="final-price">240.00</td>
                <td className="final-price">240.00</td>
              </tr>

              <tr>
                <td colSpan={6}>
                  <div className="separate-line" />
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="final-price">
                  Sub Total :
                </td>
                <td style={{ textAlign: "center" }}>(7 Qty)</td>

                <td className="final-price">390.00</td>
              </tr>

              <tr>
                <td
                  colSpan={4}
                  className="final-price"
                  style={{ fontSize: "12px" }}
                >
                  Net Amount :
                </td>
                <td
                  className="final-price"
                  style={{ fontSize: "12px", textAlign: "right" }}
                  colSpan={2}
                >
                  €&nbsp;390.00
                </td>
              </tr>

              <tr>
                <td colSpan={6}>
                  <div className="separate-line" />
                </td>
              </tr>
              <tr>
                <td>
                  <br />
                </td>
              </tr>
              <tr style={{ textAlign: "center" }}>
                <td colSpan={6}>
                  <span style={{ marginTop: "10px" }}>
                    :: Thanking you Visit again ::
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SimpleReceipt;
