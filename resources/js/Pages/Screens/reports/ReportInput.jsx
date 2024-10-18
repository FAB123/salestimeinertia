import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Autocomplete,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { FormControl, InputLabel, Select, TextField } from "@mui/material";
import { pink } from "@mui/material/colors";
import { PinkButton, PurpleButton } from "../../../Utils/Theming";
import { useEffect } from "react";
import { getData } from "../../../apis/apiCalls";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  GETALLSTORES,
  SEARCHCUSTOMERLIST,
  SEARCHEMPLOYEELIST,
  SEARCHSUPPLIERLIST,
} from "../../../constants/apiUrls";

import { locationHelper } from "../../../helpers/ReportHelper";
import { router } from "@inertiajs/react";
// import toaster from "../../instence/toaster";
// import { ToastContainer } from "react-toastify";
// import ToasterContainer from "../../components/controls/ToasterContainer";

function ReportInput(props) {
  const { setOpenInput, optionsList } = props;
  const { t } = useTranslation();
  

  //variable to generate list
  const [query, setQuery] = useState("");
  const [storeList, setStoreList] = useState([]);
  const [optionTwoList, setOptionTwoList] = useState([]);

  //selected options
  const [fromDate, setFromDate] = useState(new Date().setHours(0, 0, 0, 0));
  const [toDate, setToDate] = useState(new Date().setHours(23, 59, 59, 999));
  const [option1, setOption1] = useState("ALL");
  const [option2, setOption2] = useState(null);
  const [store, setStore] = useState("ALL");

  const handleChangeOption1 = (e) => {
    setOption1(e.target.value);
  };

  const handleChangeStore = (e) => {
    setStore(e.target.value);
  };

  const submit = () => {
    //validate
    if (optionsList.optionsTwo) {
      if (!option2) {
        alert("option 2 required");
        return true;
      }
    }

    let from = new Date(fromDate).toISOString();
    let to = new Date(toDate).toISOString();

    if (option2) {
      router.get(
        `/reports/show/${optionsList.type}/${from}/${to}/${option1}/${option2.id}/${store}`
      );
    } else {
      router.get(
        `/reports/show/${optionsList.type}/${from}/${to}/${option1}/ALL/${store}`
      );
    }
  };

  useEffect(() => {
    getData(GETALLSTORES).then((response) => {
      setStoreList([locationHelper, ...response.data]);
    });
  }, []);

  const getOptionName = (type) => {
    switch (type) {
      case "customer":
        return t("customers.customer");
      case "supplier":
        return t("suppliers.supplier");
      case "employee":
        return t("employee.employee");
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Stack sx={{ p: 2 }}>
        <Stack justifyContent={"center"}>
          <Typography
            variant="body1"
            color={pink[500]}
            gutterBottom={true}
            align={"center"}
          >
            SELECT INPUT
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2} sx={{ pt: 2 }}>
          <Stack>
            <InputLabel id="date_from">{t("common.from")}</InputLabel>
            <Flatpickr
              data-enable-time
              value={fromDate}
              options={{ enableTime: true, dateFormat: "d-m-Y H:i" }}
              render={({ defaultValue, value, ...props }, ref) => {
                return <TextField defaultValue={defaultValue} inputRef={ref} />;
              }}
              onChange={([fromDate]) => {
                setFromDate(fromDate);
              }}
            />
          </Stack>

          <Stack>
            <InputLabel id="date_to">{t("common.to")}</InputLabel>
            <Flatpickr
              data-enable-time
              value={toDate}
              options={{ enableTime: true, dateFormat: "d-m-Y H:i" }}
              render={({ defaultValue, value, ...props }, ref) => {
                return <TextField defaultValue={defaultValue} inputRef={ref} />;
              }}
              onChange={([toDate]) => {
                setToDate(toDate);
              }}
            />
          </Stack>
        </Stack>
        {optionsList.optionsOne && (
          <Stack direction={"row"} spacing={2} sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="option_label">{t("common.options1")}</InputLabel>
              <Select
                labelId="option_label"
                value={option1}
                onChange={handleChangeOption1}
              >
                {optionsList.optionsOne.map(({ name, value }) => {
                  return (
                    <MenuItem value={value} key={value}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Stack>
        )}
        {optionsList.optionsTwo && (
          <Stack direction={"row"} spacing={2} sx={{ pt: 2 }}>
            {option2 && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="option_label">
                    {t("common.options2")}
                  </InputLabel>
                  <Select
                    labelId="option2"
                    id="select_option2"
                    value={option2.id}
                    disabled
                  >
                    <MenuItem value={option2.id}>{option2.name}</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  aria-label="delete"
                  // sx={{ m: 0, p: 0 }}
                  size="large"
                  onClick={() => {
                    setOption2(null);
                  }}
                >
                  <DeleteForeverRoundedIcon fontSize="inherit" color="error" />
                </IconButton>
              </>
            )}
            {!option2 && (
              <Autocomplete
                // freeSolo
                sx={{ width: "100%" }}
                inputValue={query}
                clearOnEscape={true}
                options={optionTwoList}
                getOptionLabel={(option) => ` ${option.name} `}
                onChange={(event, value) => {
                  setQuery("");
                  setOptionTwoList([]);
                  setOption2(value);
                }}
                renderInput={(params) => {
                  let label = getOptionName(optionsList.optionsTwo);
                  return (
                    <TextField
                      {...params}
                      label={label}
                      autoFocus={true}
                      onChange={(e) => {
                        let searchItem = e.target.value;
                        if (searchItem !== "" || searchItem !== null) {
                          setQuery(searchItem);
                        }
                        if (searchItem.length > 2) {
                          if (optionsList.optionsTwo === "customer") {
                            getData(`${SEARCHCUSTOMERLIST}${searchItem}`).then(
                              (response) => {
                                let list = response.data.map((x, i) => ({
                                  name: x.name,
                                  id: x.customer_id,
                                }));
                                setOptionTwoList(list);
                              }
                            );
                          } else if (optionsList.optionsTwo === "employee") {
                            getData(`${SEARCHEMPLOYEELIST}${searchItem}`).then(
                              (response) => {
                                let list = response.data.map((x, i) => ({
                                  name: x.name,
                                  id: x.employee_id,
                                }));
                                setOptionTwoList(list);
                              }
                            );
                          } else if (optionsList.optionsTwo === "supplier") {
                            getData(`${SEARCHSUPPLIERLIST}${searchItem}`).then(
                              (response) => {
                                let list = response.data.map((x, i) => ({
                                  name: x.name,
                                  id: x.supplier_id,
                                }));
                                setOptionTwoList(list);
                              }
                            );
                          }
                        } else {
                          setOptionTwoList([]);
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  );
                }}
              />
            )}
          </Stack>
        )}
        {storeList && (
          <Stack direction={"row"} spacing={2} sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="location_select">
                {t("common.location")}
              </InputLabel>
              <Select
                labelId="location_select"
                // id="demo-simple-select"
                value={store}
                label="Age"
                onChange={handleChangeStore}
              >
                {storeList &&
                  storeList.map((store) => {
                    return (
                      <MenuItem
                        value={store.location_id}
                        key={store.location_id}
                      >
                        {store.location_name_en}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Stack>
        )}
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <PinkButton variant="outlined" onClick={() => setOpenInput(false)}>
            Clear
          </PinkButton>
          <PurpleButton variant="outlined" onClick={submit}>
            Fetch Report
          </PurpleButton>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}

export default ReportInput;
