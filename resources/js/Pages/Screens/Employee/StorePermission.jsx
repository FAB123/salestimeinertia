import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import React from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { t } from "i18next";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

function StorePermission({ stores, deleteByValue, addByValue, permission }) {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div>
            <ListItemButton onClick={handleClick}>
                {open ? <RemoveIcon /> : <AddIcon />}
                <ListItemText primary={t("permission.store_permission")} />
            </ListItemButton>
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                sx={{ m: 0, p: 0 }}
            >
                <List component="span" disablePadding>
                    {stores.map((permissionItem, index) => {
                        return (
                            <ListItemButton
                                sx={{ p: 0, m: 0, pl: 4 }}
                                onClick={() =>
                                    permission.includes(
                                        permissionItem.permission_id
                                    )
                                        ? deleteByValue(
                                              permissionItem.permission_id
                                          )
                                        : addByValue(
                                              permissionItem.permission_id
                                          )
                                }
                                key={index}
                            >
                                <ListItemIcon>
                                    {permission.includes(
                                        permissionItem.permission_id
                                    ) ? (
                                        <CheckBoxIcon
                                            fontSize="small"
                                            color="success"
                                        />
                                    ) : (
                                        <AddModeratorIcon
                                            fontSize="small"
                                            color="primary"
                                        />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={permissionItem.label} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Collapse>
        </div>
    );
}

export default StorePermission;
