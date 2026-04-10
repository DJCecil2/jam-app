import {
  JamSessionsState,
  removeJamSession,
  updateJamSessionDuration,
} from "../../reducers/jamSession.reducer";
import {
  Stack,
  ListItem,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import JamSessionMember from "./JamSessionMember";
import JamSessionTimer from "./JamSessionTimer";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { formatTime } from "../../utils/time.utils";
import { useMemo, useState } from "react";
import JamSessionDialog from "./JamSessionDialog";

interface JamSessionProps {
  session: JamSessionsState[number];
  isCurrent?: boolean;
}

export default function JamSession({
  session,
  isCurrent = false,
}: JamSessionProps) {
  const dispatch = useAppDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(removeJamSession({ id: session.id }));
    handleMenuClose();
  };

  const handleStop = (duration: number) => {
    dispatch(updateJamSessionDuration({ id: session.id, duration }));
  };

  const isUpcoming = session.duration === undefined;

  const members = session.members;

  const musicians = useAppSelector((state) => state.musicians);
  const instruments = useAppSelector((state) => state.instruments);

  const { hasDeletedMusician, hasDeletedInstrument } = useMemo(() => {
    let deletedMusician = false;
    let deletedInstrument = false;

    members.forEach((member) => {
      const musician = musicians.find((m) => m.id === member.musicianId);
      const instrument = instruments.find((i) => i.id === member.instrumentId);

      if (musician?.isDeleted) {
        deletedMusician = true;
      }
      if (instrument?.isDeleted) {
        deletedInstrument = true;
      }
    });

    return {
      hasDeletedMusician: deletedMusician,
      hasDeletedInstrument: deletedInstrument,
    };
  }, [members, musicians, instruments]);

  const disabledReason = useMemo(() => {
    const reasons = [];
    if (hasDeletedMusician) reasons.push("deleted musicians");
    if (hasDeletedInstrument) reasons.push("deleted instruments");

    if (reasons.length === 0) return null;

    return `Cannot start a session with ${reasons.join(" and ")}`;
  }, [hasDeletedMusician, hasDeletedInstrument]);

  return (
    <ListItem disablePadding sx={{ py: 1 }}>
      <Stack width="100%" spacing={1}>
        <Box sx={{ position: "relative" }}>
          {isUpcoming && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                disabled={isCurrent && currentTime !== 0}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 12,
                  zIndex: 1,
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={handleEdit}
                  disabled={isCurrent && currentTime !== 0}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
          {isCurrent && (
            <JamSessionTimer
              onStop={handleStop}
              onTimeChange={setCurrentTime}
              disabled={!!disabledReason}
              disabledReason={disabledReason || undefined}
            />
          )}
          {!isCurrent && session.duration !== undefined && (
            <Typography
              variant="caption"
              align="center"
              sx={{ display: "block", color: "text.secondary", px: 2 }}
            >
              Duration: {formatTime(session.duration)}
            </Typography>
          )}
        </Box>
        <Stack spacing={0.5} sx={{ px: 2, pb: 1 }}>
          {members.map(({ musicianId, instrumentId }, index) => {
            const countBefore = members
              .slice(0, index)
              .filter((m) => m.instrumentId === instrumentId).length;
            const totalCount = members.filter(
              (m) => m.instrumentId === instrumentId,
            ).length;

            return (
              <JamSessionMember
                key={musicianId}
                musicianId={musicianId}
                instrumentId={instrumentId}
                occurrenceIndex={totalCount > 1 ? countBefore + 1 : undefined}
              />
            );
          })}
        </Stack>
      </Stack>
      <JamSessionDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        session={session}
      />
    </ListItem>
  );
}
