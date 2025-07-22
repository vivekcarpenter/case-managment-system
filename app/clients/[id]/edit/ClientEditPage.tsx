'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import CustomFieldRenderer from '../../../../components/CustomFieldRenderer';
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
  customFields?: Record<string, any>;
  emergencyContact?: string;
  preferredContact?: string;
  vulnerabilityStatus?: string;
  specialRequirements?: string;
}

interface ClientEditPageProps {
  clientId: string;
}

export default function ClientEditPage({ clientId }: ClientEditPageProps) {
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const [availableTags] = useState([
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
  ]);

  // Mock custom fields
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

  // Mock client data
  const mockClient: Client = {
    id: clientId,
    fullName: 'Sarah Williams',
    dateOfBirth: '1985-03-15',
    email: 'sarah.williams@email.com',
    phone: '07123 456 789',
    address: '123 High Street, London, SW1A 1AA',
    matterReferences: ['PPI-2024-001'],
    lenderCount: 3,
    status: 'In Progress',
    lastUpdated: '2024-01-15T10:30:00Z',
    riskAssessmentComplete: true,
    tags: ['High Value', 'VIP'],
    customFields: {
      preferredContact: 'Email',
      vulnerabilityStatus: 'None',
      emergencyContact: 'John Williams - 07987 654 321',
      specialRequirements: 'Prefers email communication only'
    }
  };

  useEffect(() => {
    // Simulate API call to fetch client data
    setTimeout(() => {
      setClient(mockClient);
      setLoading(false);
    }, 500);
  }, [clientId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!client?.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!client?.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!client?.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!client?.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!client?.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update client data
      console.log('Saving client:', client);

      setHasChanges(false);

      // Show success message
      alert('Client updated successfully!');

      // Redirect back to clients page
      router.push('/clients');

    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        router.push('/clients');
      }
    } else {
      router.push('/clients');
    }
  };

  const updateClient = (field: keyof Client, value: any) => {
    if (!client) return;

    setClient(prev => ({
      ...prev!,
      [field]: value
    }));
    setHasChanges(true);
  };

  const updateCustomField = (fieldName: string, value: any) => {
    if (!client) return;

    setClient(prev => ({
      ...prev!,
      customFields: {
        ...prev!.customFields,
        [fieldName]: value
      }
    }));
    setHasChanges(true);
  };

  const toggleTag = (tag: string) => {
    if (!client) return;

    const newTags = client.tags.includes(tag)
      ? client.tags.filter(t => t !== tag)
      : [...client.tags, tag];

    updateClient('tags', newTags);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 5)} ${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 11)}`;
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Vulnerable':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High Value':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'VIP':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Priority':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Elderly':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Repeat':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Complex Case':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'New Client':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <i className="ri-user-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Client Not Found</h3>
              <p className="text-gray-500 mb-6">The client you're looking for doesn't exist or has been deleted.</p>
              <Link
                href="/clients"
                className="inline-flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#334960' }}
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                <span>Back to Clients</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Link
                    href="/clients"
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
                </div>
                <p className="text-gray-600">Update client information and settings</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: '#334960' }}
                >
                  {saving ? (
                    <>
                      <i className="ri-loader-4-line w-4 h-4 inline mr-2 animate-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line w-4 h-4 inline mr-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Client Information Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f46524' }}>
                <span className="text-white font-medium text-lg">
                  {client.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
                <p className="text-gray-600">Basic client details and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={client.fullName}
                  onChange={(e) => updateClient('fullName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={client.dateOfBirth}
                  onChange={(e) => updateClient('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={client.email}
                  onChange={(e) => updateClient('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="client@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={client.phone}
                  onChange={(e) => updateClient('phone', formatPhoneNumber(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="07123 456 789"
                  maxLength={13}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  value={client.address}
                  onChange={(e) => updateClient('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter full address including postcode"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Tags</h3>
            <p className="text-gray-600 mb-4">Select tags that apply to this client</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium border-2 transition-colors cursor-pointer ${client.tags.includes(tag) ? getTagColor(tag) : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                >
                  {tag}
                  {client.tags.includes(tag) && (
                    <i className="ri-check-line w-3 h-3 ml-1 inline-flex items-center justify-center"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="mb-6">
            <CustomFieldRenderer
              fields={mockCustomFields}
              section="client"
              values={client.customFields || {}}
              onValueChange={updateCustomField}
              collapsed={false}
            />
          </div>

          {/* Matter References */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Associated Matters</h3>
            <div className="space-y-3">
              {client.matterReferences.map((ref) => (
                <div key={ref} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="ri-file-text-line w-5 h-5 text-gray-400 flex items-center justify-center"></i>
                    <div>
                      <p className="font-medium text-gray-900">{ref}</p>
                      <p className="text-sm text-gray-500">PPI Claim Matter</p>
                    </div>
                  </div>
                  <Link
                    href={`/matters/${ref.split('-').pop()}`}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <i className="ri-external-link-line w-4 h-4 flex items-center justify-center"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Status
                </label>
                <select
                  value={client.status}
                  onChange={(e) => updateClient('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                >
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Signed">Signed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Assessment
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateClient('riskAssessmentComplete', !client.riskAssessmentComplete)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors cursor-pointer ${client.riskAssessmentComplete ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
                  >
                    <i className={`w-4 h-4 flex items-center justify-center ${client.riskAssessmentComplete ? 'ri-check-line' : 'ri-close-line'}`}></i>
                    <span className="text-sm font-medium">
                      {client.riskAssessmentComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
