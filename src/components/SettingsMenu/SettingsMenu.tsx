import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { usePopulateMockData } from "../../hooks/usePopulateMockData";
import { useResetJam } from "../../hooks/useResetJam";
import AddInstrumentMenuItem from "./AddInstrumentMenuItem";

export default function SettingsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const populateMockData = usePopulateMockData();
  const resetJam = useResetJam();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResetJam = () => {
    resetJam();
    handleClose();
  };

  const handlePopulateMockData = () => {
    populateMockData();
    handleClose();
  };

  return (
    <>
      <IconButton
        id="settings-button"
        aria-controls={open ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        sx={{ color: "action.active" }}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { "aria-labelledby": "settings-button" } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <AddInstrumentMenuItem onClose={handleClose} />
        <MenuItem onClick={handlePopulateMockData}>
          <ListItemIcon>
            <AutoFixHighIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Populate Mock Data</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleResetJam}>
          <ListItemIcon>
            <RestartAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset Jam</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
