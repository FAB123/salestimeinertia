import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";

import Collapse from "@mui/material/Collapse";
import { red } from "@mui/material/colors";
import { TreeList } from ".";

export const TreeSubHead = (props) => {
  const { subtype } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton sx={{ pl: 4 }} onClick={handleClick}>
        <ListItemIcon>
          <FolderIcon fontSize="small" sx={{ color: red[600] }} />
        </ListItemIcon>
        <ListItemText primary={subtype.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subtype.child &&
            subtype.child.map((items, subKey) => {
              return <TreeList items={items} key={subKey} />;
            })}
        </List>
      </Collapse>
    </>
  );
};
