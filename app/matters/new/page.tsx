
'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import ClientCapture from '../../../components/ClientCapture';
import RiskAssessment from '../../../components/RiskAssessment';
import LenderInfo from '../../../components/LenderInfo';
import CustomFieldRenderer from '../../../components/CustomFieldRenderer';

export default function NewMatter() {
  const [formData, setFormData] = useState({
    fileReference: '',
    matterType: 'PPI',
    description: '',
    dateOpened: new Date().toISOString().split('T')[0],
    customFields: {}
  });

  const [clients, setClients] = useState([]);
  const [riskChecks, setRiskChecks] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Mock custom fields for matter - in real app, these would come from API
  const mockMatterCustomFields = [
    {
      id: '1',
      name: 'urgencyLevel',
      label: 'Urgency Level',
      type: 'dropdown' as const,
      section: 'matter' as const,
      required: false,
      options: ['Low', 'Medium', 'High', 'Critical'],
      mergeFieldSyntax: '{{matter.urgencyLevel}}',
      order: 1
    },
    {
      id: '2',
      name: 'estimatedValue',
      label: 'Estimated Case Value',
      type: 'text' as const,
      section: 'matter' as const,
      required: false,
      placeholder: '£0.00',
      mergeFieldSyntax: '{{matter.estimatedValue}}',
      order: 2
    },
    {
      id: '3',
      name: 'referralSource',
      label: 'Referral Source',
      type: 'dropdown' as const,
      section: 'matter' as const,
      required: false,
      options: ['Website', 'Recommendation', 'Advertisement', 'Previous Client', 'Other'],
      mergeFieldSyntax: '{{matter.referralSource}}',
      order: 3
    },
    {
      id: '4',
      name: 'targetCompletionDate',
      label: 'Target Completion Date',
      type: 'date' as const,
      section: 'matter' as const,
      required: false,
      mergeFieldSyntax: '{{matter.targetCompletionDate}}',
      order: 4
    },
    {
      id: '5',
      name: 'specialInstructions',
      label: 'Special Instructions',
      type: 'textarea' as const,
      section: 'matter' as const,
      required: false,
      placeholder: 'Any special instructions for handling this matter...',
      mergeFieldSyntax: '{{matter.specialInstructions}}',
      order: 5
    },
    {
      id: '6',
      name: 'isDdaCompliant',
      label: 'DDA Compliant',
      type: 'checkbox' as const,
      section: 'matter' as const,
      required: false,
      mergeFieldSyntax: '{{matter.isDdaCompliant}}',
      order: 6
    }
  ];

  const steps = [
    { id: 1, title: 'Matter Details', icon: 'ri-file-text-line' },
    { id: 2, title: 'Client Information', icon: 'ri-user-line' },
    { id: 3, title: 'Risk Assessment', icon: 'ri-shield-check-line' },
    { id: 4, title: 'Lender Information', icon: 'ri-bank-line' },
    { id: 5, title: 'Review & Submit', icon: 'ri-check-line' }
  ];

  const generateFileReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${formData.matterType}-${year}-${month}-${random}`;
  };

  const handleGenerateRef = () => {
    setFormData(prev => ({
      ...prev,
      fileReference: generateFileReference()
    }));
  };

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting matter:', {
      ...formData,
      clients,
      riskChecks,
      lenders
    });
    alert('Matter created successfully!');
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.fileReference && formData.description;
      case 2:
        return clients.length > 0;
      case 3:
        return riskChecks.every(check => check.completed);
      case 4:
        return lenders.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      <Header />

      <div className="px-2 sm:px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Create New Matter
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Set up a new legal matter with client and lender information
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center md:justify-center space-x-2 overflow-x-auto no-scrollbar py-1">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg
                    ${currentStep === step.id
                      ? 'bg-blue-900 text-white'
                      : currentStep > step.id
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <i className={`${step.icon} w-4 h-4`}></i>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <i className="ri-arrow-right-line mx-1 md:mx-2 text-gray-400 w-4 h-4"></i>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-6">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Matter Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* File Reference */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      File Reference *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.fileReference}
                        onChange={e => setFormData(prev => ({ ...prev, fileReference: e.target.value }))}
                        className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Enter file reference"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateRef}
                        className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  {/* Matter Type */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Matter Type *
                    </label>
                    <select
                      value={formData.matterType}
                      onChange={e => setFormData(prev => ({ ...prev, matterType: e.target.value }))}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                    >
                      <option value="PPI">PPI Claims</option>
                      <option value="PACKAGED">Packaged Bank Accounts</option>
                      <option value="MORTGAGE">Mortgage Mis-selling</option>
                      <option value="CREDIT">Credit Card Claims</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  {/* Date Opened */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Date Opened *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOpened}
                      onChange={e => setFormData(prev => ({ ...prev, dateOpened: e.target.value }))}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Matter Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      maxLength={500}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Describe the matter and key details..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                  </div>
                </div>

                {/* Custom Fields for Matter */}
                <CustomFieldRenderer
                  fields={mockMatterCustomFields}
                  section="matter"
                  values={formData.customFields}
                  onValueChange={handleCustomFieldChange}
                  collapsed={true}
                />
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <ClientCapture onClientsChange={setClients} />
            )}
            {/* STEP 3 */}
            {currentStep === 3 && (
              <RiskAssessment onRiskChecksChange={setRiskChecks} />
            )}
            {/* STEP 4 */}
            {currentStep === 4 && (
              <LenderInfo onLendersChange={setLenders} />
            )}
            {/* STEP 5 */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Review & Submit</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Matter Details</h3>
                      <p><strong>File Reference:</strong> {formData.fileReference}</p>
                      <p><strong>Type:</strong> {formData.matterType}</p>
                      <p><strong>Date Opened:</strong> {formData.dateOpened}</p>

                      {/* Custom Fields Summary */}
                      {Object.keys(formData.customFields).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-1">Custom Fields:</h4>
                          {Object.entries(formData.customFields).map(([key, value]) => {
                            const field = mockMatterCustomFields.find(f => f.name === key);
                            if (!field || !value) return null;
                            return (
                              <p key={key} className="text-xs sm:text-sm">
                                <strong>{field.label}:</strong> {value.toString()}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Clients ({clients.length})</h3>
                      {clients.map((client, index) => (
                        <p key={index} className="text-xs sm:text-sm">{client.fullName || 'Unnamed Client'}</p>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 lg:space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Risk Assessment</h3>
                      <p className="text-sm text-green-600">
                        {riskChecks.filter(check => check.completed).length}/{riskChecks.length} checks completed
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Lenders ({lenders.length})</h3>
                      {lenders.map((lender, index) => (
                        <p key={index} className="text-xs sm:text-sm">{lender.name || 'Unnamed Lender'}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center justify-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              <i className="ri-arrow-left-line w-4 h-4"></i>
              <span>Previous</span>
            </button>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNext()}
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer text-sm"
              >
                <span>Next</span>
                <i className="ri-arrow-right-line w-4 h-4"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 whitespace-nowrap cursor-pointer text-sm"
              >
                <i className="ri-check-line w-4 h-4"></i>
                <span>Create Matter</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
