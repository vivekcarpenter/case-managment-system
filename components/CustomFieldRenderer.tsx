'use client';

import { useState } from 'react';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'dropdown' | 'textarea' | 'checkbox';
  section: 'client' | 'lender' | 'matter';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  mergeFieldSyntax: string;
  order: number;
}

interface CustomFieldRendererProps {
  fields: CustomField[];
  section: 'client' | 'lender' | 'matter';
  values: Record<string, any>;
  onValueChange: (fieldName: string, value: any) => void;
  collapsed?: boolean;
}

export default function CustomFieldRenderer({
  fields,
  section,
  values,
  onValueChange,
  collapsed = true
}: CustomFieldRendererProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const sectionFields = fields
    .filter(field => field.section === section)
    .sort((a, b) => a.order - b.order);

  if (sectionFields.length === 0) return null;

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'client': return 'Additional Client Information';
      case 'lender': return 'Additional Lender Information';
      case 'matter': return 'Additional Matter Information';
      default: return 'Custom Fields';
    }
  };

  const renderField = (field: CustomField) => {
    const value = values[field.name] || field.defaultValue || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onValueChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onValueChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onValueChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onValueChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        );

      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => onValueChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => onValueChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {field.placeholder || `Enable ${field.label}`}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-3">
          <i className="ri-settings-3-line w-4 h-4 text-gray-400 flex items-center justify-center"></i>
          <h3 className="text-lg font-semibold text-gray-900">
            {getSectionTitle(section)}
          </h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {sectionFields.length} field{sectionFields.length !== 1 ? 's' : ''}
          </span>
        </div>
        <i className={`ri-arrow-${isCollapsed ? 'down' : 'up'}-s-line w-4 h-4 text-gray-400 flex items-center justify-center`}></i>
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionFields.map((field) => (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {field.type === 'textarea' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {(values[field.name] || '').length}/500 characters
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Field Information */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Available Merge Fields</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {sectionFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {field.mergeFieldSyntax}
                  </code>
                  <span className="text-blue-700">{field.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}