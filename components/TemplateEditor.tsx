
'use client';

import { useState, useEffect } from 'react';
import Header from './Header';

interface Template {
  id: string;
  name: string;
  type: 'Letter' | 'Email' | 'SMS' | 'Task';
  createdBy: string;
  lastUpdated: string;
  tags: string[];
  content: string;
  status: 'Draft' | 'Published';
}

interface TemplateEditorProps {
  template: Template | null;
  onSave: (templateData: any) => void;
  onCancel: () => void;
}

interface MergeField {
  id: string;
  name: string;
  label: string;
  section: 'client' | 'lender' | 'matter';
  syntax: string;
  isCustom: boolean;
  description?: string;
}

export default function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Letter' as 'Letter' | 'Email' | 'SMS' | 'Task',
    tags: [] as string[],
    content: '',
    status: 'Draft' as 'Draft' | 'Published'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showDummyData, setShowDummyData] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Merge field browser state
  const [mergeFieldSearch, setMergeFieldSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'client' | 'lender' | 'matter'>('all');
  const [showCustomFields, setShowCustomFields] = useState(true);
  const [showDefaultFields, setShowDefaultFields] = useState(true);

  // Combined merge fields (default + custom)
  const [mergeFields, setMergeFields] = useState<MergeField[]>([]);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type,
        tags: template.tags,
        content: template.content,
        status: template.status
      });
    }
  }, [template]);

  // Load merge fields (default + custom)
  useEffect(() => {
    const defaultFields: MergeField[] = [
      // Client fields
      { id: 'client_fullName', name: 'fullName', label: 'Full Name', section: 'client', syntax: 'client.fullName', isCustom: false, description: 'Complete client name' },
      { id: 'client_firstName', name: 'firstName', label: 'First Name', section: 'client', syntax: 'client.firstName', isCustom: false },
      { id: 'client_lastName', name: 'lastName', label: 'Last Name', section: 'client', syntax: 'client.lastName', isCustom: false },
      { id: 'client_email', name: 'email', label: 'Email Address', section: 'client', syntax: 'client.email', isCustom: false },
      { id: 'client_phone', name: 'phone', label: 'Phone Number', section: 'client', syntax: 'client.phone', isCustom: false },
      { id: 'client_address', name: 'address', label: 'Address', section: 'client', syntax: 'client.address', isCustom: false },
      { id: 'client_emergencyContact', name: 'emergencyContact', label: 'Emergency Contact', section: 'client', syntax: 'client.emergencyContact', isCustom: false },
      { id: 'client_vulnerabilityStatus', name: 'vulnerabilityStatus', label: 'Vulnerability Status', section: 'client', syntax: 'client.vulnerabilityStatus', isCustom: false },
      
      // Lender fields
      { id: 'lender_name', name: 'name', label: 'Lender Name', section: 'lender', syntax: 'lender.name', isCustom: false },
      { id: 'lender_address', name: 'address', label: 'Lender Address', section: 'lender', syntax: 'lender.address', isCustom: false },
      { id: 'lender_accountNo', name: 'accountNo', label: 'Account Number', section: 'lender', syntax: 'lender.accountNo', isCustom: false },
      { id: 'lender_loanType', name: 'loanType', label: 'Loan Type', section: 'lender', syntax: 'lender.loanType', isCustom: false },
      { id: 'lender_interestRate', name: 'interestRate', label: 'Interest Rate', section: 'lender', syntax: 'lender.interestRate', isCustom: false },
      { id: 'lender_monthlyPayment', name: 'monthlyPayment', label: 'Monthly Payment', section: 'lender', syntax: 'lender.monthlyPayment', isCustom: false },
      
      // Matter fields
      { id: 'matter_reference', name: 'reference', label: 'Matter Reference', section: 'matter', syntax: 'matter.reference', isCustom: false },
      { id: 'matter_date', name: 'date', label: 'Matter Date', section: 'matter', syntax: 'matter.date', isCustom: false },
      { id: 'matter_estimatedValue', name: 'estimatedValue', label: 'Estimated Value', section: 'matter', syntax: 'matter.estimatedValue', isCustom: false },
      { id: 'matter_referralSource', name: 'referralSource', label: 'Referral Source', section: 'matter', syntax: 'matter.referralSource', isCustom: false },
      
      // Additional fields
      { id: 'refund_amount', name: 'amount', label: 'Refund Amount', section: 'matter', syntax: 'refund.amount', isCustom: false },
      { id: 'appointment_date', name: 'date', label: 'Appointment Date', section: 'matter', syntax: 'appointment.date', isCustom: false },
      { id: 'appointment_time', name: 'time', label: 'Appointment Time', section: 'matter', syntax: 'appointment.time', isCustom: false }
    ];

    // Mock custom fields - in real app, these would come from CustomFieldManager
    const customFields: MergeField[] = [
      { id: 'custom_client_preferredContact', name: 'preferredContact', label: 'Preferred Contact Method', section: 'client', syntax: 'client.preferredContact', isCustom: true, description: 'How client prefers to be contacted' },
      { id: 'custom_lender_loanStartDate', name: 'loanStartDate', label: 'Loan Start Date', section: 'lender', syntax: 'lender.loanStartDate', isCustom: true, description: 'When the loan began' },
      { id: 'custom_matter_urgencyLevel', name: 'urgencyLevel', label: 'Urgency Level', section: 'matter', syntax: 'matter.urgencyLevel', isCustom: true, description: 'Priority level of the matter' },
      { id: 'custom_client_specialNeeds', name: 'specialNeeds', label: 'Special Needs', section: 'client', syntax: 'client.specialNeeds', isCustom: true, description: 'Any accessibility requirements' },
      { id: 'custom_lender_contactPerson', name: 'contactPerson', label: 'Contact Person', section: 'lender', syntax: 'lender.contactPerson', isCustom: true, description: 'Primary contact at lender' }
    ];

    setMergeFields([...defaultFields, ...customFields]);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name || formData.content) {
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const insertMergeField = (field: MergeField) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = formData.content.substring(0, start) + 
                        `{{${field.syntax}}}` + 
                        formData.content.substring(end);
      handleInputChange('content', newContent);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + field.syntax.length + 4, start + field.syntax.length + 4);
      }, 0);
    }
  };

  const renderPreview = () => {
    let previewContent = formData.content;
    
    if (showDummyData) {
      const dummyData = {
        'client.fullName': 'John Smith',
        'client.firstName': 'John',
        'client.lastName': 'Smith',
        'client.email': 'john.smith@email.com',
        'client.phone': '07123 456789',
        'client.address': '123 High Street, London, SW1A 1AA',
        'client.emergencyContact': 'Jane Smith - 07987 654321',
        'client.vulnerabilityStatus': 'None',
        'client.preferredContact': 'Email',
        'client.specialNeeds': 'Large print documents required',
        'lender.name': 'Example Bank Ltd',
        'lender.address': '456 Bank Street, London, EC1A 1BB',
        'lender.accountNo': '12345678',
        'lender.loanStartDate': '15/01/2020',
        'lender.loanType': 'Personal Loan',
        'lender.interestRate': '15.9%',
        'lender.monthlyPayment': '£250.00',
        'lender.contactPerson': 'Sarah Johnson - Claims Department',
        'matter.reference': 'MAT-2024-001',
        'matter.date': new Date().toLocaleDateString('en-GB'),
        'matter.urgencyLevel': 'High',
        'matter.estimatedValue': '£4,500.00',
        'matter.referralSource': 'Website',
        'refund.amount': '£1,250.00',
        'appointment.date': '15th January 2024',
        'appointment.time': '2:00 PM'
      };

      Object.entries(dummyData).forEach(([key, value]) => {
        previewContent = previewContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
    }

    return previewContent;
  };

  const handleSave = (status: 'Draft' | 'Published') => {
    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (!formData.content.trim()) {
      alert('Please enter template content');
      return;
    }

    onSave({
      ...formData,
      status
    });
  };

  // Filter merge fields based on search and filters
  const filteredMergeFields = mergeFields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(mergeFieldSearch.toLowerCase()) ||
                         field.syntax.toLowerCase().includes(mergeFieldSearch.toLowerCase());
    const matchesSection = selectedSection === 'all' || field.section === selectedSection;
    const matchesCustomFilter = (showCustomFields && field.isCustom) || (showDefaultFields && !field.isCustom);
    return matchesSearch && matchesSection && matchesCustomFilter;
  });

  // Group fields by section
  const groupedFields = filteredMergeFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = [];
    }
    acc[field.section].push(field);
    return acc;
  }, {} as Record<string, MergeField[]>);

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'client': return 'ri-user-line';
      case 'lender': return 'ri-bank-line';
      case 'matter': return 'ri-file-text-line';
      default: return 'ri-tag-line';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'client': return 'text-blue-600';
      case 'lender': return 'text-green-600';
      case 'matter': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {template ? 'Edit Template' : 'Create Template'}
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-gray-600">
                    {template ? `Editing: ${template.name}` : 'Create a new communication template'}
                  </p>
                  {lastSaved && (
                    <span className="text-sm text-green-600 flex items-center space-x-1">
                      <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                      <span>Auto-saved at {lastSaved.toLocaleTimeString()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  showPreview 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <i className="ri-eye-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                Preview
              </button>
              <button
                onClick={() => handleSave('Draft')}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave('Published')}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                {template ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Form Fields & Merge Tags */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter template name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    >
                      <option value="Letter">Letter</option>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Task">Task</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
                      >
                        <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <i className="ri-close-line w-3 h-3 flex items-center justify-center"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Merge Fields Browser */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Merge Fields</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{filteredMergeFields.length} fields</span>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                    <input
                      type="text"
                      value={mergeFieldSearch}
                      onChange={(e) => setMergeFieldSearch(e.target.value)}
                      placeholder="Search merge fields..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value as any)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
                    >
                      <option value="all">All Sections</option>
                      <option value="client">Client</option>
                      <option value="lender">Lender</option>
                      <option value="matter">Matter</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showDefaultFields}
                        onChange={(e) => setShowDefaultFields(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Default Fields</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showCustomFields}
                        onChange={(e) => setShowCustomFields(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Custom Fields</span>
                    </label>
                  </div>
                </div>

                {/* Merge Fields List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(groupedFields).map(([section, fields]) => (
                    <div key={section}>
                      <div className="flex items-center space-x-2 mb-2">
                        <i className={`${getSectionIcon(section)} w-4 h-4 ${getSectionColor(section)} flex items-center justify-center`}></i>
                        <h4 className="font-medium text-gray-700 capitalize text-sm">{section}</h4>
                        <span className="text-xs text-gray-500">({fields.length})</span>
                      </div>
                      <div className="space-y-1 ml-6">
                        {fields.map((field) => (
                          <button
                            key={field.id}
                            onClick={() => insertMergeField(field)}
                            className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group border border-transparent"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 group-hover:text-blue-800 truncate">
                                  {field.label}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                  {`{{${field.syntax}}}`}
                                </div>
                                {field.description && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {field.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {field.isCustom && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-1 py-0.5 rounded">
                                    Custom
                                  </span>
                                )}
                                <i className="ri-add-line w-4 h-4 text-gray-400 group-hover:text-blue-600 flex items-center justify-center"></i>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMergeFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <i className="ri-search-line w-8 h-8 mx-auto mb-2 flex items-center justify-center"></i>
                    <p className="text-sm">No merge fields found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1 text-sm">How to Use</h4>
                  <p className="text-xs text-blue-800">
                    Click any merge field to insert it into your template content. Custom fields from the Custom Field Manager will appear here automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Content Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {showPreview ? 'Preview' : 'Template Content'}
                    </h3>
                    <div className="flex items-center space-x-4">
                      {showPreview && (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={showDummyData}
                            onChange={(e) => setShowDummyData(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Show dummy data</span>
                        </label>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{formData.content.length} characters</span>
                        {formData.type === 'SMS' && formData.content.length > 160 && (
                          <span className="text-red-600">• SMS limit exceeded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {showPreview ? (
                    <div className="prose max-w-none">
                      {formData.type === 'Email' && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>To:</strong> {showDummyData ? 'john.smith@email.com' : '{{client.email}}'}</div>
                            <div><strong>From:</strong> yourfirm@example.com</div>
                            <div><strong>Subject:</strong> {formData.name}</div>
                          </div>
                        </div>
                      )}
                      {formData.type === 'SMS' && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                          <div className="text-sm text-gray-600">
                            <strong>SMS to:</strong> {showDummyData ? '07123 456789' : '{{client.phone}}'}
                          </div>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border min-h-96">
                        {renderPreview() || 'No content to preview...'}
                      </div>
                      
                      {!showDummyData && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-start space-x-2">
                            <i className="ri-information-line w-4 h-4 text-yellow-600 flex items-center justify-center mt-0.5"></i>
                            <div>
                              <p className="text-sm text-yellow-800 font-medium">Preview without dummy data</p>
                              <p className="text-xs text-yellow-700">Merge fields will show as syntax. Enable "Show dummy data" to see a realistic preview.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Content *
                      </label>
                      <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder={`Enter your ${formData.type.toLowerCase()} template content here...\n\nUse merge fields from the left panel to personalize content.\n\nExample: Hello {{client.firstName}}, regarding matter {{matter.reference}}...`}
                        className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      />
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>Click merge fields on the left to insert them</span>
                        {formData.type === 'SMS' && (
                          <span className={formData.content.length > 160 ? 'text-red-600' : 'text-gray-500'}>
                            {formData.content.length}/160
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
