
'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import ClientDetailsDrawer from '../../components/ClientDetailsDrawer';
import Link from 'next/link';

interface Client {
  id: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  matterReferences: string[];
  lenderCount: number;
  status: 'Draft' | 'In Progress' | 'Signed' | 'Completed';
  lastUpdated: string;
  riskAssessmentComplete: boolean;
  tags: string[];
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [showTagManager, setShowTagManager] = useState(false);
  const itemsPerPage = 10;

  const [availableTags, setAvailableTags] = useState([
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
  ]);

  const mockClients: Client[] = [
    {
      id: '1',
      fullName: 'Sarah Williams',
      dateOfBirth: '1985-03-15',
      email: 'sarah.williams@email.com',
      phone: '07123 456 789',
      address: '123 High Street, London, SW1A 1AA',
      matterReferences: ['PPI-2024-001'],
      lenderCount: 3,
      status: 'In Progress',
      lastUpdated: '2024-01-15T10:30:00Z',
      riskAssessmentComplete: true,
      tags: ['High Value', 'VIP']
    },
    {
      id: '2',
      fullName: 'Michael Johnson',
      dateOfBirth: '1978-07-22',
      email: 'michael.j@email.com',
      phone: '07987 654 321',
      address: '456 Oak Avenue, Manchester, M1 2AB',
      matterReferences: ['PPI-2024-002'],
      lenderCount: 5,
      status: 'Draft',
      lastUpdated: '2024-01-14T14:45:00Z',
      riskAssessmentComplete: false,
      tags: ['Vulnerable', 'Elderly']
    },
    {
      id: '3',
      fullName: 'Emma Thompson',
      dateOfBirth: '1990-11-08',
      email: 'emma.thompson@email.com',
      phone: '07555 123 456',
      address: '789 Church Lane, Birmingham, B1 3CD',
      matterReferences: ['PPI-2024-003'],
      lenderCount: 2,
      status: 'Signed',
      lastUpdated: '2024-01-13T09:15:00Z',
      riskAssessmentComplete: true,
      tags: ['Repeat', 'Priority']
    },
    {
      id: '4',
      fullName: 'James Wilson',
      dateOfBirth: '1982-05-30',
      email: 'james.wilson@email.com',
      phone: '07444 987 654',
      address: '321 Park Road, Liverpool, L1 4EF',
      matterReferences: ['PPI-2024-004', 'PPI-2024-015'],
      lenderCount: 7,
      status: 'Completed',
      lastUpdated: '2024-01-12T16:20:00Z',
      riskAssessmentComplete: true,
      tags: ['Complex Case', 'High Value']
    },
    {
      id: '5',
      fullName: 'Lisa Anderson',
      dateOfBirth: '1987-09-12',
      email: 'lisa.anderson@email.com',
      phone: '07333 456 789',
      address: '654 Queen Street, Edinburgh, EH1 5GH',
      matterReferences: ['PPI-2024-005'],
      lenderCount: 4,
      status: 'In Progress',
      lastUpdated: '2024-01-11T11:30:00Z',
      riskAssessmentComplete: true,
      tags: ['New Client', 'Referred']
    }
  ];

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = searchQuery === '' || 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.matterReferences.some(ref => ref.toLowerCase().includes(searchQuery.toLowerCase())) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesTag = tagFilter === 'all' || client.tags.includes(tagFilter);

