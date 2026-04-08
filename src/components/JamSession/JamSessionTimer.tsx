import { useState, useEffect } from "react";

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
    <div style={{ textAlign: "center", padding: "16px" }}>
      <h2>{new Date(time * 1000).toISOString().substring(11, 19)}</h2>
      <button type="button" onClick={handleStartPause}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button type="button" onClick={handleStop} style={{ marginLeft: "8px" }}>
        Stop
      </button>
    </div>
  );
}
