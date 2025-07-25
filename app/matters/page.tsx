'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Link from 'next/link';

export default function Matters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const matters = [
    {
      id: '1',
      fileRef: 'PPI-2024-001',
      client: 'Sarah Williams',
      type: 'PPI Claims',
      status: 'Active',
      dateOpened: '2024-01-15',
      lastActivity: '2024-01-20',
      totalRefunds: '£4,500.00',
      lenderCount: 3
    },
    {
      id: '2',
      fileRef: 'PPI-2024-002',
      client: 'Michael Johnson',
      type: 'PPI Claims',
      status: 'Pending Review',
      dateOpened: '2024-01-14',
      lastActivity: '2024-01-19',
      totalRefunds: '£2,100.00',
      lenderCount: 2
    },
    {
      id: '3',
      fileRef: 'PACK-2024-001',
      client: 'Emma Thompson',
      type: 'Packaged Bank Accounts',
      status: 'Completed',
      dateOpened: '2024-01-10',
      lastActivity: '2024-01-18',
      totalRefunds: '£1,800.00',
      lenderCount: 1
    },
    {
      id: '4',
      fileRef: 'PPI-2024-003',
      client: 'David Brown',
      type: 'PPI Claims',
      status: 'On Hold',
      dateOpened: '2024-01-12',
      lastActivity: '2024-01-17',
      totalRefunds: '£3,200.00',
      lenderCount: 4
    }
  ];

  const filteredMatters = matters.filter(matter => {
    const matchesSearch = !searchQuery ||
      matter.fileRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || matter.status === statusFilter;
    const matchesType = typeFilter === 'all' || matter.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-36">
      <Header />
      <div className="px-2 sm:px-4 md:px-6 py-5 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">All Matters</h1>
              <p className="text-gray-600 text-sm md:text-base">Manage and track all legal matters</p>
            </div>
            <Link
              href="/matters/new"
              className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 text-white rounded-lg hover:opacity-90 whitespace-nowrap cursor-pointer"
              style={{ backgroundColor: '#334960' }}
            >
              <i className="ri-add-line w-4 h-4"></i>
              <span>New Matter</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-5 md:mb-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search matters by file ref or client name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 text-sm"
                  />
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 text-sm pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 text-sm pr-8"
                >
                  <option value="all">All Types</option>
                  <option value="PPI Claims">PPI Claims</option>
                  <option value="Packaged Bank Accounts">Packaged Bank Accounts</option>
                  <option value="Mortgage Mis-selling">Mortgage Mis-selling</option>
                  <option value="Credit Card Claims">Credit Card Claims</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table, responsive for mobile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full min-w-[700px] hidden sm:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">File Reference</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Client</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Date Opened</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Total Refunds</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Lenders</th>
                  <th className="text-left py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatters.map((matter) => (
                  <tr key={matter.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <Link
                        href={`/matters/${matter.id}`}
                        className="font-medium cursor-pointer hover:opacity-80"
                        style={{ color: '#334960' }}
                      >
                        {matter.fileRef}
                      </Link>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 font-medium">{matter.client}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-gray-600">{matter.type}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(matter.status)}`}>
                        {matter.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-gray-600">{matter.dateOpened}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6 font-medium text-green-700">{matter.totalRefunds}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {matter.lenderCount} lenders
                      </span>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/matters/${matter.id}`}
                          className="hover:opacity-80 cursor-pointer"
                          style={{ color: '#334960' }}
                        >
                          <i className="ri-eye-line w-4 h-4"></i>
                        </Link>
                        <Link
                          href={`/matters/${matter.id}/edit`}
                          className="text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                          <i className="ri-edit-line w-4 h-4"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile: Cards/List */}
            <div className="sm:hidden ">
              {filteredMatters.map((matter) => (
                <div
                  key={matter.id}
                  className="border-b border-gray-200 px-2 py-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Link
                      href={`/matters/${matter.id}`}
                      className="font-medium text-base"
                      style={{ color: '#334960' }}
                    >
                      {matter.fileRef}
                    </Link>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(matter.status)}`}
                    >
                      {matter.status}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">{matter.client}</div>
                  <div className="flex flex-wrap items-center mt-1 gap-2">
                    <span className="text-gray-600 text-xs">{matter.type}</span>
                    <span className="text-gray-500 text-xs">Opened: {matter.dateOpened}</span>
                  </div>
                  <div className="flex mt-2 gap-2 flex-wrap">
                    <span className="text-green-700 font-semibold text-sm">{matter.totalRefunds}</span>
                    <span className="bg-gray-100 text-gray-700 rounded-full text-xs px-2 py-0.5">
                      {matter.lenderCount} lenders
                    </span>
                    <Link
                      href={`/matters/${matter.id}`}
                      className="hover:opacity-80 cursor-pointer text-base"
                      style={{ color: '#334960' }}
                      aria-label="View"
                    >
                      <i className="ri-eye-line w-4 h-4"></i>
                    </Link>
                    <Link
                      href={`/matters/${matter.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 cursor-pointer text-base"
                      aria-label="Edit"
                    >
                      <i className="ri-edit-line w-4 h-4"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredMatters.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-folder-open-line w-12 h-12 text-gray-400 mx-auto mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matters found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first matter'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                <Link
                  href="/matters/new"
                  className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#334960' }}
                >
                  <i className="ri-add-line w-4 h-4"></i>
                  <span>Create First Matter</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
