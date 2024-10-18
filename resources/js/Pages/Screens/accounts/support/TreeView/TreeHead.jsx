import React from "react";
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

import { useState } from "react";

import { pink } from "@mui/material/colors";
import { TreeSubHead } from ".";

export const TreeHead = (props) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FolderIcon fontSize="small" sx={{ color: pink[800] }} />
        </ListItemIcon>
        <ListItemText primary={props.type.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {props.type.child &&
            props.type.child.map((subtype) => {
              return <TreeSubHead subtype={subtype} key={Math.random()} />;
            })}
        </List>
      </Collapse>
    </>
  );
};
