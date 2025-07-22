
'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import TemplateEditor from '../../components/TemplateEditor';

interface Template {
  id: string;
  name: string;
  type: 'Letter' | 'Email' | 'SMS' | 'Task';
  createdBy: string;
  lastUpdated: string;
  tags: string[];
  content: string;
  status: 'Draft' | 'Published';
  clientTags: string[];
}

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [clientTagFilter, setClientTagFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Client Care Pack Letter',
      type: 'Letter',
      createdBy: 'Sarah Johnson',
      lastUpdated: '2024-01-15',
      tags: ['onboarding', 'client'],
      content: 'Dear {{client.fullName}},\n\nWe are pleased to confirm that we have been instructed to act on your behalf...',
      status: 'Published',
      clientTags: ['New Client', 'VIP']
    },
    {
      id: '2',
      name: 'Vulnerable Client Support Email',
      type: 'Email',
      createdBy: 'Michael Brown',
      lastUpdated: '2024-01-14',
      tags: ['support', 'vulnerable'],
      content: 'Subject: Additional Support Available\n\nDear {{client.fullName}},\n\nWe understand that you may need additional support...',
      status: 'Published',
      clientTags: ['Vulnerable', 'Elderly']
    },
    {
      id: '3',
      name: 'High Value Client Follow-up',
      type: 'Email',
      createdBy: 'Emma Davis',
      lastUpdated: '2024-01-13',
      tags: ['follow-up', 'priority'],
      content: 'Subject: Personal Update on Your Case\n\nDear {{client.fullName}},\n\nAs a valued client, I wanted to provide you with a personal update...',
      status: 'Published',
      clientTags: ['High Value', 'VIP']
    },
    {
      id: '4',
      name: 'Appointment Reminder SMS',
      type: 'SMS',
      createdBy: 'Emma Davis',
      lastUpdated: '2024-01-13',
      tags: ['appointment', 'reminder'],
      content: 'Hi {{client.firstName}}, this is a reminder of your appointment on {{appointment.date}} at {{appointment.time}}. Please call if you need to reschedule.',
      status: 'Published',
      clientTags: ['Priority', 'Repeat']
    },
    {
      id: '5',
      name: 'Document Collection Task',
      type: 'Task',
      createdBy: 'John Smith',
      lastUpdated: '2024-01-12',
      tags: ['documents', 'collection'],
      content: '1. Contact {{client.fullName}} to request outstanding documents\n2. Follow up on {{lender.name}} correspondence\n3. Update file with received documents',
      status: 'Draft',
      clientTags: ['Complex Case']
    },
    {
      id: '6',
      name: 'Refund Notification Email',
      type: 'Email',
      createdBy: 'Sarah Johnson',
      lastUpdated: '2024-01-11',
      tags: ['refund', 'notification'],
      content: 'Subject: Refund Update - {{matter.reference}}\n\nDear {{client.fullName}},\n\nWe are pleased to inform you that we have received a refund of £{{refund.amount}} from {{lender.name}}...',
      status: 'Published',
      clientTags: ['High Value', 'Priority']
    }
  ]);

  const clientTags = [
    'Vulnerable',
    'Repeat',
    'High Value',
    'Priority',
    'VIP',
    'Elderly',
    'Complex Case',
    'New Client'
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesFilter = activeFilter === 'All' || template.type === activeFilter;
    const matchesClientTag = clientTagFilter === 'all' || template.clientTags.includes(clientTagFilter);
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         template.clientTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesClientTag && matchesSearch;
  });

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      status: 'Draft' as const,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, lastUpdated: new Date().toISOString().split('T')[0] }
          : t
      ));
    } else {
      const newTemplate = {
        id: Date.now().toString(),
        createdBy: 'Current User',
        lastUpdated: new Date().toISOString().split('T')[0],
        clientTags: [],
        ...templateData
      };
      setTemplates([...templates, newTemplate]);
    }
    setIsEditorOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Letter': return 'ri-file-text-line';
      case 'Email': return 'ri-mail-line';
      case 'SMS': return 'ri-message-2-line';
      case 'Task': return 'ri-task-line';
      default: return 'ri-file-line';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Letter': return 'bg-blue-100 text-blue-800';
      case 'Email': return 'bg-green-100 text-green-800';
      case 'SMS': return 'bg-purple-100 text-purple-800';
      case 'Task': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientTagColor = (tag: string) => {
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

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const renderTemplatePreview = (template: Template) => {
    const sampleData = {
      client: {
        fullName: 'Sarah Williams',
        firstName: 'Sarah',
        email: 'sarah.williams@email.com',
        phone: '07123 456 789',
        address: '123 Main Street, London, SW1A 1AA'
      },
      matter: {
        reference: 'PPI-2024-001',
        type: 'PPI Claim'
      },
      lender: {
        name: 'Barclays Bank PLC'
      },
      appointment: {
        date: '15th March 2024',
        time: '2:00 PM'
      },
      refund: {
        amount: '1,250.00'
      }
    };

    let renderedContent = template.content;

    Object.entries(sampleData).forEach(([section, data]) => {
      Object.entries(data).forEach(([key, value]) => {
        const mergeField = `{{${section}.${key}}}`;
        renderedContent = renderedContent.replace(new RegExp(mergeField, 'g'), value);
      });
    });

    return renderedContent;
  };

  if (isEditorOpen) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => setIsEditorOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Manager</h1>
              <p className="text-gray-600 mt-2">Create and manage reusable communication templates</p>
            </div>
            <button
              onClick={handleCreateTemplate}
              className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-2"
              style={{ backgroundColor: '#334960' }}
            >
              <i className="ri-add-line w-5 h-5 flex items-center justify-center"></i>
              <span>Create Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Templates</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or tag..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                  </div>
                </div>

                {/* Type Filters */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Template Type</label>
                  <div className="space-y-2">
                    {['All', 'Letter', 'Email', 'SMS', 'Task'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                          activeFilter === filter
                            ? 'border border-orange-200 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        style={activeFilter === filter ? { backgroundColor: '#f46524' } : {}}
                      >
                        <div className="flex items-center space-x-2">
                          <i className={`${filter === 'All' ? 'ri-folder-line' : getTypeIcon(filter)} w-4 h-4 flex items-center justify-center`}></i>
                          <span className="text-sm">{filter}</span>
                          <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {filter === 'All' ? templates.length : templates.filter(t => t.type === filter).length}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Client Tag Filters */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Client Tags</label>
                  <select
                    value={clientTagFilter}
                    onChange={(e) => setClientTagFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm pr-8"
                    style={{ '&:focus': { borderColor: '#f46524', boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' } }}
                  >
                    <option value="all">All Client Tags</option>
                    {clientTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>

                {/* Popular Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Popular Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['onboarding', 'support', 'refund', 'priority', 'appointment'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                        style={{ '&:hover': { backgroundColor: '#f46524', color: 'white' } }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Template List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Templates ({filteredTemplates.length})
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <i className="ri-filter-line w-4 h-4 flex items-center justify-center"></i>
                      <span>
                        {activeFilter === 'All' ? 'All types' : activeFilter.toLowerCase()}
                        {clientTagFilter !== 'all' && ` • ${clientTagFilter}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(template.type)}`}>
                              {template.type}
                            </span>
                            {template.status === 'Draft' && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Draft
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>Created by {template.createdBy}</span>
                            <span>•</span>
                            <span>Updated {template.lastUpdated}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {template.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                            {template.clientTags.map((tag) => (
                              <span key={tag} className={`px-2 py-1 rounded text-xs font-medium ${getClientTagColor(tag)}`}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2">
                            {template.content.substring(0, 150)}...
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            onClick={() => handlePreviewTemplate(template)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Preview"
                          >
                            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <button 
                            onClick={() => handleEditTemplate(template)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-green-500 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <button 
                            onClick={() => handleDuplicateTemplate(template)}
                            className="p-2 text-gray-400 rounded-lg transition-colors cursor-pointer"
                            style={{ '&:hover': { backgroundColor: '#f46524', color: 'white' } }}
                            title="Duplicate"
                          >
                            <i className="ri-file-copy-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="p-12 text-center">
                    <i className="ri-file-text-line w-12 h-12 flex items-center justify-center mx-auto text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || clientTagFilter !== 'all' ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first template.'}
                    </p>
                    <button
                      onClick={handleCreateTemplate}
                      className="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors cursor-pointer"
                      style={{ backgroundColor: '#334960' }}
                    >
                      Create Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <i className={`${getTypeIcon(previewTemplate.type)} w-5 h-5 text-gray-400 flex items-center justify-center`}></i>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{previewTemplate.name}</h3>
                  <p className="text-sm text-gray-500">Template Preview</p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(previewTemplate.type)}`}>
                    {previewTemplate.type}
                  </span>
                  {previewTemplate.status === 'Draft' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {previewTemplate.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {previewTemplate.clientTags.map((tag) => (
                    <span key={tag} className={`px-2 py-1 rounded text-xs font-medium ${getClientTagColor(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Data Used:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>• Client: Sarah Williams (sarah.williams@email.com)</div>
                  <div>• Matter: PPI-2024-001</div>
                  <div>• Lender: Barclays Bank PLC</div>
                  <div>• Appointment: 15th March 2024 at 2:00 PM</div>
                  <div>• Refund: £1,250.00</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                  {renderTemplatePreview(previewTemplate)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Created by {previewTemplate.createdBy} • Updated {previewTemplate.lastUpdated}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleEditTemplate(previewTemplate);
                    closePreview();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <i className="ri-edit-line w-4 h-4 mr-2 inline-flex items-center justify-center"></i>
                  Edit Template
                </button>
                <button
                  onClick={closePreview}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
