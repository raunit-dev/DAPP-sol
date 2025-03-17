import React, { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 px-4 py-2 rounded-lg text-gray-300">
      {time.toLocaleTimeString()}
    </div>
  );
}
