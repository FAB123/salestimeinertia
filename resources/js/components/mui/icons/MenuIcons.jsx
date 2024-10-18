import React from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Brightness1OutlinedIcon from "@mui/icons-material/Brightness1Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

function MenuIcons(props) {
  const { icon } = props;
  switch (icon) {
    case "BarChartOutlinedIcon":
      return <BarChartOutlinedIcon />;
    case "DnsOutlinedIcon":
      return <DnsOutlinedIcon />;
    case "DashboardOutlinedIcon":
      return <DashboardOutlinedIcon />;
    case "AccountCircleOutlinedIcon":
      return <AccountCircleOutlinedIcon />;
    case "PeopleAltOutlinedIcon":
      return <PeopleAltOutlinedIcon />;
    case "ArticleOutlinedIcon":
      return <ArticleOutlinedIcon />;
    case "LocalShippingOutlinedIcon":
      return <LocalShippingOutlinedIcon />;
    case "ShoppingCartOutlinedIcon":
      return <ShoppingCartOutlinedIcon />;
    case "SecurityOutlinedIcon":
      return <SecurityOutlinedIcon />;
    case "AccountBalanceOutlinedIcon":
      return <AccountBalanceOutlinedIcon />;
    case "BuildCircleOutlinedIcon":
      return <BuildCircleOutlinedIcon />;
    case "SettingsOutlinedIcon":
      return <SettingsOutlinedIcon />;
    case "Brightness1OutlinedIcon":
      return <Brightness1OutlinedIcon {...props} />;
    case "ForwardToInboxOutlinedIcon":
      return <ForwardToInboxOutlinedIcon />;
    default:
      return <RadioButtonUncheckedIcon sx={{ fontSize: 10 }} />;
  }
}

export default MenuIcons;
