
'use client';

import { useState } from 'react';

interface ActivityLogEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  beforeValue?: string;
  afterValue?: string;
  actionType: 'create' | 'edit' | 'delete' | 'send' | 'complete' | 'assign';
}

interface ActivityLogProps {
  matterId: string;
}

export default function ActivityLog({ matterId }: ActivityLogProps) {
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockActivityLog: ActivityLogEntry[] = [
    {
      id: '1',
      action: 'Risk Assessment Completed',
      performedBy: 'John Smith',
      timestamp: '2024-01-15T14:30:00Z',
      details: 'Risk assessment completed with all checks passed',
      actionType: 'complete'
    },
    {
      id: '2',
      action: 'Client Details Updated',
      performedBy: 'Sarah Johnson',
      timestamp: '2024-01-15T16:45:00Z',
      details: 'Updated client phone number',
      beforeValue: '07712345678',
      afterValue: '07798765432',
      actionType: 'edit'
    },
    {
      id: '3',
      action: 'Client Care Pack Sent',
      performedBy: 'Sarah Johnson',
      timestamp: '2024-01-17T09:15:00Z',
      details: 'Client care pack sent via email to sarah.williams@email.com',
      actionType: 'send'
    },
    {
      id: '4',
      action: 'Task Assigned',
      performedBy: 'John Smith',
      timestamp: '2024-01-17T10:30:00Z',
      details: 'Assigned complaint letter preparation to Michael Brown',
      actionType: 'assign'
    },
    {
      id: '5',
      action: 'Lender Information Added',
      performedBy: 'Michael Brown',
      timestamp: '2024-01-18T11:20:00Z',
      details: 'Added HSBC UK Bank PLC as lender',
      actionType: 'create'
    },
    {
      id: '6',
      action: 'Matter Status Changed',
      performedBy: 'John Smith',
      timestamp: '2024-01-18T14:00:00Z',
      details: 'Matter status updated',
      beforeValue: 'Draft',
      afterValue: 'Active',
      actionType: 'edit'
    },
    {
      id: '7',
      action: 'Template Generated',
      performedBy: 'Michael Brown',
      timestamp: '2024-01-19T08:45:00Z',
      details: 'Generated Barclays complaint letter template',
      actionType: 'create'
    },
    {
      id: '8',
      action: 'Workflow Step Updated',
      performedBy: 'Michael Brown',
      timestamp: '2024-01-20T13:15:00Z',
      details: 'Updated workflow step status to In Progress',
      beforeValue: 'Pending',
      afterValue: 'In Progress',
      actionType: 'edit'
    },
    {
      id: '9',
      action: 'Document Uploaded',
      performedBy: 'Sarah Johnson',
      timestamp: '2024-01-21T10:00:00Z',
      details: 'Uploaded signed client care pack document',
      actionType: 'create'
    },
    {
      id: '10',
      action: 'Note Added',
      performedBy: 'Emma Davis',
      timestamp: '2024-01-22T15:30:00Z',
      details: 'Added note regarding client communication preferences',
      actionType: 'create'
    }
  ];

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'create', label: 'Created' },
    { value: 'edit', label: 'Edited' },
    { value: 'delete', label: 'Deleted' },
    { value: 'send', label: 'Sent' },
    { value: 'complete', label: 'Completed' },
    { value: 'assign', label: 'Assigned' }
  ];

  const users = [
    { value: 'all', label: 'All Users' },
    { value: 'John Smith', label: 'John Smith' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Michael Brown', label: 'Michael Brown' },
    { value: 'Emma Davis', label: 'Emma Davis' }
  ];

  const filteredLog = mockActivityLog.filter(entry => {
    const matchesType = filterType === 'all' || entry.actionType === filterType;
    const matchesUser = filterUser === 'all' || entry.performedBy === filterUser;
    const matchesSearch = searchTerm === '' || 
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesUser && matchesSearch;
  });

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-GB'),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create': return 'ri-add-line';
      case 'edit': return 'ri-edit-line';
      case 'delete': return 'ri-delete-bin-line';
      case 'send': return 'ri-mail-send-line';
      case 'complete': return 'ri-check-line';
      case 'assign': return 'ri-user-add-line';
      default: return 'ri-information-line';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'edit': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'send': return 'bg-purple-100 text-purple-700';
      case 'complete': return 'bg-emerald-100 text-emerald-700';
      case 'assign': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exportToCsv = () => {
    const csvData = filteredLog.map(entry => ({
      Action: entry.action,
      'Performed By': entry.performedBy,
      'Date': formatDateTime(entry.timestamp).date,
      'Time': formatDateTime(entry.timestamp).time,
      Details: entry.details,
      'Before Value': entry.beforeValue || '',
      'After Value': entry.afterValue || ''
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matter-${matterId}-activity-log.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
        <button 
          onClick={exportToCsv}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
        >
          <i className="ri-download-line w-4 h-4 inline mr-2"></i>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by User</label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {users.map(user => (
                <option key={user.value} value={user.value}>{user.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search actions..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <i className="ri-search-line w-4 h-4 absolute left-3 top-2.5 text-gray-400 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performed By</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLog.map((entry) => {
                const dateTime = formatDateTime(entry.timestamp);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(entry.actionType)}`}>
                          <i className={`${getActionIcon(entry.actionType)} w-4 h-4 flex items-center justify-center`}></i>
                        </div>
                        <span className="font-medium text-gray-900">{entry.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-900 font-medium text-sm">
                            {entry.performedBy.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-gray-900">{entry.performedBy}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-900 font-medium">{dateTime.date}</p>
                        <p className="text-sm text-gray-500">{dateTime.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{entry.details}</p>
                    </td>
                    <td className="py-4 px-4">
                      {entry.beforeValue && entry.afterValue ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Before:</span>
                            <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                              {entry.beforeValue}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">After:</span>
                            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                              {entry.afterValue}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLog.length === 0 && (
          <div className="text-center py-8">
            <i className="ri-history-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
            <p className="text-gray-500">No activity found matching your filters</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Showing {filteredLog.length} of {mockActivityLog.length} activity entries
        </p>
      </div>
    </div>
  );
}
