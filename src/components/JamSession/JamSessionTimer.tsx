import { useState, useEffect } from "react";
import { Button, Stack, Typography, Tooltip } from "@mui/material";

import { formatTime } from "../../utils/time.utils";

interface JamSessionTimerProps {
  onStop: (duration: number) => void;
  onStart?: (startedAt: number) => void;
  onPause?: (pausedDuration: number) => void;
  onTimeChange?: (time: number) => void;
  disabled?: boolean;
  disabledReason?: string;
  startedAt?: number;
  pausedDuration?: number;
}

export default function JamSessionTimer({
  onStop,
  onStart,
  onPause,
  onTimeChange,
  disabled = false,
  disabledReason = "Cannot start a session with deleted musicians",
  startedAt,
  pausedDuration,
}: JamSessionTimerProps) {
  const [time, setTime] = useState(
    startedAt
      ? Math.floor((Date.now() - startedAt) / 1000)
      : (pausedDuration ?? 0),
  );
  const [isRunning, setIsRunning] = useState(Boolean(startedAt));

  useEffect(() => {
    if (startedAt) {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setTime(elapsed);
      onTimeChange?.(elapsed);
      setIsRunning(true);
      return;
    }

    const pausedElapsed = pausedDuration ?? 0;
    setTime(pausedElapsed);
    onTimeChange?.(pausedElapsed);
    setIsRunning(false);
  }, [onTimeChange, pausedDuration, startedAt]);

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
    if (isRunning) {
      setIsRunning(false);
      onPause?.(time);
      return;
    }

    const resumedStartedAt = Date.now() - time * 1000;
    onStart?.(resumedStartedAt);
    setIsRunning(true);
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
