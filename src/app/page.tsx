
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until loading is finished
    if (loading) {
      return;
    }

    if (user) {
      router.push('/editor');
    } else {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <p className="text-lg">Loading Mishra Studios...</p>
        {/* You can add a spinner or logo here */}
      </div>
    </div>
  );
}
