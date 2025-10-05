// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link href="/dashboard" className="mt-6 inline-block bg-primary text-primary-foreground px-4 py-2 rounded">
        Return to Dashboard
      </Link>
    </div>
  );
}