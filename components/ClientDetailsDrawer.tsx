
'use client';

import { useEffect, useState } from 'react';
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

interface ClientDetailsDrawerProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientDetailsDrawer({ client, isOpen, onClose }: ClientDetailsDrawerProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [clientTags, setClientTags] = useState<string[]>([]);

  const availableTags = [
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
  ];

  useEffect(() => {
    if (client) {
      setClientTags(client.tags || []);
    }
  }, [client]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!client) return null;

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

  const handleAddTag = (tag: string) => {
    if (!clientTags.includes(tag)) {
      setClientTags([...clientTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setClientTags(clientTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (newTag.trim() && !clientTags.includes(newTag.trim())) {
      setClientTags([...clientTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSaveTags = () => {
    // In real implementation, save to backend
    console.log('Saving tags for client:', client.id, clientTags);
    setIsEditingTags(false);
  };

  const mockLenders = [
    { name: 'Barclays Bank PLC', debtAmount: '£12,450.00', status: 'Active' },
    { name: 'HSBC UK Bank PLC', debtAmount: '£8,920.00', status: 'Pending' },
    { name: 'Lloyds Banking Group', debtAmount: '£15,670.00', status: 'Active' }
  ];

  const mockRiskChecks = [
    { name: 'Conflict Check', completed: true },
    { name: 'In-firm Expertise', completed: true },
    { name: 'Client Eligibility', completed: client.riskAssessmentComplete },
    { name: 'Not Already Submitted', completed: true }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Client Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Client Info */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-900 font-semibold text-lg">
                    {client.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.fullName}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                    {client.riskAssessmentComplete ? (
                      <span className="flex items-center space-x-1 text-green-600">
                        <i className="ri-check-line w-3 h-3 flex items-center justify-center"></i>
                        <span className="text-xs">Risk Complete</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-red-600">
                        <i className="ri-close-line w-3 h-3 flex items-center justify-center"></i>
                        <span className="text-xs">Risk Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Tags */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Client Tags</h4>
                <button
                  onClick={() => setIsEditingTags(!isEditingTags)}
                  className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                >
                  {isEditingTags ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {isEditingTags ? (
                <div className="space-y-4">
                  {/* Current Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {clientTags.map(tag => (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-current hover:text-red-600 cursor-pointer"
                          >
                            <i className="ri-close-line w-3 h-3 flex items-center justify-center"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Available Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.filter(tag => !clientTags.includes(tag)).map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 hover:bg-gray-50 cursor-pointer ${getTagColor(tag)}`}
                        >
                          <i className="ri-add-line w-3 h-3 mr-1 flex items-center justify-center"></i>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Tag */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Tag</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter tag name..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                      />
                      <button
                        onClick={handleAddCustomTag}
                        className="px-3 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 cursor-pointer"
                      >
                        <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>

                  {/* Save Tags */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditingTags(false)}
                      className="px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTags}
                      className="px-3 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 cursor-pointer"
                    >
                      Save Tags
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {clientTags.map(tag => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {clientTags.length === 0 && (
                    <span className="text-sm text-gray-500 italic">No tags assigned</span>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <i className="ri-mail-line w-4 h-4 text-gray-400 mt-0.5 flex items-center justify-center"></i>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-phone-line w-4 h-4 text-gray-400 mt-0.5 flex items-center justify-center"></i>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-map-pin-line w-4 h-4 text-gray-400 mt-0.5 flex items-center justify-center"></i>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{client.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-calendar-line w-4 h-4 text-gray-400 mt-0.5 flex items-center justify-center"></i>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-gray-900">{formatDate(client.dateOfBirth)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Matters */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Associated Matters</h4>
              <div className="space-y-2">
                {client.matterReferences.map((ref) => (
                  <Link
                    key={ref}
                    href={`/matters/${ref.split('-').pop()}`}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-blue-900">{ref}</p>
                      <p className="text-sm text-gray-500">PPI Claim</p>
                    </div>
                    <i className="ri-arrow-right-line w-4 h-4 text-gray-400 flex items-center justify-center"></i>
                  </Link>
                ))}
              </div>
            </div>

            {/* Risk Assessment Status */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
              <div className="space-y-2">
                {mockRiskChecks.map((check) => (
                  <div key={check.name} className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-700">{check.name}</span>
                    {check.completed ? (
                      <i className="ri-check-line w-4 h-4 text-green-600 flex items-center justify-center"></i>
                    ) : (
                      <i className="ri-close-line w-4 h-4 text-red-600 flex items-center justify-center"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Lenders Summary */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Lenders</h4>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  <i className="ri-building-line w-3 h-3 mr-1 flex items-center justify-center"></i>
                  {client.lenderCount}
                </span>
              </div>
              <div className="space-y-2">
                {mockLenders.map((lender, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{lender.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lender.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lender.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Debt: {lender.debtAmount}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Last Updated */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <i className="ri-time-line w-4 h-4 text-gray-400 flex items-center justify-center"></i>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{formatDateTime(client.lastUpdated)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <Link
              href={`/clients/${client.id}/edit`}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
            >
              <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
              <span>Edit Client</span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                <span>Email</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                <i className="ri-phone-line w-4 h-4 flex items-center justify-center"></i>
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
