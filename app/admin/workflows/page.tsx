
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  matterType: string;
  status: 'active' | 'draft' | 'archived';
  stepCount: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  usageCount: number;
  averageCompletionTime: number;
}

export default function WorkflowsPage() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'Standard PPI Claims Process',
      description: 'Complete workflow for processing PPI claims from initial assessment to settlement',
      matterType: 'PPI Claims',
      status: 'active',
      stepCount: 6,
      createdBy: 'John Smith',
      createdAt: '2024-01-10T10:00:00Z',
      lastModified: '2024-01-15T14:30:00Z',
      usageCount: 142,
      averageCompletionTime: 21
    },
    {
      id: '2',
      name: 'Packaged Bank Account Claims',
      description: 'Workflow template for packaged bank account mis-selling claims',
      matterType: 'Packaged Bank Accounts',
      status: 'active',
      stepCount: 5,
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-12T09:00:00Z',
      lastModified: '2024-01-18T11:15:00Z',
      usageCount: 89,
      averageCompletionTime: 18
    },
    {
      id: '3',
      name: 'Mortgage Mis-selling Claims',
      description: 'Comprehensive workflow for mortgage mis-selling investigations',
      matterType: 'Mortgage Mis-selling',
      status: 'draft',
      stepCount: 8,
      createdBy: 'Michael Brown',
      createdAt: '2024-01-14T15:00:00Z',
      lastModified: '2024-01-20T16:45:00Z',
      usageCount: 0,
      averageCompletionTime: 0
    },
    {
      id: '4',
      name: 'Credit Card Claims Process',
      description: 'Workflow for processing credit card related claims',
      matterType: 'Credit Card Claims',
      status: 'active',
      stepCount: 4,
      createdBy: 'Emma Davis',
      createdAt: '2024-01-16T12:30:00Z',
      lastModified: '2024-01-19T10:20:00Z',
      usageCount: 34,
      averageCompletionTime: 14
    },
    {
      id: '5',
      name: 'Legacy PPI Process v1',
      description: 'Original PPI claims workflow - now archived',
      matterType: 'PPI Claims',
      status: 'archived',
      stepCount: 7,
      createdBy: 'John Smith',
      createdAt: '2023-12-01T08:00:00Z',
      lastModified: '2024-01-10T09:30:00Z',
      usageCount: 78,
      averageCompletionTime: 25
    },
    {
      id: '6',
      name: 'Motor Finance Claims',
      description: 'Workflow for motor finance commission claims',
      matterType: 'Motor Finance Claims',
      status: 'active',
      stepCount: 6,
      createdBy: 'David Wilson',
      createdAt: '2024-01-18T14:00:00Z',
      lastModified: '2024-01-22T11:30:00Z',
      usageCount: 15,
      averageCompletionTime: 19
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [selectedMatterType, setSelectedMatterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'modified' | 'usage'>('modified');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const matterTypes = [
    'PPI Claims',
    'Packaged Bank Accounts',
    'Mortgage Mis-selling',
    'Credit Card Claims',
    'Motor Finance Claims',
    'Unaffordable Credit'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus;
    const matchesMatterType = selectedMatterType === 'all' || template.matterType === selectedMatterType;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesMatterType && matchesSearch;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'modified':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'usage':
        return b.usageCount - a.usageCount;
      default:
        return 0;
    }
  });

  const handleStatusChange = (templateId: string, newStatus: WorkflowTemplate['status']) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, status: newStatus, lastModified: new Date().toISOString() }
          : template
      )
    );
    setActiveDropdown(null);
  };

  const handleDuplicate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const duplicatedTemplate: WorkflowTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        usageCount: 0,
        averageCompletionTime: 0
      };
      setTemplates(prev => [duplicatedTemplate, ...prev]);
    }
    setActiveDropdown(null);
  };

  const handleDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    setShowDeleteModal(null);
  };

  const handleExportTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const exportData = {
        ...template,
        exportedAt: new Date().toISOString(),
        exportedBy: 'Current User'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-template-${template.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    setActiveDropdown(null);
  };

  const handleViewDetails = (templateId: string) => {
    // Navigate to template details or show details modal
    console.log('View details for template:', templateId);
    setActiveDropdown(null);
  };

  const toggleDropdown = (templateId: string) => {
    setActiveDropdown(activeDropdown === templateId ? null : templateId);
  };

  const getStatusColor = (status: WorkflowTemplate['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: WorkflowTemplate['status']) => {
    switch (status) {
      case 'active':
        return 'ri-play-circle-line';
      case 'draft':
        return 'ri-draft-line';
      case 'archived':
        return 'ri-archive-line';
      default:
        return 'ri-circle-line';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB');
  };

  const getStatusCount = (status: WorkflowTemplate['status']) => {
    return templates.filter(template => template.status === status).length;
  };

  const getTotalUsage = () => {
    return templates.reduce((sum, template) => sum + template.usageCount, 0);
  };

  const getAverageCompletionTime = () => {
    const activeTemplates = templates.filter(t => t.status === 'active' && t.usageCount > 0);
    if (activeTemplates.length === 0) return 0;
    
    const totalTime = activeTemplates.reduce((sum, template) => sum + template.averageCompletionTime, 0);
    return Math.round(totalTime / activeTemplates.length);
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
                  Workflow Templates
                </h1>
                <p className="text-gray-600">
                  Manage and configure workflow templates for different matter types
                </p>
              </div>
              <Link
                href="/admin/workflows/new"
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line w-4 h-4 mr-2 inline-flex items-center justify-center"></i>
                New Template
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-flow-chart w-6 h-6 text-blue-600 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount('active')}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-play-circle-line w-6 h-6 text-green-600 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalUsage()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-bar-chart-line w-6 h-6 text-purple-600 flex items-center justify-center"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                  <p className="text-2xl font-bold text-gray-900">{getAverageCompletionTime()}d</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line w-6 h-6 text-orange-600 flex items-center justify-center"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedMatterType('all');
                  setSearchTerm('');
                  setSortBy('modified');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active ({getStatusCount('active')})</option>
                  <option value="draft">Draft ({getStatusCount('draft')})</option>
                  <option value="archived">Archived ({getStatusCount('archived')})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matter Type</label>
                <select
                  value={selectedMatterType}
                  onChange={(e) => setSelectedMatterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="all">All Types</option>
                  {matterTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="modified">Last Modified</option>
                  <option value="name">Name A-Z</option>
                  <option value="created">Date Created</option>
                  <option value="usage">Usage Count</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <i className="ri-search-line w-4 h-4 absolute left-3 top-2.5 text-gray-400 flex items-center justify-center"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className={`${getStatusIcon(template.status)} w-5 h-5 text-blue-600 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.matterType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(template.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <i className="ri-more-line w-4 h-4 flex items-center justify-center"></i>
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === template.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          <Link
                            href={`/admin/workflows/${template.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <i className="ri-edit-line w-4 h-4 mr-3 text-blue-600 flex items-center justify-center"></i>
                            Edit Template
                          </Link>
                          
                          <button
                            onClick={() => handleViewDetails(template.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <i className="ri-eye-line w-4 h-4 mr-3 text-gray-600 flex items-center justify-center"></i>
                            View Details
                          </button>
                          
                          <button
                            onClick={() => handleDuplicate(template.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <i className="ri-file-copy-line w-4 h-4 mr-3 text-green-600 flex items-center justify-center"></i>
                            Duplicate
                          </button>
                          
                          <button
                            onClick={() => handleExportTemplate(template.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            <i className="ri-download-line w-4 h-4 mr-3 text-purple-600 flex items-center justify-center"></i>
                            Export Template
                          </button>
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <div className="px-4 py-2">
                            <p className="text-xs text-gray-500 mb-2">Change Status</p>
                            <div className="space-y-1">
                              <button
                                onClick={() => handleStatusChange(template.id, 'active')}
                                className={`flex items-center w-full px-2 py-1 text-xs rounded cursor-pointer ${
                                  template.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <i className="ri-play-circle-line w-3 h-3 mr-2 flex items-center justify-center"></i>
                                Active
                              </button>
                              <button
                                onClick={() => handleStatusChange(template.id, 'draft')}
                                className={`flex items-center w-full px-2 py-1 text-xs rounded cursor-pointer ${
                                  template.status === 'draft' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <i className="ri-draft-line w-3 h-3 mr-2 flex items-center justify-center"></i>
                                Draft
                              </button>
                              <button
                                onClick={() => handleStatusChange(template.id, 'archived')}
                                className={`flex items-center w-full px-2 py-1 text-xs rounded cursor-pointer ${
                                  template.status === 'archived' 
                                    ? 'bg-gray-100 text-gray-800' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <i className="ri-archive-line w-3 h-3 mr-2 flex items-center justify-center"></i>
                                Archived
                              </button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <button
                            onClick={() => setShowDeleteModal(template.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line w-4 h-4 mr-3 flex items-center justify-center"></i>
                            Delete Template
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Steps</p>
                    <p className="font-medium text-gray-900">{template.stepCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="font-medium text-gray-900">{template.usageCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg. Time</p>
                    <p className="font-medium text-gray-900">{template.averageCompletionTime}d</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(template.createdAt)}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  <p>Created by {template.createdBy}</p>
                  <p>Modified {formatDateTime(template.lastModified)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/workflows/${template.id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Template"
                    >
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    </Link>
                    <button
                      onClick={() => handleDuplicate(template.id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Template"
                    >
                      <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Template"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={template.status}
                      onChange={(e) => handleStatusChange(template.id, e.target.value as WorkflowTemplate['status'])}
                      className="px-2 py-1 border border-gray-300 rounded text-xs pr-6"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedTemplates.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-flow-chart w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedStatus !== 'all' || selectedMatterType !== 'all' 
                  ? 'No templates match your current filters.' 
                  : 'Create your first workflow template to get started.'}
              </p>
              <Link
                href="/admin/workflows/new"
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Create Template
              </Link>
            </div>
          )}

          {/* Results Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mt-8">
            <p className="text-sm text-blue-700">
              Showing {sortedTemplates.length} of {templates.length} workflow templates
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="ri-error-warning-line w-5 h-5 text-red-600 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Template</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this workflow template? This will not affect existing matters using this template.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setActiveDropdown(null)}
        ></div>
      )}
    </div>
  );
}
