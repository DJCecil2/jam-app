import { useState, useEffect } from "react";
import { Button, Stack, Typography, Tooltip } from "@mui/material";

import { formatTime } from "../../utils/time.utils";

interface JamSessionTimerProps {
  onStop: (duration: number) => void;
  onTimeChange?: (time: number) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export default function JamSessionTimer({
  onStop,
  onTimeChange,
  disabled = false,
  disabledReason = "Cannot start a session with deleted musicians",
}: JamSessionTimerProps) {
  const [time, setTime] = useState(0); // Timer value in seconds
  const [isRunning, setIsRunning] = useState(false);

  // Effect to handle the timer updates
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeChange?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    // Cleanup the interval on unmount or when the timer stops
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [onTimeChange, isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev); // Toggle running state
  };

  const handleStop = () => {
    setIsRunning(false); // Stop the timer
    onStop(time);
    setTime(0); // Reset time
    onTimeChange?.(0);
  };

  return (
    <Stack alignItems="center" spacing={1} pb={2}>
      <Typography variant="h4" component="h2">
        {formatTime(time)}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Tooltip title={disabled && !isRunning ? disabledReason : ""} arrow>
          <span>
            <Button
              variant="contained"
              onClick={handleStartPause}
              color={isRunning ? "inherit" : "primary"}
              disabled={disabled && !isRunning}
            >
              {isRunning ? "Pause" : "Start"}
            </Button>
          </span>
        </Tooltip>
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
