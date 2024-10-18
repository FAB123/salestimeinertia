import { createTheme, ThemeProvider } from "@mui/material";
import React, { useRef } from "react";
import { getData } from "../../../../apis/apiCalls";
import { Stack } from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintRounded";
import { exportToEXCEL } from "../../../../helpers/GeneralHelper";
import ToasterContainer from "../../ToasterContainer";
import MaterialTable from "material-table";
import {
  muiTableIcons,
  localization,
} from "../../../../constants/tableConstants";
import ReactToPrint from "react-to-print";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

export const Datatable = ({ title, header, url }) => {
  const theme = createTheme({
    typography: {
      fontFamily: "Cairo, Roboto, Helvetica, Arial, sans-serif",
    },
  });
  const tableRef = useRef();

  const options = {
    search: false,
    //filtering: true,
    exportButton: true,
    initialPage: 0,
    pageSize: 15,
    pageSizeOptions: [15, 25, 50, 100, 500, 750, 1000],
    padding: "dense",
    selection: false,
  };

  const generateExcel = (query) => {
    let sortField = query.orderBy ? query.orderBy : "null";
    let sortDir = query.orderDirection !== "" ? query.orderDirection : "null";
    let searchquery = query.search !== "" ? query.search : "null";
    url = `${url}/?page=0&size=3000&keyword=${searchquery}&sortitem=${sortField}&sortdir=${sortDir}`;
    exportToEXCEL(url, "Download");
  };

  return (
    <Stack sx={{ m: 1 }}>
      <ToasterContainer />
      <ThemeProvider theme={theme}>
        <MaterialTable
          tableRef={tableRef}
          icons={muiTableIcons}
          localization={localization()}
          title={title}
          data={(query) => {
            return new Promise((resolve, reject) => {
              let sortField = query.orderBy ? query.orderBy.field : "null";
              let sortDir =
                query.orderDirection !== "" ? query.orderDirection : "null";
              let searchquery = query.search ? query.search : "null";
              let dataUrl = `${url}/?page=${query.page + 1}&size=${
                query.pageSize
              }&keyword=${searchquery}&sortitem=${sortField}&sortdir=${sortDir}`;
              getData(dataUrl).then((result) => {
                resolve({
                  data: result.data.data,
                  page: result.data.current_page - 1,
                  totalCount: result.data.total,
                });
              });
            });
          }}
          columns={header}
          options={options}
          actions={[
            {
              tooltip: "Print",
              isFreeAction: true,
              icon: () => (
                <ReactToPrint
                  trigger={() => <PrintIcon />}
                  content={() => tableRef.current}
                />
              ),
              onClick: () => {
                return true;
              },
            },
            {
              tooltip: "Export all items to Excel",
              isFreeAction: true,
              icon: () => <TextSnippetIcon />,
              onClick: () => generateExcel(tableRef.current.state.query),
            },
          ]}
        ></MaterialTable>
      </ThemeProvider>
    </Stack>
  );
};
