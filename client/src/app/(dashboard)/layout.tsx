// client/src/app/(dashboard)/layout.tsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}