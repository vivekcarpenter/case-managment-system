'use client';

import { useState } from 'react';

interface ExtractionField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  isEditable: boolean;
  fieldType: 'text' | 'amount' | 'date' | 'select';
  options?: string[];
}

interface DocumentExtractionProps {
  documentId: string;
  documentName: string;
  onSave: (fields: ExtractionField[]) => void;
  onCancel: () => void;
}

export default function DocumentExtraction({ 
  documentId, 
  documentName, 
  onSave, 
  onCancel 
}: DocumentExtractionProps) {
  const [extractedFields, setExtractedFields] = useState<ExtractionField[]>([
    {
      id: 'client_name',
      label: 'Client Name',
      value: 'Sarah Williams',
      confidence: 0.95,
      isEditable: true,
      fieldType: 'text'
    },
    {
      id: 'lender_name',
      label: 'Lender Name',
      value: 'Barclays Bank PLC',
      confidence: 0.92,
      isEditable: true,
      fieldType: 'select',
      options: ['Barclays Bank PLC', 'HSBC UK Bank PLC', 'Lloyds Banking Group', 'Santander UK', 'Other']
    },
    {
      id: 'account_number',
      label: 'Account Number',
      value: '12345678',
      confidence: 0.88,
      isEditable: true,
      fieldType: 'text'
    },
    {
      id: 'refund_amount',
      label: 'Refund Amount',
      value: '£2,450.00',
      confidence: 0.91,
      isEditable: true,
      fieldType: 'amount'
    },
    {
      id: 'document_date',
      label: 'Document Date',
      value: '2024-01-15',
      confidence: 0.89,
      isEditable: true,
      fieldType: 'date'
    },
    {
      id: 'policy_number',
      label: 'Policy Number',
      value: 'PPI-789123',
      confidence: 0.76,
      isEditable: true,
      fieldType: 'text'
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const updateField = (fieldId: string, newValue: string) => {
    setExtractedFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, value: newValue } : field
    ));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return 'ri-check-line';
    if (confidence >= 0.7) return 'ri-alert-line';
    return 'ri-error-warning-line';
  };

  const handleSave = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(extractedFields);
    setIsProcessing(false);
  };

  const reprocessDocument = async () => {
    setIsProcessing(true);
    
    // Simulate reprocessing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update with new mock data
    setExtractedFields(prev => prev.map(field => ({
      ...field,
      confidence: Math.min(1, field.confidence + 0.1) // Slightly improve confidence
    })));
    
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Document Extraction</h3>
          <p className="text-sm text-gray-600">{documentName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={reprocessDocument}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <i className={`${isProcessing ? 'ri-loader-line animate-spin' : 'ri-refresh-line'} w-4 h-4 flex items-center justify-center`}></i>
            <span>Reprocess</span>
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-save-line w-4 h-4 flex items-center justify-center"></i>
            <span>Save & Link</span>
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-blue-800 font-medium">Processing document...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {extractedFields.map((field) => (
          <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(field.confidence)}`}>
                  <i className={`${getConfidenceIcon(field.confidence)} w-3 h-3 inline mr-1`}></i>
                  {Math.round(field.confidence * 100)}%
                </span>
              </div>
            </div>

            {field.fieldType === 'select' ? (
              <select
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.fieldType === 'date' ? (
              <input
                type="date"
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            ) : (
              <input
                type={field.fieldType === 'amount' ? 'text' : 'text'}
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}

            {field.confidence < 0.8 && (
              <div className="mt-2 flex items-center space-x-2 text-xs text-amber-600">
                <i className="ri-alert-line w-3 h-3 flex items-center justify-center"></i>
                <span>Low confidence - please verify</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Auto-linking Preview */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">Auto-linking Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <i className="ri-user-line w-4 h-4 text-green-600 flex items-center justify-center"></i>
            <span className="text-green-700">
              Will link to client: <strong>{extractedFields.find(f => f.id === 'client_name')?.value}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-bank-line w-4 h-4 text-green-600 flex items-center justify-center"></i>
            <span className="text-green-700">
              Will link to lender: <strong>{extractedFields.find(f => f.id === 'lender_name')?.value}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-file-text-line w-4 h-4 text-green-600 flex items-center justify-center"></i>
            <span className="text-green-700">
              Will update matter with extracted refund amount
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}