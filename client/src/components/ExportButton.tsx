// client/src/components/ExportButton.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  endpoint: string;
  fileName: string;
}

export function ExportButton({ endpoint, fileName }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleExport = async () => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Preparing your ${fileName} data.` });
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      toast({ title: "Success", description: "Data exported successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to export data." });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
      Export
    </Button>
  );
}