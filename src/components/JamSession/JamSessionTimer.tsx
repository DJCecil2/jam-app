import { useState, useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { formatTime } from "../../utils/time.utils";

interface JamSessionTimerProps {
  onStop: (duration: number) => void;
}

export default function JamSessionTimer({ onStop }: JamSessionTimerProps) {
  const [time, setTime] = useState(0); // Timer value in seconds
  const [isRunning, setIsRunning] = useState(false);

  // Effect to handle the timer updates
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    // Cleanup the interval on unmount or when the timer stops
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev); // Toggle running state
  };

  const handleStop = () => {
    setIsRunning(false); // Stop the timer
    onStop(time);
    setTime(0); // Reset time
  };

  return (
    <Stack alignItems="center" spacing={1} pb={2}>
      <Typography variant="h4" component="h2">
        {formatTime(time)}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          onClick={handleStartPause}
          color={isRunning ? "inherit" : "primary"}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="contained"
          onClick={handleStop}
          color="error"
          disabled={time === 0}
        >
          Stop
        </Button>
      </Stack>
    </Stack>
  );
}
