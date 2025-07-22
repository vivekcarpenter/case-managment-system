
'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import ReportsFilters from './ReportsFilters';
import ReportWidgets from './ReportWidgets';
import ReportsSummary from './ReportsSummary';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    lender: 'all',
    status: 'all',
    user: 'all',
    clientTag: 'all'
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false);
      // In real implementation, trigger CSV download
      console.log('Exporting reports with filters:', filters);
    }, 2000);
  };

  const handleSaveReport = () => {
    console.log('Saving report view with filters:', filters);
    // In real implementation, save to user preferences
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Reports Dashboard
                </h1>
                <p className="text-gray-600">
                  View analytical reports on clients, lenders, refunds, and case outcomes
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveReport}
                  className="px-4 py-2 text-blue-900 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-save-line w-4 h-4 inline mr-2"></i>
                  Save Report View
                </button>
                <button
                  onClick={handleExportAll}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isExporting ? (
                    <>
                      <i className="ri-loader-4-line w-4 h-4 inline mr-2 animate-spin"></i>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="ri-download-line w-4 h-4 inline mr-2"></i>
                      Export All to CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <ReportsFilters filters={filters} onFiltersChange={handleFiltersChange} />
          
          <ReportsSummary filters={filters} />
          
          <ReportWidgets filters={filters} />
        </div>
      </div>
    </div>
  );
}
