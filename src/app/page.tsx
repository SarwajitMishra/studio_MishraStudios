
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// This is a temporary redirect to the dashboard.
// In a real app, you'd check for authentication here.
export default function HomeRedirect() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    // Simulate an auth check, then redirect.
    const timer = setTimeout(() => {
        router.push('/dashboard');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <p className="text-lg">Loading Mishra Studios...</p>
        {/* You can add a spinner or logo here */}
      </div>
    </div>
  );
}
