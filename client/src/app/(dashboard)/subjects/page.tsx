'use client';

import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { AddSubject } from './AddSubject';
import { EditSubject } from './EditSubject';
import { ImportDialog } from '@/components/ImportDialog';
import { ExportButton } from '@/components/ExportButton';
import { MoreHorizontal, BookCopy, Loader2, Search, ArrowUpDown, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface Subject {
  _id: string;
  name: string;
  code: string;
  semester: number;
  department: string;
  lectureHours: number;
  labHours: number;
  tutorialHours: number;
  courseType: string;
}

type SortKey = keyof Subject | null;
type SortDirection = 'asc' | 'desc' | null;

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const authContext = useContext(AuthContext);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/subjects`, {
        params: {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        }
      });
      const data = response.data;
      setSubjects(data.data);
      setTotalItems(data.total || 0);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch subjects." });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, currentPage, itemsPerPage, toast]);

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchSubjects();
    }
  }, [authContext?.isAuthenticated, fetchSubjects]);

  const handleSort = (key: keyof Subject) => {
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
    if (!subjectToDelete) return;
    try {
      await axios.delete(`${API_URL}/api/subjects/${subjectToDelete._id}`);
      toast({ title: "Success", description: `Subject "${subjectToDelete.name}" has been deleted.` });
      fetchSubjects();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete subject." });
    } finally {
      setSubjectToDelete(null);
    }
  };

  const renderActions = (subject: Subject) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setSubjectToEdit(subject)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onSelect={() => setSubjectToDelete(subject)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const filteredAndSortedSubjects = useMemo(() => {
    let filtered = [...subjects];
    const lowerCaseSearch = searchTerm.toLowerCase();

    if (lowerCaseSearch) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(lowerCaseSearch) ||
        sub.code.toLowerCase().includes(lowerCaseSearch) ||
        sub.department.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(sub => selectedDepartments.includes(sub.department));
    }
    if (selectedSemesters.length > 0) {
      filtered = filtered.filter(sub => selectedSemesters.includes(sub.semester));
    }
    if (selectedCourseTypes.length > 0) {
      filtered = filtered.filter(sub => selectedCourseTypes.includes(sub.courseType));
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
  }, [subjects, searchTerm, selectedDepartments, selectedSemesters, selectedCourseTypes, sortKey, sortDirection]);
  
  const allSubjectsForFilters = useMemo(() => subjects, [subjects]);
  const uniqueDepartments = useMemo(() => Array.from(new Set(allSubjectsForFilters.map(s => s.department))), [allSubjectsForFilters]);
  const uniqueSemesters = useMemo(() => Array.from(new Set(allSubjectsForFilters.map(s => s.semester))).sort((a, b) => a - b), [allSubjectsForFilters]);
  const uniqueCourseTypes = useMemo(() => Array.from(new Set(allSubjectsForFilters.map(s => s.courseType))), [allSubjectsForFilters]);

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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage all subjects and courses for your institution.</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportDialog endpoint="/api/subjects/import" onSuccess={fetchSubjects} />
          <ExportButton endpoint="/api/subjects/export" fileName="subjects.xlsx" />
          <AddSubject onSuccess={fetchSubjects} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search subjects..." className="w-full rounded-lg bg-background pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            {uniqueDepartments.map(dept => (<DropdownMenuCheckboxItem key={dept} checked={selectedDepartments.includes(dept)} onCheckedChange={(c) => setSelectedDepartments(p => c ? [...p, dept] : p.filter(d => d !== dept))}>{dept}</DropdownMenuCheckboxItem>))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Semester</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueSemesters.map(sem => (<DropdownMenuCheckboxItem key={sem} checked={selectedSemesters.includes(sem)} onCheckedChange={(c) => setSelectedSemesters(p => c ? [...p, sem] : p.filter(s => s !== sem))}>Sem {sem}</DropdownMenuCheckboxItem>))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueCourseTypes.map(type => (<DropdownMenuCheckboxItem key={type} checked={selectedCourseTypes.includes(type)} onCheckedChange={(c) => setSelectedCourseTypes(p => c ? [...p, type] : p.filter(t => t !== type))}>{type}</DropdownMenuCheckboxItem>))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : subjects.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('code')} className="p-0 h-auto">Code<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('name')} className="p-0 h-auto">Name<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('department')} className="p-0 h-auto">Dept.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('semester')} className="p-0 h-auto">Sem<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('courseType')} className="p-0 h-auto">Type<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead>L/T/P Hrs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedSubjects.map((subject) => (
                    <TableRow key={subject._id}>
                      <TableCell className="font-medium align-middle">{subject.code}</TableCell>
                      <TableCell className="align-middle">{subject.name}</TableCell>
                      <TableCell className="align-middle">{subject.department}</TableCell>
                      <TableCell className="align-middle">{subject.semester}</TableCell>
                      <TableCell className="align-middle">{subject.courseType}</TableCell>
                      <TableCell className="align-middle">{`${subject.lectureHours} / ${subject.tutorialHours} / ${subject.labHours}`}</TableCell>
                      <TableCell className="text-right align-middle">{renderActions(subject)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAndSortedSubjects.length === 0 && (
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
          <BookCopy className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Subjects Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first subject.</p>
          <div className="mt-6"><AddSubject onSuccess={fetchSubjects} /></div>
        </div>
      )}

      <AlertDialog open={!!subjectToDelete} onOpenChange={(open) => { if (!open) setSubjectToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the <span className="font-semibold">{subjectToDelete?.name}</span> subject.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {subjectToEdit && <EditSubject subject={subjectToEdit} onSuccess={fetchSubjects} onClose={() => setSubjectToEdit(null)} />}
    </div>
  );
}