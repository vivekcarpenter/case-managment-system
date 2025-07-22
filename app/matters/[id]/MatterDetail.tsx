
'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import WorkflowTimeline from '../../../components/WorkflowTimeline';
import ActivityLog from '../../../components/ActivityLog';
import DocumentUpload from '../../../components/DocumentUpload';
import DocumentHistory from '../../../components/DocumentHistory';

export default function MatterDetail({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  const matter = {
    id: params.id,
    fileRef: 'PPI-2024-001',
    client: 'Sarah Williams',
    type: 'PPI Claims',
    status: 'Active',
    dateOpened: '2024-01-15',
    assignedTo: 'John Smith',
    description: 'PPI claim investigation for multiple credit cards and loan products',
    totalRefunds: '£4,500.00',
    tags: ['High Value', 'VIP', 'Priority'],
    lenders: [
      { name: 'Barclays Bank PLC', amount: '£2,100.00', status: 'Active' },
      { name: 'HSBC UK Bank PLC', amount: '£1,200.00', status: 'Pending' },
      { name: 'Lloyds Banking Group', amount: '£1,200.00', status: 'Active' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-file-text-line' },
    { id: 'workflow', label: 'Workflow Timeline', icon: 'ri-roadmap-line' },
    { id: 'activity', label: 'Activity Log', icon: 'ri-history-line' },
    { id: 'documents', label: 'Documents', icon: 'ri-folder-line' },
    { id: 'document-history', label: 'Document History', icon: 'ri-file-list-line' },
    { id: 'notes', label: 'Notes', icon: 'ri-sticky-note-line' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'High Value':
        return 'bg-green-100 text-green-800';
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Priority':
        return 'bg-orange-100 text-orange-800';
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'Complex':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{matter.fileRef}</h1>
              <p className="text-gray-600 mt-2">{matter.client} • {matter.type}</p>

              {/* Matter Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {matter.tags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(matter.status)}`}>
                {matter.status}
              </span>
              <button className="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors whitespace-nowrap cursor-pointer" style={{ backgroundColor: '#334960' }}>
                Edit Matter
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'text-white border-b-2'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={activeTab === tab.id ? { borderBottomColor: '#f46524', color: '#f46524' } : {}}
                  >
                    <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Matter Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Matter Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">File Reference:</span>
                          <span className="font-medium">{matter.fileRef}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Client:</span>
                          <span className="font-medium">{matter.client}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{matter.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date Opened:</span>
                          <span className="font-medium">{matter.dateOpened}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned To:</span>
                          <span className="font-medium">{matter.assignedTo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Financial Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Refunds:</span>
                          <span className="font-medium text-green-600">{matter.totalRefunds}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Lenders:</span>
                          <span className="font-medium">{matter.lenders.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lenders */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Associated Lenders</h3>
                    <div className="space-y-3">
                      {matter.lenders.map((lender, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{lender.name}</p>
                            <p className="text-sm text-gray-600">Refund Amount: {lender.amount}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lender.status)}`}>
                            {lender.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'workflow' && (
                <WorkflowTimeline matterId={matter.id} />
              )}

              {activeTab === 'activity' && (
                <ActivityLog matterId={matter.id} />
              )}

              {activeTab === 'documents' && (
                <DocumentUpload matterId={matter.id} />
              )}

              {activeTab === 'document-history' && (
                <DocumentHistory matterId={matter.id} />
              )}

              {activeTab === 'notes' && (
                <div className="text-center py-12">
                  <i className="ri-sticky-note-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600">Notes feature coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
