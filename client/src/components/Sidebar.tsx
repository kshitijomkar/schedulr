// client/src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Home, Users, School, CalendarDays, PanelLeft, Package2, BookCopy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/timetables", icon: <CalendarDays className="h-5 w-5" />, label: "Timetables" },
    { href: "/classrooms", icon: <School className="h-5 w-5" />, label: "Classrooms" },
    { href: "/faculty", icon: <Users className="h-5 w-5" />, label: "Faculty" },
    { href: "/subjects", icon: <BookCopy className="h-5 w-5" />, label: "Subjects" }, // New Link
  ];

  return (
    <aside className={cn("fixed inset-y-0 left-0 z-40 h-full border-r bg-muted/40 transition-all duration-300 ease-in-out md:relative", isCollapsed ? "w-20" : "w-64")}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
        <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed && "w-0 overflow-hidden")}>
          <Package2 className="h-6 w-6" />
          <span className="">Schedulr</span>
        </Link>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsCollapsed(!isCollapsed)}>
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <TooltipProvider>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) =>
              isCollapsed ? (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", isActive(item.href) && "bg-muted text-foreground")}>
                      {item.icon}
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive(item.href) && "bg-muted text-primary")}>
                  {item.icon}
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </TooltipProvider>
      </div>
    </aside>
  );
}