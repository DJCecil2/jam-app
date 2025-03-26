import { Stack } from "@mui/material";
import AddJamSessionButton from "../../components/AddJamSessionButton/AddJamSessionButton.tsx";
import { useJamSessions } from "../../selectors/jamSessions.selectors.ts";

export default function SessionList() {
  const jamSessions = useJamSessions();

  console.log(jamSessions);

  return (
    <Stack
      minWidth="15vw"
      borderLeft="1px solid"
      borderColor="divider"
      alignItems="center"
      p={2}
    >
      <AddJamSessionButton />
    </Stack>
  );
}
