const customerValidater = [
  "name",
  "email",
  "mobile",
  "account",
  "vat",
  "type",
  "taxable",
  "comments",
];
const supplierValidater = [
  "name",
  "email",
  "mobile",
  "account",
  "vat",
  "contactperson",
  "taxable",
  "comments",
];
const itemValidater = [
  "item_name",
  "item_name_ar",
  "barcode",
  "category",
  "cost_price",
  "unit_price",
  "wholesale_price",
  "minimum_price",
  "reorder_level",
  "vat1",
  "shelf",
  "comments",
  "allowdesc",
  "allowserial",
  "stock_type",
  "unit_type",
];

// const itemValidater1 = [
//   { item: "name", required: true },
//   { item: "itemnamear", required: false },
//   { item: "barcode", required: false },
//   { item: "category", required: true },
//   { item: "price", required: true },
//   { item: "wholesaleprice", required: true },
//   { item: "minimumprice", required: true },
//   { item: "reorderlevel", required: true },

//   { item: "uom", required: true },
//   { item: "shelf", required: false },
//   { item: "comments", required: false },
//   { item: "allowdesc", required: false },
//   { item: "boxedItem", required: false },
//   { item: "stocked", required: false },
// ];

export { customerValidater, itemValidater, supplierValidater };