    return matchesSearch && matchesStatus && matchesTag;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB');
  };

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Signed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Vulnerable':
        return 'bg-red-100 text-red-800';
      case 'High Value':
        return 'bg-green-100 text-green-800';
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Priority':
        return 'bg-orange-100 text-orange-800';
      case 'Elderly':
        return 'bg-yellow-100 text-yellow-800';
      case 'Repeat':
        return 'bg-blue-100 text-blue-800';
      case 'Complex Case':
        return 'bg-pink-100 text-pink-800';
      case 'New Client':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagStats = () => {
    const stats: { [key: string]: number } = {};
    mockClients.forEach(client => {
      client.tags.forEach(tag => {
        stats[tag] = (stats[tag] || 0) + 1;
      });
    });
    return stats;
  };

  const tagStats = getTagStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
                <p className="text-gray-600">View and manage client records across all matters</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowTagManager(!showTagManager)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-price-tag-3-line w-4 h-4 flex items-center justify-center"></i>
                  <span>Manage Tags</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                  <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                  <span>Import CSV</span>
                </button>
                <Link 
                  href="/clients/new"
                  className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: '#334960' }}
                >
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                  <span>Add New Client</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Tag Manager Panel */}
          {showTagManager && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tag Management</h3>
                <button
                  onClick={() => setShowTagManager(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <span
                        key={tag}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
                      >
                        {tag}
                        <span className="ml-2 text-xs bg-white bg-opacity-50 px-1 rounded-full">
                          {tagStats[tag] || 0}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Add New Tag</h4>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter new tag name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ '&:focus': { borderColor: '#f46524', boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' } }}
                    />
                    <button className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors cursor-pointer" style={{ backgroundColor: '#334960' }}>
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, file reference, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  style={{ '&:focus': { borderColor: '#f46524', boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' } }}
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm pr-8"
                  style={{ '&:focus': { borderColor: '#f46524', boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' } }}
                >
                  <option value="all">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Signed">Signed</option>
                  <option value="Completed">Completed</option>
                </select>
                
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm pr-8"
                  style={{ '&:focus': { borderColor: '#f46524', boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' } }}
                >
                  <option value="all">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm pr-8"
                  style={{ '&:focus': { borderColor: '#f46524', boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' } }}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {paginatedClients.length} of {filteredClients.length} clients
              {tagFilter !== 'all' && ` tagged with "${tagFilter}"`}
            </p>
          </div>

          {/* Client Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Client Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Tags</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Date of Birth</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Matter References</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Lenders</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Last Updated</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedClients.map((client) => (
                    <tr 
                      key={client.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleClientClick(client)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f46524' }}>
                            <span className="text-white font-medium text-sm">
                              {client.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{client.fullName}</p>
                            <div className="flex items-center space-x-1">
                              {client.riskAssessmentComplete ? (
                                <i className="ri-check-line w-3 h-3 text-green-600 flex items-center justify-center"></i>
                              ) : (
                                <i className="ri-close-line w-3 h-3 text-red-600 flex items-center justify-center"></i>
                              )}
                              <span className="text-xs text-gray-500">Risk Assessment</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {client.tags.map(tag => (
                            <span
                              key={tag}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                          {client.tags.length === 0 && (
                            <span className="text-xs text-gray-400">No tags</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">{formatDate(client.dateOfBirth)}</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-gray-900">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {client.matterReferences.map((ref) => (
                            <Link
                              key={ref}
                              href={`/matters/${ref.split('-').pop()}`}
                              className="inline-block px-2 py-1 text-xs rounded-full hover:opacity-80 cursor-pointer"
                              style={{ backgroundColor: '#334960', color: 'white' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {ref}
                            </Link>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          <i className="ri-building-line w-3 h-3 mr-1 flex items-center justify-center"></i>
                          {client.lenderCount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {formatDateTime(client.lastUpdated)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="hover:opacity-80 p-1 cursor-pointer"
                            style={{ color: '#334960' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClientClick(client);
                            }}
                          >
                            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <Link 
                            href={`/clients/${client.id}/edit`}
                            className="text-gray-600 hover:text-gray-800 p-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this client?')) {
                                console.log('Delete client:', client.id);
                              }
                            }}
                          >
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredClients.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <i className="ri-user-search-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or add a new client.</p>
              <Link 
                href="/clients/new"
                className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#334960' }}
              >
                <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                <span>Add New Client</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <ClientDetailsDrawer
        client={selectedClient}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
