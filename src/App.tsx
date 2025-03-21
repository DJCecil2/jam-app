import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { PlayerInstrumentView } from "./components/JamView/PlayerInstrumentView.tsx";

function App() {
  return (
    <>
      <CssBaseline />
      <PlayerInstrumentView />
    </>
  );
}

export default App;
