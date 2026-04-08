import { Box, Stack, styled } from "@mui/material";
import AddJamSessionButton from "../AddJamSessionButton/AddJamSessionButton.tsx";
import { useJamSessions } from "../../selectors/jamSessions.selectors.ts";
import JamSession from "../JamSession/JamSession.tsx";

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderTop: "1px solid",
  borderColor: theme.palette.divider,
  justifyContent: "center",
  alignItems: "center",
}));

export default function SessionList() {
  const jamSessions = useJamSessions();

  return (
    <Stack
      minWidth="15vw"
      flexShrink={0}
      borderLeft="1px solid"
      borderColor="divider"
      justifyContent="space-between"
      sx={{
        position: "sticky",
        right: 0,
        zIndex: 1,
        bgcolor: "background.paper",
      }}
    >
      <Stack p={2} alignItems="center" flexGrow={1} sx={{ overflowY: "auto" }}>
        {jamSessions.map((jamSession, index) => (
          <JamSession
            key={jamSession.id}
            session={jamSession}
            isCurrent={index === 0}
          />
        ))}
      </Stack>
      <FooterContainer>
        <AddJamSessionButton />
      </FooterContainer>
    </Stack>
  );
}
