import React from "react";
import { createContext, useState } from "react";

export const invoiceContext = createContext(null);

// function InvoiceContext({ children }) {
//   const [storeData, setSetStoreData] = useState(true);

//   return (
//     <posContext.Provider value={{ storeData, setSetStoreData }}>
//       {children}
//     </posContext.Provider>
//   );
// }

// export default InvoiceContext;
