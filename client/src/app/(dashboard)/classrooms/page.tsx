'use client';

import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { AddClassroom } from './AddClassroom';
import { EditClassroom } from './EditClassroom';
import { ExportButton } from '@/components/ExportButton';
import { ImportDialog } from '@/components/ImportDialog';
import { MoreHorizontal, School, Loader2, Search, ArrowUpDown, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface Classroom {
  _id: string;
  name: string;
  capacity: number;
  equipment: string[];
  location: string;
  roomType: string;
  department?: string;
}

type SortKey = keyof Classroom | null;
type SortDirection = 'asc' | 'desc' | null;

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [classroomToEdit, setClassroomToEdit] = useState<Classroom | null>(null);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const authContext = useContext(AuthContext);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchClassrooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/classrooms`, {
        params: {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        }
      });
      const data = response.data;
      setClassrooms(data.data);
      setTotalItems(data.total || 0);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch classrooms." });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, currentPage, itemsPerPage, toast]);

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchClassrooms();
    }
  }, [authContext?.isAuthenticated, fetchClassrooms]);

  const handleSort = (key: keyof Classroom) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      } else setSortDirection('asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!classroomToDelete) return;
    try {
      await axios.delete(`${API_URL}/api/classrooms/${classroomToDelete._id}`);
      toast({ title: "Success", description: `Classroom "${classroomToDelete.name}" has been deleted.` });
      fetchClassrooms(); // Refetch data
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete classroom." });
    } finally {
      setClassroomToDelete(null);
    }
  };

  const renderActions = (classroom: Classroom) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setClassroomToEdit(classroom)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onSelect={() => setClassroomToDelete(classroom)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const filteredAndSortedClassrooms = useMemo(() => {
    let filtered = [...classrooms];
    const lowerCaseSearch = searchTerm.toLowerCase();

    if (lowerCaseSearch) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(lowerCaseSearch) ||
        room.location.toLowerCase().includes(lowerCaseSearch) ||
        room.roomType.toLowerCase().includes(lowerCaseSearch) ||
        (room.department && room.department.toLowerCase().includes(lowerCaseSearch))
      );
    }

    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(room => room.department && selectedDepartments.includes(room.department));
    }

    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter(room => selectedRoomTypes.includes(room.roomType));
    }

    if (sortKey && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [classrooms, searchTerm, selectedDepartments, selectedRoomTypes, sortKey, sortDirection]);

  const allClassroomsForFilters = useMemo(() => classrooms, [classrooms]);
  const uniqueDepartments = useMemo(() => Array.from(new Set(allClassroomsForFilters.map(c => c.department).filter(Boolean as any))), [allClassroomsForFilters]);
  const uniqueRoomTypes = useMemo(() => Array.from(new Set(allClassroomsForFilters.map(c => c.roomType))), [allClassroomsForFilters]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="px-1 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Classrooms</h1>
          <p className="text-muted-foreground mt-1">Manage all classrooms in your institution.</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportDialog endpoint="/api/classrooms/import" onSuccess={fetchClassrooms} />
          <ExportButton endpoint="/api/classrooms/export" fileName="classrooms.xlsx" />
          <AddClassroom onSuccess={fetchClassrooms} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search classrooms..." className="w-full rounded-lg bg-background pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueDepartments.map(dept => (
              <DropdownMenuCheckboxItem key={dept} checked={selectedDepartments.includes(dept!)} onCheckedChange={(checked) => setSelectedDepartments(prev => checked ? [...prev, dept!] : prev.filter(d => d !== dept))}>
                {dept}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Room Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueRoomTypes.map(type => (
              <DropdownMenuCheckboxItem key={type} checked={selectedRoomTypes.includes(type)} onCheckedChange={(checked) => setSelectedRoomTypes(prev => checked ? [...prev, type] : prev.filter(t => t !== type))}>
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : classrooms.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('name')} className="p-0 h-auto">Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('location')} className="p-0 h-auto">Location <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('roomType')} className="p-0 h-auto">Type <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('capacity')} className="p-0 h-auto">Capacity <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('department')} className="p-0 h-auto">Department <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedClassrooms.map((classroom) => (
                    <TableRow key={classroom._id}>
                      <TableCell className="font-medium align-middle">{classroom.name}</TableCell>
                      <TableCell className="align-middle">{classroom.location}</TableCell>
                      <TableCell className="align-middle">{classroom.roomType}</TableCell>
                      <TableCell className="align-middle">{classroom.capacity}</TableCell>
                      <TableCell className="align-middle">{classroom.department || 'N/A'}</TableCell>
                      <TableCell className="text-right align-middle">{renderActions(classroom)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAndSortedClassrooms.length === 0 && (
                 <div className="p-4 text-center text-muted-foreground">
                    No results found for the selected filters.
                 </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
                <Button onClick={handlePrevPage} disabled={currentPage === 1} size="sm">Previous</Button>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} size="sm">Next</Button>
            </div>
             <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))} className="rounded-md border p-2 text-sm bg-card">
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card h-64 text-center p-8">
          <School className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Classrooms Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first classroom.</p>
          <div className="mt-6"><AddClassroom onSuccess={fetchClassrooms} /></div>
        </div>
      )}

      <AlertDialog open={!!classroomToDelete} onOpenChange={(open) => { if (!open) setClassroomToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the classroom <span className="font-semibold">{classroomToDelete?.name}</span> and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {classroomToEdit && (
        <EditClassroom classroom={classroomToEdit} onClose={() => setClassroomToEdit(null)} onSuccess={fetchClassrooms} />
      )}
    </div>
  );
}