
'use client';

import { useState } from 'react';
import CustomFieldRenderer from './CustomFieldRenderer';

interface Client {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  dateOfBirth: string;
  email: string;
  customFields?: Record<string, any>;
}

interface ClientCaptureProps {
  onClientsChange?: (clients: Client[]) => void;
}

export default function ClientCapture({ onClientsChange }: ClientCaptureProps) {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      fullName: '',
      address: '',
      phone: '',
      dateOfBirth: '',
      email: '',
      customFields: {}
    }
  ]);

  const [expandedClient, setExpandedClient] = useState<string>('1');

  // Mock custom fields - in real app, these would come from API
  const mockCustomFields = [
    {
      id: '1',
      name: 'preferredContact',
      label: 'Preferred Contact Method',
      type: 'dropdown' as const,
      section: 'client' as const,
      required: false,
      options: ['Email', 'Phone', 'SMS', 'Letter'],
      mergeFieldSyntax: '{{client.preferredContact}}',
      order: 1
    },
    {
      id: '2',
      name: 'vulnerabilityStatus',
      label: 'Vulnerability Status',
      type: 'dropdown' as const,
      section: 'client' as const,
      required: false,
      options: ['None', 'Mental Health', 'Disability', 'Elderly', 'Financial Hardship'],
      mergeFieldSyntax: '{{client.vulnerabilityStatus}}',
      order: 2
    },
    {
      id: '3',
      name: 'emergencyContact',
      label: 'Emergency Contact',
      type: 'text' as const,
      section: 'client' as const,
      required: false,
      placeholder: 'Name and phone number',
      mergeFieldSyntax: '{{client.emergencyContact}}',
      order: 3
    },
    {
      id: '4',
      name: 'specialRequirements',
      label: 'Special Requirements',
      type: 'textarea' as const,
      section: 'client' as const,
      required: false,
      placeholder: 'Any special requirements or notes...',
      mergeFieldSyntax: '{{client.specialRequirements}}',
      order: 4
    }
  ];

  const addClient = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      fullName: '',
      address: '',
      phone: '',
      dateOfBirth: '',
      email: '',
      customFields: {}
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    setExpandedClient(newClient.id);
    onClientsChange?.(updatedClients);
  };

  const removeClient = (id: string) => {
    if (clients.length === 1) return;
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    onClientsChange?.(updatedClients);
  };

  const updateClient = (id: string, field: keyof Client, value: string) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, [field]: value } : client
    );
    setClients(updatedClients);
    onClientsChange?.(updatedClients);
  };

  const updateCustomField = (clientId: string, fieldName: string, value: any) => {
    const updatedClients = clients.map(client =>
      client.id === clientId 
        ? { 
            ...client, 
            customFields: { 
              ...client.customFields, 
              [fieldName]: value 
            } 
          } 
        : client
    );
    setClients(updatedClients);
    onClientsChange?.(updatedClients);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 5)} ${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 11)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
        <button
          onClick={addClient}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line w-4 h-4"></i>
          <span>Add Joint Client</span>
        </button>
      </div>

      {clients.map((client, index) => (
        <div key={client.id} className="bg-gray-50 rounded-lg border border-gray-200">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setExpandedClient(expandedClient === client.id ? '' : client.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                {index === 0 ? 'Primary Client' : `Joint Client ${index}`}
              </span>
              <span className="font-medium text-gray-900">
                {client.fullName || 'Unnamed Client'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {clients.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeClient(client.id);
                  }}
                  className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                >
                  <i className="ri-delete-bin-line w-4 h-4"></i>
                </button>
              )}
              <i className={`ri-arrow-${expandedClient === client.id ? 'up' : 'down'}-s-line w-4 h-4 text-gray-400`}></i>
            </div>
          </div>

          {expandedClient === client.id && (
            <div className="px-4 pb-4 border-t border-gray-200 pt-4 space-y-6">
              {/* Standard Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={client.fullName}
                    onChange={(e) => updateClient(client.id, 'fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={client.phone}
                    onChange={(e) => updateClient(client.id, 'phone', formatPhoneNumber(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="07123 456 789"
                    maxLength={13}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={client.dateOfBirth}
                    onChange={(e) => updateClient(client.id, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => updateClient(client.id, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="client@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={client.address}
                    onChange={(e) => updateClient(client.id, 'address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter full address including postcode"
                  />
                </div>
              </div>

              {/* Custom Fields */}
              <CustomFieldRenderer
                fields={mockCustomFields}
                section="client"
                values={client.customFields || {}}
                onValueChange={(fieldName, value) => updateCustomField(client.id, fieldName, value)}
                collapsed={true}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
