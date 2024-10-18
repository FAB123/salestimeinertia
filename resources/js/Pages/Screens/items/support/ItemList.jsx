import React, { useState } from "react";

import toaster from "../../../../helpers/toaster";
import CartinputFiled from "../../../../components/mui/CartinputFiled";
import ToasterContainer from "../../../../components/ToasterContainer";


function ItemList(props) {
  const { cartItems, setCartItems, handleEnter, changeQty, addQty } = props;
  const [viewPrice, setViewPrice] = useState(false);

  const editCart = async (e, index) => {
    let olditems = cartItems[index];
    var value = parseFloat(e.value);
    olditems["qty"] = isNaN(value) ? "" : value;

    setCartItems([
      ...cartItems.slice(0, index),
      olditems,
      ...cartItems.slice(index + 1),
    ]);
  };

  const deleteCart = (e, index) => {
    setCartItems([...cartItems.slice(0, index), ...cartItems.slice(index + 1)]);
  };

  var tabindex = 0;

  return (
    <div className="base_cart">
      <ToasterContainer />

      <table className="table table-bordered table-hover table-responsive">
        <thead className="cart_header">
          <tr>
            <th style={{ width: "2%" }}></th>
            <th style={{ width: "30%" }}>Item Name</th>
            <th style={{ width: "10%" }}>Quantity</th>
            <th style={{ width: "7%" }}>Unit</th>
          </tr>
        </thead>

        <tbody className="cart_body">
          {cartItems
            .slice(0)
            .reverse()
            .map((item, index) => {
              return (
                <>
                  <tr>
                    <td>
                      <span
                        className="fa fa-trash fa-lg cart_delete_icon"
                        onClick={(e) => {
                          deleteCart(e, cartItems.length - 1 - index);
                        }}
                      ></span>
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <CartinputFiled
                        name="qty"
                        id="qty"
                        value={item.qty}
                        onChange={(e) => {
                          editCart(e, cartItems.length - 1 - index);
                        }}
                        onKeyDown={(event) => {
                          handleEnter(event, addQty);
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            let tempVal = { value: 1 };
                            toaster.warning("Qty Must be a valid Number");
                            editCart(tempVal, cartItems.length - 1 - index);
                          }
                        }}
                      />
                      {/* <input
                        name="qty"
                        id="qty"
                        tabIndex={tabindex++}
                        value={item.qty}
                        inputRef={index === 0 ? changeQty : null}
                        onKeyDown={(event) => {
                          handleEnter(event, addQty);
                        }}
                        type="text"
                        onChange={(e) => {
                          editCart(e, cartItems.length - 1 - index);
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            let tempVal = { value: 1 };
                            toaster.warning("Qty Must be a valid Number");
                            editCart(tempVal, cartItems.length - 1 - index);
                          }
                        }}
                      /> */}
                    </td>
                    <td>{item.unit}</td>
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
