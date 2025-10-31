'use client';

import { useState, useEffect } from 'react';
import { MultiScreenHome } from '@/components/MultiScreenHome';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  return <MultiScreenHome currentTime={currentTime} />;
}
