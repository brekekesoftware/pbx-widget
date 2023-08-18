import { FC, useEffect, useState } from 'react';

interface Props {
  milliseconds: number | (() => number);
  stop?: boolean;
}

const Duration: FC<Props> = ({ milliseconds, stop }) => {
  const [duration, setDuration] = useState(formatDuration(milliseconds));

  useEffect(() => {
    if (stop || typeof milliseconds === 'number') return;

    const interval = setInterval(() => {
      setDuration(formatDuration(milliseconds()));
    }, 500);

    return () => clearInterval(interval);
  }, [milliseconds, stop]);

  return (
    <span className="text-xs text-gray-400">
      {duration}
    </span>
  );
};

export default Duration;

const pad = (n: number) => n.toString().padStart(2, '0');

const formatDuration = (milliseconds: number | (() => number)) => {
  const duration = Math.floor((typeof milliseconds === 'function' ? milliseconds() : milliseconds) / 1000);
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
