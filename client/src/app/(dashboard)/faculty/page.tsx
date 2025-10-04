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
import { AddFaculty } from './AddFaculty';
import { EditFaculty } from './EditFaculty';
import { ExportButton } from '@/components/ExportButton';
import { ImportDialog } from '@/components/ImportDialog';
import { MoreHorizontal, Users, Loader2, Search, ArrowUpDown, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Subject {
  _id: string;
  name: string;
}

interface Faculty {
  _id: string;
  name: string;
  employeeId: string;
  email: string;
  department: string;
  subjectsTaught: Subject[];
}

type SortKey = keyof Faculty | null;
type SortDirection = 'asc' | 'desc' | null;

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [facultyToEdit, setFacultyToEdit] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const authContext = useContext(AuthContext);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/faculty`, {
        params: {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        }
      });
      const data = response.data;
      setFaculty(data.data);
      setTotalItems(data.total || 0);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch faculty." });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, currentPage, itemsPerPage, toast]);

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchFaculty();
    }
  }, [authContext?.isAuthenticated, fetchFaculty]);

  const handleSort = (key: keyof Faculty) => {
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
    if (!facultyToDelete) return;
    try {
      await axios.delete(`${API_URL}/api/faculty/${facultyToDelete._id}`);
      toast({ title: "Success", description: `Faculty member "${facultyToDelete.name}" has been deleted.` });
      fetchFaculty(); // Refetch data
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete faculty member." });
    } finally {
      setFacultyToDelete(null);
    }
  };

  const renderActions = (facultyMember: Faculty) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setFacultyToEdit(facultyMember)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onSelect={() => setFacultyToDelete(facultyMember)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const filteredAndSortedFaculty = useMemo(() => {
    let filtered = [...faculty];
    const lowerCaseSearch = searchTerm.toLowerCase();

    if (lowerCaseSearch) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(lowerCaseSearch) ||
        member.employeeId.toLowerCase().includes(lowerCaseSearch) ||
        member.department.toLowerCase().includes(lowerCaseSearch) ||
        member.subjectsTaught.some(subject => subject.name.toLowerCase().includes(lowerCaseSearch))
      );
    }

    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(member => selectedDepartments.includes(member.department));
    }

    if (sortKey && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (Array.isArray(aValue) || Array.isArray(bValue)) return 0; // Don't sort by array columns

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [faculty, searchTerm, selectedDepartments, sortKey, sortDirection]);

  const allFacultyForFilters = useMemo(() => faculty, [faculty]);
  const uniqueDepartments = useMemo(() => Array.from(new Set(allFacultyForFilters.map(f => f.department).filter(Boolean))), [allFacultyForFilters]);

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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Faculty</h1>
          <p className="text-muted-foreground mt-1">Manage all faculty members in your institution.</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportDialog endpoint="/api/faculty/import" onSuccess={fetchFaculty} />
          <ExportButton endpoint="/api/faculty/export" fileName="faculty.xlsx" />
          <AddFaculty onSuccess={fetchFaculty} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search faculty..." className="w-full rounded-lg bg-background pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
              <DropdownMenuCheckboxItem key={dept} checked={selectedDepartments.includes(dept)} onCheckedChange={(checked) => setSelectedDepartments(prev => checked ? [...prev, dept] : prev.filter(d => d !== dept))}>
                {dept}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : faculty.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('name')} className="p-0 h-auto">Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('employeeId')} className="p-0 h-auto">Employee ID <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('department')} className="p-0 h-auto">Department <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead>Subjects Taught</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedFaculty.map((facultyMember) => (
                    <TableRow key={facultyMember._id}>
                      <TableCell className="font-medium align-middle">{facultyMember.name}</TableCell>
                      <TableCell className="align-middle">{facultyMember.employeeId}</TableCell>
                      <TableCell className="align-middle">{facultyMember.department}</TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-wrap gap-1">
                          {facultyMember.subjectsTaught.map(subject => (
                            <Badge key={subject._id} variant="secondary">{subject.name}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-middle">{renderActions(facultyMember)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAndSortedFaculty.length === 0 && (
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
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Faculty Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first faculty member.</p>
          <div className="mt-6"><AddFaculty onSuccess={fetchFaculty} /></div>
        </div>
      )}

      <AlertDialog open={!!facultyToDelete} onOpenChange={(open) => { if (!open) setFacultyToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the faculty member <span className="font-semibold">{facultyToDelete?.name}</span> and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {facultyToEdit && (
        <EditFaculty faculty={facultyToEdit} onClose={() => setFacultyToEdit(null)} onSuccess={fetchFaculty} />
      )}
    </div>
  );
}