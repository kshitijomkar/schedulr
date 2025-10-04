'use client';

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import axios from 'axios';
import AuthContext from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { AddSection } from './AddSection';
import { EditSection } from './EditSection';
import { ImportDialog } from '@/components/ImportDialog';
import { ExportButton } from '@/components/ExportButton';
import { MoreHorizontal, UsersRound, Loader2, Search, ArrowUpDown, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Subject { _id: string; name: string; }
interface Section { _id: string; year: number; semester: number; department: string; sectionName: string; studentCount: number; numLabBatches: number; subjects: Subject[]; }

type SortKey = keyof Section | null;
type SortDirection = 'asc' | 'desc' | null;

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [sectionToEdit, setSectionToEdit] = useState<Section | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const authContext = useContext(AuthContext);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/sections`, {
        params: {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        }
      });
      const data = response.data;
      setSections(data.data);
      setTotalItems(data.total || 0);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch sections." });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, currentPage, itemsPerPage, toast]);

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchSections();
    }
  }, [authContext?.isAuthenticated, fetchSections]);

  const handleSort = (key: keyof Section) => {
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
    if (!sectionToDelete) return;
    try {
      await axios.delete(`${API_URL}/api/sections/${sectionToDelete._id}`);
      toast({ title: "Success", description: "Section has been deleted." });
      fetchSections();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete section." });
    } finally {
      setSectionToDelete(null);
    }
  };

  const renderActions = (section: Section) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setSectionToEdit(section)}>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onSelect={() => setSectionToDelete(section)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const filteredAndSortedSections = useMemo(() => {
    let filtered = [...sections];
    const lowerCaseSearch = searchTerm.toLowerCase();

    if (lowerCaseSearch) {
      filtered = filtered.filter(sec =>
        sec.department.toLowerCase().includes(lowerCaseSearch) ||
        sec.sectionName.toLowerCase().includes(lowerCaseSearch) ||
        sec.year.toString().includes(lowerCaseSearch) ||
        sec.subjects.some(sub => sub.name.toLowerCase().includes(lowerCaseSearch))
      );
    }

    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(sec => selectedDepartments.includes(sec.department));
    }

    if (selectedYears.length > 0) {
      filtered = filtered.filter(sec => selectedYears.includes(sec.year));
    }

    if (sortKey && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (Array.isArray(aValue) || Array.isArray(bValue)) return 0;

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [sections, searchTerm, selectedDepartments, selectedYears, sortKey, sortDirection]);

  const allSectionsForFilters = useMemo(() => sections, [sections]);
  const uniqueDepartments = useMemo(() => Array.from(new Set(allSectionsForFilters.map(s => s.department))), [allSectionsForFilters]);
  const uniqueYears = useMemo(() => Array.from(new Set(allSectionsForFilters.map(s => s.year))).sort((a, b) => a - b), [allSectionsForFilters]);

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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Sections</h1>
          <p className="text-muted-foreground mt-1">Manage all class sections and their assigned subjects.</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportDialog endpoint="/api/sections/import" onSuccess={fetchSections} />
          <ExportButton endpoint="/api/sections/export" fileName="sections.xlsx" />
          <AddSection onSuccess={fetchSections} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search sections..." className="w-full rounded-lg bg-background pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Year</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueYears.map(year => (
              <DropdownMenuCheckboxItem key={year} checked={selectedYears.includes(year)} onCheckedChange={(checked) => setSelectedYears(prev => checked ? [...prev, year] : prev.filter(y => y !== year))}>
                Year {year}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : sections.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('department')} className="p-0 h-auto">Department <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('year')} className="p-0 h-auto">Year <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('sectionName')} className="p-0 h-auto">Section <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('studentCount')} className="p-0 h-auto">Students <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => handleSort('numLabBatches')} className="p-0 h-auto">Lab Batches <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedSections.map((section) => (
                    <TableRow key={section._id}>
                      <TableCell className="font-medium align-middle">{section.department}</TableCell>
                      <TableCell className="align-middle">{section.year}</TableCell>
                      <TableCell className="align-middle">{section.sectionName}</TableCell>
                      <TableCell className="align-middle">{section.studentCount}</TableCell>
                      <TableCell className="align-middle">{section.numLabBatches}</TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {section.subjects.map(subject => (<Badge key={subject._id} variant="secondary">{subject.name}</Badge>))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-middle">{renderActions(section)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredAndSortedSections.length === 0 && (
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
          <UsersRound className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Sections Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Get started by defining your first class section.</p>
          <div className="mt-6"><AddSection onSuccess={fetchSections} /></div>
        </div>
      )}

      <AlertDialog open={!!sectionToDelete} onOpenChange={(open) => { if (!open) setSectionToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the section <span className="font-semibold">{sectionToDelete?.sectionName} ({sectionToDelete?.department})</span> and cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {sectionToEdit && <EditSection section={sectionToEdit} onSuccess={fetchSections} onClose={() => setSectionToEdit(null)} />}
    </div>
  );
}