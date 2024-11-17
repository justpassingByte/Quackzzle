'use client'

import { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setProgress((prev) => (timeLeft / duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onTimeUp]);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>Thời gian còn lại</span>
        <span>{timeLeft}s</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}