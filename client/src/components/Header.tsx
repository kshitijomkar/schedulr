// client/src/components/Header.tsx
'use client';

import React, { useContext, useState } from 'react'; // Import useState for sidebar state management
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Home, Menu, Users, School, CalendarDays, BookCopy, UsersRound } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;

  const { user, logout } = authContext;

  const getInitials = (name: string = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navItems = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/classrooms", icon: <School className="h-5 w-5" />, label: "Classrooms" },
    { href: "/faculty", icon: <Users className="h-5 w-5" />, label: "Faculty" },
    { href: "/subjects", icon: <BookCopy className="h-5 w-5" />, label: "Subjects" },
    { href: "/sections", icon: <UsersRound className="h-5 w-5" />, label: "Sections" },
    { href: "/timetables", icon: <CalendarDays className="h-5 w-5" />, label: "Timetables" },
  ];

  // State to manage sidebar open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to handle closing the sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Function to handle opening the sidebar
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
      <nav className="flex w-full items-center gap-6 text-lg font-medium md:gap-6">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={openSidebar} // Open sidebar when the menu button is clicked
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="text-left mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Logo showText={true} />
              </SheetTitle>
              <SheetDescription>
                Navigate to different sections of the application.
              </SheetDescription>
            </SheetHeader>
            <nav className="grid gap-2 text-base font-medium">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={closeSidebar} // Close sidebar when a link is clicked
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Updated this part: Logo link to dashboard for both mobile and desktop */}
        <Link href="/dashboard" className="flex md:hidden items-center gap-2 font-semibold">
          <Logo showText={true} />
        </Link>
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 font-semibold">
          <Logo showText={true} />
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
