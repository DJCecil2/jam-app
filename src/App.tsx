import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { PlayerInstrumentView } from "./components/JamView/PlayerInstrumentView.tsx";

function App() {
  const theme = createTheme({
    palette: {
      mode: "light", // or dynamic
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            display: "flex",
            placeItems: "unset",
            minWidth: "unset",
            minHeight: "unset",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlayerInstrumentView />
    </ThemeProvider>
  );
}

export default App;
