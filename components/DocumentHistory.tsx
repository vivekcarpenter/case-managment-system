'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DocumentHistoryItem {
  id: string;
  name: string;
  type: 'Letter' | 'Email' | 'PDF' | 'SMS' | 'Template' | 'Report';
  templateUsed?: {
    id: string;
    name: string;
  };
  createdBy: string;
  createdDate: string;
  deliveryMethod: 'Email' | 'E-sign' | 'SMS' | 'Manual' | 'Download' | 'Portal';
  status: 'Draft' | 'Sent' | 'Delivered' | 'Opened' | 'Signed' | 'Failed';
  recipient?: string;
  fileSize?: string;
  previewUrl?: string;
  downloadUrl?: string;
  metadata?: {
    subject?: string;
    lenderName?: string;
    amount?: string;
    signedDate?: string;
  };
}

interface DocumentHistoryProps {
  matterId: string;
}

export default function DocumentHistory({ matterId }: DocumentHistoryProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDocument, setSelectedDocument] = useState<DocumentHistoryItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const mockDocuments: DocumentHistoryItem[] = [
    {
      id: '1',
      name: 'Client Care Pack Letter',
      type: 'Letter',
      templateUsed: {
        id: 'template-1',
        name: 'Standard Client Care Pack'
      },
      createdBy: 'Sarah Johnson',
      createdDate: '2024-01-15T10:30:00Z',
      deliveryMethod: 'Email',
      status: 'Delivered',
      recipient: 'sarah.williams@email.com',
      fileSize: '245 KB',
      previewUrl: '/preview/doc-1',
      downloadUrl: '/download/doc-1',
      metadata: {
        subject: 'Your Legal Matter - Client Care Pack'
      }
    },
    {
      id: '2',
      name: 'Barclays Complaint Letter',
      type: 'Letter',
      templateUsed: {
        id: 'template-2',
        name: 'Barclays PPI Complaint Template'
      },
      createdBy: 'Michael Brown',
      createdDate: '2024-01-18T14:15:00Z',
      deliveryMethod: 'E-sign',
      status: 'Signed',
      recipient: 'complaints@barclays.co.uk',
      fileSize: '1.2 MB',
      previewUrl: '/preview/doc-2',
      downloadUrl: '/download/doc-2',
      metadata: {
        subject: 'PPI Complaint - Account 12345678',
        lenderName: 'Barclays Bank PLC',
        amount: '£2,100.00',
        signedDate: '2024-01-19T09:20:00Z'
      }
    },
    {
      id: '3',
      name: 'HSBC Complaint Letter',
      type: 'Letter',
      templateUsed: {
        id: 'template-3',
        name: 'HSBC PPI Complaint Template'
      },
      createdBy: 'Michael Brown',
      createdDate: '2024-01-20T11:45:00Z',
      deliveryMethod: 'Email',
      status: 'Sent',
      recipient: 'ppi.complaints@hsbc.co.uk',
      fileSize: '1.1 MB',
      previewUrl: '/preview/doc-3',
      downloadUrl: '/download/doc-3',
      metadata: {
        subject: 'PPI Complaint - Account 87654321',
        lenderName: 'HSBC UK Bank PLC',
        amount: '£1,200.00'
      }
    },
    {
      id: '4',
      name: 'Appointment Reminder',
      type: 'SMS',
      templateUsed: {
        id: 'template-4',
        name: 'Appointment Reminder SMS'
      },
      createdBy: 'Emma Davis',
      createdDate: '2024-01-22T16:30:00Z',
      deliveryMethod: 'SMS',
      status: 'Delivered',
      recipient: '07123456789',
      fileSize: '0.1 KB',
      metadata: {
        subject: 'Appointment reminder for tomorrow at 2:00 PM'
      }
    },
    {
      id: '5',
      name: 'Case Progress Report',
      type: 'Report',
      createdBy: 'John Smith',
      createdDate: '2024-01-23T13:00:00Z',
      deliveryMethod: 'Email',
      status: 'Delivered',
      recipient: 'sarah.williams@email.com',
      fileSize: '890 KB',
      previewUrl: '/preview/doc-5',
      downloadUrl: '/download/doc-5',
      metadata: {
        subject: 'Weekly Case Progress Report'
      }
    },
    {
      id: '6',
      name: 'Refund Notification Email',
      type: 'Email',
      templateUsed: {
        id: 'template-6',
        name: 'Refund Notification Template'
      },
      createdBy: 'Sarah Johnson',
      createdDate: '2024-01-25T09:15:00Z',
      deliveryMethod: 'Email',
      status: 'Opened',
      recipient: 'sarah.williams@email.com',
      fileSize: '156 KB',
      previewUrl: '/preview/doc-6',
      downloadUrl: '/download/doc-6',
      metadata: {
        subject: 'Refund Received - £2,100.00',
        lenderName: 'Barclays Bank PLC',
        amount: '£2,100.00'
      }
    },
    {
      id: '7',
      name: 'Lloyds Complaint Letter',
      type: 'Letter',
      templateUsed: {
        id: 'template-7',
        name: 'Lloyds PPI Complaint Template'
      },
      createdBy: 'Michael Brown',
      createdDate: '2024-01-26T10:00:00Z',
      deliveryMethod: 'Manual',
      status: 'Draft',
      recipient: 'complaints@lloydsbank.com',
      fileSize: '1.3 MB',
      previewUrl: '/preview/doc-7',
      downloadUrl: '/download/doc-7',
      metadata: {
        subject: 'PPI Complaint - Account 98765432',
        lenderName: 'Lloyds Banking Group',
        amount: '£1,200.00'
      }
    }
  ];

  const documentTypes = ['all', 'Letter', 'Email', 'PDF', 'SMS', 'Template', 'Report'];
  const statusTypes = ['all', 'Draft', 'Sent', 'Delivered', 'Opened', 'Signed', 'Failed'];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.templateUsed?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'oldest':
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Letter': return 'ri-file-text-line';
      case 'Email': return 'ri-mail-line';
      case 'PDF': return 'ri-file-pdf-line';
      case 'SMS': return 'ri-message-2-line';
      case 'Template': return 'ri-file-copy-line';
      case 'Report': return 'ri-bar-chart-line';
      default: return 'ri-file-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Letter': return 'bg-blue-100 text-blue-800';
      case 'Email': return 'bg-green-100 text-green-800';
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'SMS': return 'bg-purple-100 text-purple-800';
      case 'Template': return 'bg-yellow-100 text-yellow-800';
      case 'Report': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Opened': return 'bg-purple-100 text-purple-800';
      case 'Signed': return 'bg-emerald-100 text-emerald-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'Email': return 'ri-mail-line';
      case 'E-sign': return 'ri-file-edit-line';
      case 'SMS': return 'ri-message-2-line';
      case 'Manual': return 'ri-hand-heart-line';
      case 'Download': return 'ri-download-line';
      case 'Portal': return 'ri-global-line';
      default: return 'ri-send-plane-line';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB'),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const exportToCsv = () => {
    const csvData = sortedDocuments.map(doc => {
      const dateTime = formatDateTime(doc.createdDate);
      return {
        'Document Name': doc.name,
        'Type': doc.type,
        'Template Used': doc.templateUsed?.name || 'N/A',
        'Created By': doc.createdBy,
        'Date': dateTime.date,
        'Time': dateTime.time,
        'Delivery Method': doc.deliveryMethod,
        'Status': doc.status,
        'Recipient': doc.recipient || 'N/A',
        'File Size': doc.fileSize || 'N/A'
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matter-${matterId}-document-history.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePreview = (document: DocumentHistoryItem) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  const handleDownload = (document: DocumentHistoryItem) => {
    // In real implementation, trigger download
    console.log('Downloading document:', document.name);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Document History</h3>
          <p className="text-sm text-gray-600">Generated letters, emails, and documents for this matter</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md text-sm transition-colors cursor-pointer ${
                viewMode === 'timeline' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-roadmap-line w-4 h-4 mr-1 inline flex items-center justify-center"></i>
              Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm transition-colors cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-table-line w-4 h-4 mr-1 inline flex items-center justify-center"></i>
              Table
            </button>
          </div>
          <button 
            onClick={exportToCsv}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-download-line w-4 h-4 inline mr-2"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <i className="ri-search-line w-4 h-4 absolute left-3 top-2.5 text-gray-400 flex items-center justify-center"></i>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="type">Type</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
                setSortBy('newest');
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timeline' ? (
        <div className="space-y-6">
          {sortedDocuments.map((document, index) => {
            const dateTime = formatDateTime(document.createdDate);
            return (
              <div key={document.id} className="relative">
                {/* Timeline connector */}
                {index < sortedDocuments.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-300"></div>
                )}
                
                <div className="flex space-x-4">
                  {/* Timeline icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md ${getTypeColor(document.type)}`}>
                    <i className={`${getTypeIcon(document.type)} w-5 h-5 flex items-center justify-center`}></i>
                  </div>

                  {/* Document details */}
                  <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{document.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                            <span>Created by {document.createdBy}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
                            <span>{dateTime.date} at {dateTime.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className={`${getDeliveryIcon(document.deliveryMethod)} w-4 h-4 flex items-center justify-center`}></i>
                            <span>{document.deliveryMethod}</span>
                          </div>
                          {document.recipient && (
                            <div className="flex items-center space-x-2">
                              <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center"></i>
                              <span>{document.recipient}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handlePreview(document)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Preview"
                        >
                          <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Download"
                        >
                          <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </div>

                    {/* Additional metadata */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {document.templateUsed && (
                          <div>
                            <span className="text-sm text-gray-500">Template Used:</span>
                            <Link 
                              href={`/templates/${document.templateUsed.id}`}
                              className="block text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                              {document.templateUsed.name}
                            </Link>
                          </div>
                        )}
                        {document.fileSize && (
                          <div>
                            <span className="text-sm text-gray-500">File Size:</span>
                            <span className="block text-sm text-gray-900 font-medium">{document.fileSize}</span>
                          </div>
                        )}
                        {document.metadata?.amount && (
                          <div>
                            <span className="text-sm text-gray-500">Amount:</span>
                            <span className="block text-sm text-green-600 font-medium">{document.metadata.amount}</span>
                          </div>
                        )}
                      </div>
                      
                      {document.metadata?.subject && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Subject/Content:</span>
                          <p className="text-sm text-gray-900 mt-1">{document.metadata.subject}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Table view
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Document</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Template</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Delivery</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedDocuments.map((document) => {
                  const dateTime = formatDateTime(document.createdDate);
                  return (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(document.type)}`}>
                            <i className={`${getTypeIcon(document.type)} w-4 h-4 flex items-center justify-center`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{document.name}</p>
                            <p className="text-sm text-gray-500">{document.fileSize}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                          {document.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {document.templateUsed ? (
                          <Link 
                            href={`/templates/${document.templateUsed.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                          >
                            {document.templateUsed.name}
                          </Link>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-900 font-medium text-xs">
                              {document.createdBy.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{document.createdBy}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{dateTime.date}</p>
                          <p className="text-xs text-gray-500">{dateTime.time}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <i className={`${getDeliveryIcon(document.deliveryMethod)} w-4 h-4 text-gray-400 flex items-center justify-center`}></i>
                          <span className="text-sm text-gray-900">{document.deliveryMethod}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreview(document)}
                            className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                            title="Preview"
                          >
                            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <button
                            onClick={() => handleDownload(document)}
                            className="p-1 text-gray-400 hover:text-green-600 cursor-pointer"
                            title="Download"
                          >
                            <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {sortedDocuments.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-file-list-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search terms or filters.'
              : 'Generated documents will appear here once you start creating letters and emails.'}
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-blue-700">
            <span>Total Documents: {mockDocuments.length}</span>
            <span>•</span>
            <span>Showing: {sortedDocuments.length}</span>
            <span>•</span>
            <span>Delivered: {mockDocuments.filter(d => d.status === 'Delivered').length}</span>
            <span>•</span>
            <span>Pending: {mockDocuments.filter(d => d.status === 'Draft').length}</span>
          </div>
          <div className="text-sm text-blue-600">
            Last updated: {new Date().toLocaleString('en-GB')}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{selectedDocument.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedDocument.createdBy} • {formatDateTime(selectedDocument.createdDate).date}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <div className="text-center py-12">
                <i className="ri-file-text-line w-16 h-16 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
                <p className="text-gray-600 mb-4">Document preview will be displayed here</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 cursor-pointer"
                  >
                    <i className="ri-download-line w-4 h-4 mr-2 inline"></i>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}