import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Timer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percent = (timeLeft / (duration * 60)) * 100;
    if (percent <= 10) return 'text-red-600';
    if (percent <= 25) return 'text-orange-600';
    return 'text-gray-900';
  };

  const getTimeBackground = () => {
    const percent = (timeLeft / (duration * 60)) * 100;
    if (percent <= 10) return 'bg-red-50 border-red-200';
    if (percent <= 25) return 'bg-orange-50 border-orange-200';
    return 'bg-gray-50 border-gray-200';
  };

  const toggleTimer = () => {
    if (isCompleted) {
      setTimeLeft(duration * 60);
      setIsCompleted(false);
      setIsRunning(false);
    } else {
      setIsRunning(prev => !prev);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`px-4 py-2 rounded-lg border ${getTimeBackground()}`}>
        <div className="flex items-center gap-2">
          <Clock className={`h-4 w-4 ${getTimeColor()}`} aria-hidden="true" />
          <span
            className={`font-mono text-lg font-semibold ${getTimeColor()}`}
            aria-label={`Time left: ${formatTime(timeLeft)}`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleTimer}
          aria-label={
            isCompleted ? 'Reset Timer' : isRunning ? 'Pause Timer' : 'Start Timer'
          }
        >
          {isCompleted ? (
            <Square className="h-4 w-4" />
          ) : isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        {(isRunning || isCompleted) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={stopTimer}
            aria-label="Stop and Reset Timer"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCompleted && (
        <Badge variant="destructive" className="animate-pulse">
          Time’s Up!
        </Badge>
      )}
    </div>
  );
};

export default Timer;
