
'use client';

import { useState } from 'react';

interface Filters {
  dateRange: { start: string; end: string };
  lender: string;
  status: string;
  user: string;
  clientTag: string;
}

interface ReportsFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function ReportsFilters({ filters, onFiltersChange }: ReportsFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const clientTags = [
    'Vulnerable',
    'Repeat',
    'High Value',
    'Priority',
    'VIP',
    'Elderly',
    'Disability',
    'Mental Health',
    'Financial Hardship',
    'Complex Case',
    'Referred',
    'New Client'
  ];

  const lenders = [
    'Barclays Bank PLC',
    'HSBC UK Bank PLC',
    'Lloyds Banking Group',
    'Santander UK PLC',
    'NatWest Group',
    'TSB Bank PLC',
    'Nationwide Building Society',
    'Virgin Money UK PLC'
  ];

  const users = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emma Davis',
    'David Wilson',
    'Lisa Anderson'
  ];

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    handleFilterChange('dateRange', {
      ...filters.dateRange,
      [type]: value
    });
  };

  const quickDateRanges = [
    { label: 'Last 7 days', start: '2024-01-16', end: '2024-01-23' },
    { label: 'Last 30 days', start: '2024-01-01', end: '2024-01-31' },
    { label: 'Last 3 months', start: '2023-11-01', end: '2024-01-31' },
    { label: 'Last 6 months', start: '2023-08-01', end: '2024-01-31' },
    { label: 'This year', start: '2024-01-01', end: '2024-12-31' }
  ];

  const resetFilters = () => {
    onFiltersChange({
      dateRange: { start: '2024-01-01', end: '2024-12-31' },
      lender: 'all',
      status: 'all',
      user: 'all',
      clientTag: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.lender !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.user !== 'all') count++;
    if (filters.clientTag !== 'all') count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
        <div className="flex items-center space-x-3">
          {getActiveFiltersCount() > 0 && (
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lender</label>
          <select
            value={filters.lender}
            onChange={(e) => handleFilterChange('lender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
          >
            <option value="all">All Lenders</option>
            {lenders.map(lender => (
              <option key={lender} value={lender}>{lender}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Signed">Signed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client Tag</label>
          <select
            value={filters.clientTag}
            onChange={(e) => handleFilterChange('clientTag', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
          >
            <option value="all">All Client Tags</option>
            {clientTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Date Range Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Date Ranges</label>
        <div className="flex flex-wrap gap-2">
          {quickDateRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleFilterChange('dateRange', { start: range.start, end: range.end })}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned User</label>
              <select
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include archived matters</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Only show high-value cases</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
