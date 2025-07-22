
'use client';

import { useState } from 'react';
import CustomFieldRenderer from './CustomFieldRenderer';

interface Lender {
  id: string;
  name: string;
  address: string;
  accountNo: string;
  debtAmount: string;
  refundAmount: string;
  refundsReceived: string;
  paymentPlan: string;
  deductionPercentage: number;
  customFields?: Record<string, any>;
}

interface LenderInfoProps {
  onLendersChange?: (lenders: Lender[]) => void;
}

export default function LenderInfo({ onLendersChange }: LenderInfoProps) {
  const [lenders, setLenders] = useState<Lender[]>([
    {
      id: '1',
      name: '',
      address: '',
      accountNo: '',
      debtAmount: '',
      refundAmount: '',
      refundsReceived: '',
      paymentPlan: '',
      deductionPercentage: 25,
      customFields: {}
    }
  ]);

  const [expandedLender, setExpandedLender] = useState<string>('1');

  // Mock custom fields - in real app, these would come from API
  const mockCustomFields = [
    {
      id: '1',
      name: 'loanStartDate',
      label: 'Loan Start Date',
      type: 'date' as const,
      section: 'lender' as const,
      required: true,
      mergeFieldSyntax: '{{lender.loanStartDate}}',
      order: 1
    },
    {
      id: '2',
      name: 'loanEndDate',
      label: 'Loan End Date',
      type: 'date' as const,
      section: 'lender' as const,
      required: false,
      mergeFieldSyntax: '{{lender.loanEndDate}}',
      order: 2
    },
    {
      id: '3',
      name: 'interestRate',
      label: 'Interest Rate (%)',
      type: 'number' as const,
      section: 'lender' as const,
      required: false,
      placeholder: '15.9',
      mergeFieldSyntax: '{{lender.interestRate}}',
      order: 3
    },
    {
      id: '4',
      name: 'loanType',
      label: 'Loan Type',
      type: 'dropdown' as const,
      section: 'lender' as const,
      required: false,
      options: ['Personal Loan', 'Credit Card', 'Mortgage', 'Car Loan', 'Store Card', 'Other'],
      mergeFieldSyntax: '{{lender.loanType}}',
      order: 4
    },
    {
      id: '5',
      name: 'monthlyPayment',
      label: 'Monthly Payment Amount',
      type: 'text' as const,
      section: 'lender' as const,
      required: false,
      placeholder: '£250.00',
      mergeFieldSyntax: '{{lender.monthlyPayment}}',
      order: 5
    },
    {
      id: '6',
      name: 'ppiSold',
      label: 'PPI Sold',
      type: 'checkbox' as const,
      section: 'lender' as const,
      required: false,
      mergeFieldSyntax: '{{lender.ppiSold}}',
      order: 6
    },
    {
      id: '7',
      name: 'additionalNotes',
      label: 'Additional Notes',
      type: 'textarea' as const,
      section: 'lender' as const,
      required: false,
      placeholder: 'Any additional information about this lender...',
      mergeFieldSyntax: '{{lender.additionalNotes}}',
      order: 7
    }
  ];

  const addLender = () => {
    if (lenders.length >= 10) return;
    
    const newLender: Lender = {
      id: Date.now().toString(),
      name: '',
      address: '',
      accountNo: '',
      debtAmount: '',
      refundAmount: '',
      refundsReceived: '',
      paymentPlan: '',
      deductionPercentage: 25,
      customFields: {}
    };
    const updatedLenders = [...lenders, newLender];
    setLenders(updatedLenders);
    setExpandedLender(newLender.id);
    onLendersChange?.(updatedLenders);
  };

  const removeLender = (id: string) => {
    if (lenders.length === 1) return;
    const updatedLenders = lenders.filter(lender => lender.id !== id);
    setLenders(updatedLenders);
    onLendersChange?.(updatedLenders);
  };

  const updateLender = (id: string, field: keyof Lender, value: string | number) => {
    const updatedLenders = lenders.map(lender =>
      lender.id === id ? { ...lender, [field]: value } : lender
    );
    setLenders(updatedLenders);
    onLendersChange?.(updatedLenders);
  };

  const updateCustomField = (lenderId: string, fieldName: string, value: any) => {
    const updatedLenders = lenders.map(lender =>
      lender.id === lenderId 
        ? { 
            ...lender, 
            customFields: { 
              ...lender.customFields, 
              [fieldName]: value 
            } 
          } 
        : lender
    );
    setLenders(updatedLenders);
    onLendersChange?.(updatedLenders);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d.]/g, '');
    return numbers;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lender Information</h3>
          <p className="text-sm text-gray-600">Add up to 10 lenders for this matter</p>
        </div>
        <button
          onClick={addLender}
          disabled={lenders.length >= 10}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line w-4 h-4"></i>
          <span>Add Lender ({lenders.length}/10)</span>
        </button>
      </div>

      {lenders.map((lender, index) => (
        <div key={lender.id} className="bg-gray-50 rounded-lg border border-gray-200">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setExpandedLender(expandedLender === lender.id ? '' : lender.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                Lender {index + 1} of {lenders.length}
              </span>
              <span className="font-medium text-gray-900">
                {lender.name || 'Unnamed Lender'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {lenders.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLender(lender.id);
                  }}
                  className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                >
                  <i className="ri-delete-bin-line w-4 h-4"></i>
                </button>
              )}
              <i className={`ri-arrow-${expandedLender === lender.id ? 'up' : 'down'}-s-line w-4 h-4 text-gray-400`}></i>
            </div>
          </div>

          {expandedLender === lender.id && (
            <div className="px-4 pb-4 border-t border-gray-200 pt-4 space-y-6">
              {/* Standard Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lender Name *
                  </label>
                  <input
                    type="text"
                    value={lender.name}
                    onChange={(e) => updateLender(lender.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter lender name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={lender.accountNo}
                    onChange={(e) => updateLender(lender.id, 'accountNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Debt Amount (£)
                  </label>
                  <input
                    type="text"
                    value={lender.debtAmount}
                    onChange={(e) => updateLender(lender.id, 'debtAmount', formatCurrency(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refund Amount (£)
                  </label>
                  <input
                    type="text"
                    value={lender.refundAmount}
                    onChange={(e) => updateLender(lender.id, 'refundAmount', formatCurrency(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lender Address
                  </label>
                  <textarea
                    value={lender.address}
                    onChange={(e) => updateLender(lender.id, 'address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter lender address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refunds Received
                  </label>
                  <textarea
                    value={lender.refundsReceived}
                    onChange={(e) => updateLender(lender.id, 'refundsReceived', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Details of any refunds already received"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Plan Details
                  </label>
                  <textarea
                    value={lender.paymentPlan}
                    onChange={(e) => updateLender(lender.id, 'paymentPlan', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Current payment plan arrangements"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deduction Percentage: {lender.deductionPercentage}%
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      value={lender.deductionPercentage}
                      onChange={(e) => updateLender(lender.id, 'deductionPercentage', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={lender.deductionPercentage}
                      onChange={(e) => updateLender(lender.id, 'deductionPercentage', parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <CustomFieldRenderer
                fields={mockCustomFields}
                section="lender"
                values={lender.customFields || {}}
                onValueChange={(fieldName, value) => updateCustomField(lender.id, fieldName, value)}
                collapsed={true}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
