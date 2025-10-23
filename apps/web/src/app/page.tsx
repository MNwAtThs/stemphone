'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page immediately
        router.push('/home');
    }, [router]);

    return null;
}
