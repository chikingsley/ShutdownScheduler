import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  onEnd: () => void;
  colorClass?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onEnd,
  colorClass = "text-white",
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onEnd();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onEnd]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className={`flex flex-col items-center justify-center ${colorClass}`}>
      <div className="text-8xl md:text-9xl font-black tracking-tighter tabular-nums drop-shadow-2xl">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      <div className="mt-4 uppercase tracking-[0.3em] text-sm opacity-60 font-medium">
        Remaining Time
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-1 bg-white/10 mt-8 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{ width: `${(secondsLeft / initialSeconds) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
