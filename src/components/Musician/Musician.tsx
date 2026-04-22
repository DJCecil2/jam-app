import { MouseEvent } from "react";
import { useMusician } from "../../selectors/musicians.selectors";
import { styled } from "@mui/material/styles";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { removeMusician } from "../../reducers/musicians.reducer";
import EditMusicianDialog from "../EditMusicianDialog/EditMusicianDialog";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface MusicianProps {
  id: string;
  isRecommended?: boolean;
  isInUpcoming?: boolean;
}

const MusicianContainer = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isInUpcoming",
})<{ isInUpcoming?: boolean }>(({ theme, isInUpcoming }) => ({
  color: theme.palette.text.primary,
  textTransform: "none",
  justifyContent: "space-between",
  padding: theme.spacing(1),
  opacity: isInUpcoming ? 0.5 : 1,
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Musician({
  id,
  isRecommended,
  isInUpcoming,
}: MusicianProps) {
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
        isInUpcoming={isInUpcoming}
        fullWidth
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {musician.name}
          {isRecommended && (
            <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
          )}
        </Box>
        {isInUpcoming && (
          <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        )}
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
