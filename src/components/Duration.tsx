import { FC, useEffect, useState } from 'react';

interface Props {
  getDuration: () => number;
  stop?: boolean;
}

const Duration: FC<Props> = ({ getDuration, stop }) => {
  const [duration, setDuration] = useState(formatDuration(getDuration()));

  useEffect(() => {
    if (stop) return;

    const interval = setInterval(() => {
      setDuration(formatDuration(getDuration()));
    }, 500);

    return () => clearInterval(interval);
  }, [getDuration, stop]);

  return (
    <span className='text-xs text-gray-400'>
      {duration}
    </span>
  );
}

export default Duration;

const pad = (n: number) => n.toString().padStart(2, '0');

const formatDuration = (milliseconds: number) => {
  const duration = Math.floor(milliseconds / 1000);
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
