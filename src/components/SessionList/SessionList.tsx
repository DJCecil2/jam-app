import { Stack } from "@mui/material";
import AddJamSessionButton from "../AddJamSessionButton/AddJamSessionButton.tsx";
import { useJamSessions } from "../../selectors/jamSessions.selectors.ts";
import JamSession from "../JamSession/JamSession.tsx";

export default function SessionList() {
  const jamSessions = useJamSessions();

  console.log("hello world", jamSessions);

  return (
    <Stack
      minWidth="15vw"
      borderLeft="1px solid"
      borderColor="divider"
      alignItems="center"
      p={2}
    >
      {jamSessions.map((jamSession) => (
        <JamSession key={jamSession.id} session={jamSession} />
      ))}
      <AddJamSessionButton />
    </Stack>
  );
}
