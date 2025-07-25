
'use client';

import { useState } from 'react';

interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  matterId: string;
  matterRef: string;
  details: string;
  beforeValue?: string;
  afterValue?: string;
  actionType: 'create' | 'edit' | 'delete' | 'send' | 'complete' | 'assign';
  ipAddress: string;
}

export default function AuditDashboard() {
  const [filters, setFilters] = useState({
    dateRange: { start: '2024-01-01', end: '2024-12-31' },
    user: 'all',
    action: 'all',
    matter: 'all'
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const mockAuditData: AuditEntry[] = [
    {
      id: '1',
      action: 'Matter Created',
      performedBy: 'John Smith',
      timestamp: '2024-01-15T09:00:00Z',
      matterId: '1',
      matterRef: 'PPI-2024-001',
      details: 'Created new PPI matter for Sarah Williams',
      actionType: 'create',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      action: 'Risk Assessment Completed',
      performedBy: 'John Smith',
      timestamp: '2024-01-15T14:30:00Z',
      matterId: '1',
      matterRef: 'PPI-2024-001',
      details: 'Completed risk assessment with all checks passed',
      actionType: 'complete',
      ipAddress: '192.168.1.100'
    },
    {
      id: '3',
      action: 'Client Care Pack Sent',
      performedBy: 'Sarah Johnson',
      timestamp: '2024-01-17T09:15:00Z',
      matterId: '1',
      matterRef: 'PPI-2024-001',
      details: 'Sent client care pack to sarah.williams@email.com',
      actionType: 'send',
      ipAddress: '192.168.1.105'
    },
    {
      id: '4',
      action: 'Matter Status Updated',
      performedBy: 'John Smith',
      timestamp: '2024-01-18T14:00:00Z',
      matterId: '1',
      matterRef: 'PPI-2024-001',
      details: 'Updated matter status',
      beforeValue: 'Draft',
      afterValue: 'Active',
      actionType: 'edit',
      ipAddress: '192.168.1.100'
    },
    {
      id: '5',
      action: 'Template Generated',
      performedBy: 'Michael Brown',
      timestamp: '2024-01-19T08:45:00Z',
      matterId: '1',
      matterRef: 'PPI-2024-001',
      details: 'Generated complaint letter template for Barclays',
      actionType: 'create',
      ipAddress: '192.168.1.110'
    },
    {
      id: '6',
      action: 'User Login',
      performedBy: 'Emma Davis',
      timestamp: '2024-01-20T08:00:00Z',
      matterId: '',
      matterRef: '',
      details: 'User logged into system',
      actionType: 'create',
      ipAddress: '192.168.1.115'
    },
    {
      id: '7',
      action: 'Workflow Template Created',
      performedBy: 'John Smith',
      timestamp: '2024-01-21T10:30:00Z',
      matterId: '',
      matterRef: '',
      details: 'Created new workflow template for PPI claims',
      actionType: 'create',
      ipAddress: '192.168.1.100'
    },
    {
      id: '8',
      action: 'Client Details Updated',
      performedBy: 'Sarah Johnson',
      timestamp: '2024-01-22T11:15:00Z',
      matterId: '2',
      matterRef: 'PPI-2024-002',
      details: 'Updated client phone number',
      beforeValue: '07712345678',
      afterValue: '07798765432',
      actionType: 'edit',
      ipAddress: '192.168.1.105'
    },
    {
      id: '9',
      action: 'Task Assigned',
      performedBy: 'John Smith',
      timestamp: '2024-01-23T09:30:00Z',
      matterId: '3',
      matterRef: 'PPI-2024-003',
      details: 'Assigned document review task to Emma Davis',
      actionType: 'assign',
      ipAddress: '192.168.1.100'
    },
    {
      id: '10',
      action: 'Report Generated',
      performedBy: 'Michael Brown',
      timestamp: '2024-01-24T16:00:00Z',
      matterId: '',
      matterRef: '',
      details: 'Generated monthly refunds report',
      actionType: 'create',
      ipAddress: '192.168.1.110'
    }
  ];

  const users = [
    { value: 'all', label: 'All Users' },
    { value: 'John Smith', label: 'John Smith' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Michael Brown', label: 'Michael Brown' },
    { value: 'Emma Davis', label: 'Emma Davis' }
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

  const matters = [
    { value: 'all', label: 'All Matters' },
    { value: 'PPI-2024-001', label: 'PPI-2024-001' },
    { value: 'PPI-2024-002', label: 'PPI-2024-002' },
    { value: 'PPI-2024-003', label: 'PPI-2024-003' }
  ];

  const filteredData = mockAuditData.filter(entry => {
    const matchesUser = filters.user === 'all' || entry.performedBy === filters.user;
    const matchesAction = filters.action === 'all' || entry.actionType === filters.action;
    const matchesMatter = filters.matter === 'all' || entry.matterRef === filters.matter;
    const matchesSearch = searchTerm === '' || 
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());

    const entryDate = new Date(entry.timestamp);
    const startDate = new Date(filters.dateRange.start);
    const endDate = new Date(filters.dateRange.end);
    const matchesDate = entryDate >= startDate && entryDate <= endDate;

    return matchesUser && matchesAction && matchesMatter && matchesSearch && matchesDate;
  });

  const userActivityData = users.slice(1).map(user => {
    const userEntries = mockAuditData.filter(entry => entry.performedBy === user.value);
    const activityCount = userEntries.length;
    const lastActivity = userEntries.length > 0 ? userEntries[0].timestamp : null;

    return {
      user: user.label,
      totalActions: activityCount,
      lastActivity: lastActivity,
      actions: {
        create: userEntries.filter(e => e.actionType === 'create').length,
        edit: userEntries.filter(e => e.actionType === 'edit').length,
        send: userEntries.filter(e => e.actionType === 'send').length,
        complete: userEntries.filter(e => e.actionType === 'complete').length,
        assign: userEntries.filter(e => e.actionType === 'assign').length
      }
    };
  });

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'startDate') {
      setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: value } }));
    } else if (field === 'endDate') {
      setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: value } }));
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  const exportToCsv = async () => {
    setIsExporting(true);

    const csvData = filteredData.map(entry => ({
      Action: entry.action,
      'Performed By': entry.performedBy,
      'Date': new Date(entry.timestamp).toLocaleDateString('en-GB'),
      'Time': new Date(entry.timestamp).toLocaleTimeString('en-GB'),
      'Matter Reference': entry.matterRef || 'N/A',
      Details: entry.details,
      'Before Value': entry.beforeValue || '',
      'After Value': entry.afterValue || '',
      'IP Address': entry.ipAddress
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    setTimeout(() => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1000);
  };

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

  return (
   <div className="space-y-6 px-2 sm:px-4 md:px-8 py-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{mockAuditData.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-history-line w-5 h-5 sm:w-6 sm:h-6 text-blue-600"></i>
            </div>
          </div>
        </div>
        {/* 2. Active Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length - 1}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line w-5 h-5 sm:w-6 sm:h-6 text-green-600"></i>
            </div>
          </div>
        </div>
        {/* 3. Today's Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Actions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {mockAuditData.filter(entry => 
                  new Date(entry.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line w-5 h-5 sm:w-6 sm:h-6 text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={exportToCsv}
            disabled={isExporting}
            className="text-white px-3 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
            style={{ backgroundColor: '#334960' }}
          >
            {isExporting ? (
              <>
                <i className="ri-loader-4-line w-4 h-4 inline mr-2 animate-spin"></i>
                Exporting...
              </>
            ) : (
              <>
                <i className="ri-download-line w-4 h-4 inline mr-2"></i>
                Export to CSV
              </>
            )}
          </button>
        </div>
        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* The five filter boxes, same as your code (for DATE, USER, ACTION, MATTER, SEARCH) */}
          {/* ...first 2 columns... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
            >
              {users.map(user => (
                <option key={user.value} value={user.value}>{user.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
            >
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
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
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:border-transparent"
              />
              <i className="ri-search-line w-4 h-4 absolute left-3 top-2.5 text-gray-400 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex min-w-max sm:space-x-8 space-x-4 px-2 sm:px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-list-line w-4 h-4 inline mr-2"></i>
              All Activity
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'users'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-user-line w-4 h-4 inline mr-2"></i>
              Per-User Activity
            </button>
          </nav>
        </div>

        <div className="p-2 sm:p-6">
          {activeTab === 'all' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 text-xs sm:text-sm">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Matter</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((entry) => {
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
                            <p className="text-xs sm:text-sm text-gray-500">{dateTime.time}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {entry.matterRef ? (
                            <span className="text-blue-600 font-medium">{entry.matterRef}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900">{entry.details}</p>
                          <p className="text-xs text-gray-500 mt-1">IP: {entry.ipAddress}</p>
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

              {filteredData.length === 0 && (
                <div className="text-center py-8">
                  <i className="ri-history-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
                  <p className="text-gray-500">No activity found matching your filters</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userActivityData.map((userData) => (
                <div key={userData.user} className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f46524' }}>
                      <span className="text-white font-semibold">
                        {userData.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{userData.user}</h4>
                      <p className="text-sm text-gray-500">
                        {userData.totalActions} total actions
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{userData.actions.create}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Edited:</span>
                      <span className="font-medium">{userData.actions.edit}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Sent:</span>
                      <span className="font-medium">{userData.actions.send}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">{userData.actions.complete}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Assigned:</span>
                      <span className="font-medium">{userData.actions.assign}</span>
                    </div>
                  </div>
                  {userData.lastActivity && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500">
                        Last activity: {formatDateTime(userData.lastActivity).date} at {formatDateTime(userData.lastActivity).time}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 rounded-lg p-2 sm:p-4">
        <p className="text-xs sm:text-sm text-blue-700">
          {activeTab === 'all' 
            ? `Showing ${filteredData.length} of ${mockAuditData.length} audit entries`
            : `Showing activity for ${userActivityData.length} users`
          }
        </p>
      </div>
    </div>
  );
}
