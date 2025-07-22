'use client';

import { useState } from 'react';

interface ClientRefundTableProps {
  filters: any;
}

export default function ClientRefundTable({ filters }: ClientRefundTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const itemsPerPage = 10;

  // Mock data - in real implementation, this would be fetched based on filters
  const mockData = [
    {
      id: '1',
      clientName: 'Sarah Williams',
      lender: 'Halifax',
      refundAmount: 12750.50,
      paymentPlan: 'Lump Sum',
      dateCreated: '2024-01-15',
      status: 'Paid',
      matterRef: 'PPI-2024-001'
    },
    {
      id: '2',
      clientName: 'Michael Johnson',
      lender: 'Lloyds Banking Group',
      refundAmount: 8450.75,
      paymentPlan: 'Monthly (12)',
      dateCreated: '2024-01-12',
      status: 'In Progress',
      matterRef: 'PPI-2024-002'
    },
    {
      id: '3',
      clientName: 'Emma Thompson',
      lender: 'Barclays',
      refundAmount: 15320.00,
      paymentPlan: 'Lump Sum',
      dateCreated: '2024-01-10',
      status: 'Paid',
      matterRef: 'PPI-2024-003'
    },
    {
      id: '4',
      clientName: 'David Brown',
      lender: 'Santander',
      refundAmount: 6890.25,
      paymentPlan: 'Monthly (6)',
      dateCreated: '2024-01-08',
      status: 'Pending',
      matterRef: 'PPI-2024-004'
    },
    {
      id: '5',
      clientName: 'Lisa Anderson',
      lender: 'RBS/NatWest',
      refundAmount: 11200.00,
      paymentPlan: 'Quarterly (4)',
      dateCreated: '2024-01-05',
      status: 'Paid',
      matterRef: 'PPI-2024-005'
    },
    {
      id: '6',
      clientName: 'James Wilson',
      lender: 'HSBC',
      refundAmount: 9750.30,
      paymentPlan: 'Lump Sum',
      dateCreated: '2024-01-03',
      status: 'In Progress',
      matterRef: 'PPI-2024-006'
    },
    {
      id: '7',
      clientName: 'Mary Davis',
      lender: 'Halifax',
      refundAmount: 13500.80,
      paymentPlan: 'Monthly (18)',
      dateCreated: '2024-01-01',
      status: 'Paid',
      matterRef: 'PPI-2024-007'
    },
    {
      id: '8',
      clientName: 'Robert Taylor',
      lender: 'Lloyds Banking Group',
      refundAmount: 7825.40,
      paymentPlan: 'Lump Sum',
      dateCreated: '2023-12-28',
      status: 'Pending',
      matterRef: 'PPI-2023-158'
    },
    {
      id: '9',
      clientName: 'Jennifer Clark',
      lender: 'Barclays',
      refundAmount: 16750.95,
      paymentPlan: 'Monthly (24)',
      dateCreated: '2023-12-25',
      status: 'In Progress',
      matterRef: 'PPI-2023-157'
    },
    {
      id: '10',
      clientName: 'William Moore',
      lender: 'Santander',
      refundAmount: 5650.70,
      paymentPlan: 'Lump Sum',
      dateCreated: '2023-12-22',
      status: 'Paid',
      matterRef: 'PPI-2023-156'
    }
  ];

  // Filter and search data
  const filteredData = mockData.filter(item => {
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matterRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a];
    let bValue = b[sortField as keyof typeof b];
    
    if (sortField === 'refundAmount') {
      aValue = a.refundAmount;
      bValue = b.refundAmount;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      console.log('Exporting table data...');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Paid': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Table Header with Search and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
            <input
              type="text"
              placeholder="Search clients, lenders, or matter refs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {paginatedData.length} of {filteredData.length} results
          </div>
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm whitespace-nowrap cursor-pointer"
        >
          {isExporting ? (
            <>
              <i className="ri-loader-4-line w-4 h-4 inline mr-2 animate-spin"></i>
              Exporting...
            </>
          ) : (
            <>
              <i className="ri-download-line w-4 h-4 inline mr-2"></i>
              Export Table
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('clientName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Client Name</span>
                    {sortField === 'clientName' && (
                      <i className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line w-4 h-4`}></i>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lender')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Lender</span>
                    {sortField === 'lender' && (
                      <i className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line w-4 h-4`}></i>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('refundAmount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Refund Amount</span>
                    {sortField === 'refundAmount' && (
                      <i className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line w-4 h-4`}></i>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Plan
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dateCreated')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date Created</span>
                    {sortField === 'dateCreated' && (
                      <i className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line w-4 h-4`}></i>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matter Ref
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.lender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      £{item.refundAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.paymentPlan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(item.dateCreated).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {item.matterRef}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}