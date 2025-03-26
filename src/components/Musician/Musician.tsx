import { MouseEvent } from "react";
import { useMusician } from "../../selectors/musicians.selectors.ts";
import { styled } from "@mui/material/styles";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../hooks.ts";
import { removeMusician } from "../../reducers/musicians.reducer.ts";
import EditMusicianDialog from "../EditMusicianDialog/EditMusicianDialog.tsx";

interface MusicianProps {
  id: string;
}

const MusicianContainer = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: "none",
  justifyContent: "flex-start",
  padding: theme.spacing(1),
  ":nth-of-type(2n)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Musician({ id }: MusicianProps) {
  const dispatch = useAppDispatch();
  const musician = useMusician(id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const contextOpen = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    setEditOpen(true);
    handleClose();
  };
  const handleRemove = () => {
    dispatch(removeMusician({ id }));
    handleClose();
  };

  return (
    <>
      <MusicianContainer
        aria-controls={contextOpen ? "musician-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={contextOpen ? "true" : undefined}
      >
        {musician.name}
      </MusicianContainer>
      <Menu open={contextOpen} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleRemove}>Remove</MenuItem>
      </Menu>
      <EditMusicianDialog
        key={musician.id}
        musicianId={musician.id}
        open={editOpen}
        handleClose={() => setEditOpen(false)}
      />
    </>
  );
}
