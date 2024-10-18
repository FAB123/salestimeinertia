import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ListItemIcon, ListItemText } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

function QuickMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const memmorizedMenu = React.useMemo(
        () => [
            { label: "cash_sales", url: "/sales/cash_sales" },
            { label: "cash_sales_return", url: "/sales/cash_sales" },
            { label: "credit_sales", url: "/sales/cash_sales" },
            { label: "credit_sales_return", url: "/sales/cash_sales" },
            { label: "quotation", url: "/sales/cash_sales" },
            { label: "workorder", url: "/sales/cash_sales" },
        ],
        []
    );

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                    my: 1,
                    color: "white",
                    display: "block",
                }}
            >
                CREATE NEW
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {memmorizedMenu.map(
                    (item, index) =>
                        auth.permissions.includes(item.label) && (
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    router.get(item.url);
                                }}
                                key={index}
                            >
                                <ListItemIcon>
                                    <ArrowForwardIosIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t(`modules.${item.label}`)}
                                </ListItemText>
                            </MenuItem>
                        )
                )}
            </Menu>
        </div>
    );
}

export default React.memo(QuickMenu);
