'use client';

import { useState, useEffect } from 'react';
import { MultiScreenHome } from '@/components/MultiScreenHome';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <MultiScreenHome currentTime={currentTime} />;
}
