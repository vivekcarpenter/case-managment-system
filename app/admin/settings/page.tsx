
'use client';

import { useState } from 'react';
import Header from '../../../components/Header';

interface SystemSettings {
  general: {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
      expirationDays: number;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorAuth: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    browserNotifications: boolean;
    digestFrequency: string;
    notificationTypes: {
      newMatter: boolean;
      statusChange: boolean;
      documentUpload: boolean;
      taskAssignment: boolean;
      paymentReceived: boolean;
      systemAlerts: boolean;
    };
  };
  userManagement: {
    defaultRole: string;
    autoApproveUsers: boolean;
    requireEmailVerification: boolean;
    allowSelfRegistration: boolean;
    maxUsers: number;
    roles: {
      id: string;
      name: string;
      description: string;
      permissions: string[];
    }[];
    users: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: 'active' | 'inactive' | 'pending';
      lastLogin: string;
      createdAt: string;
    }[];
  };
  customization: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
    customCss: string;
    headerText: string;
    footerText: string;
  };
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      companyName: 'Legal Solutions Ltd',
      companyEmail: 'info@legalsolutions.com',
      companyPhone: '+44 20 7123 4567',
      companyAddress: '123 Legal Street, London, EC1A 1BB',
      timezone: 'Europe/London',
      dateFormat: 'DD/MM/YYYY',
      currency: 'GBP',
      language: 'en-GB'
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: false,
        expirationDays: 90
      },
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      twoFactorAuth: false
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      browserNotifications: true,
      digestFrequency: 'daily',
      notificationTypes: {
        newMatter: true,
        statusChange: true,
        documentUpload: true,
        taskAssignment: true,
        paymentReceived: true,
        systemAlerts: true
      }
    },
    userManagement: {
      defaultRole: 'user',
      autoApproveUsers: false,
      requireEmailVerification: true,
      allowSelfRegistration: false,
      maxUsers: 50,
      roles: [
        {
          id: '1',
          name: 'Admin',
          description: 'Full system access and user management',
          permissions: ['all_access', 'user_management', 'system_settings', 'reports']
        },
        {
          id: '2',
          name: 'Manager',
          description: 'Manage matters and view reports',
          permissions: ['matter_management', 'reports', 'client_management']
        },
        {
          id: '3',
          name: 'User',
          description: 'Basic access to matters and clients',
          permissions: ['matter_view', 'client_view', 'document_upload']
        }
      ],
      users: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@legalsolutions.com',
          role: 'Admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T09:00:00Z'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@legalsolutions.com',
          role: 'Manager',
          status: 'active',
          lastLogin: '2024-01-15T14:20:00Z',
          createdAt: '2024-01-02T09:00:00Z'
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael.brown@legalsolutions.com',
          role: 'User',
          status: 'active',
          lastLogin: '2024-01-14T16:45:00Z',
          createdAt: '2024-01-03T09:00:00Z'
        },
        {
          id: '4',
          name: 'Emma Davis',
          email: 'emma.davis@legalsolutions.com',
          role: 'User',
          status: 'pending',
          lastLogin: '',
          createdAt: '2024-01-15T11:00:00Z'
        }
      ]
    },
    customization: {
      primaryColor: '#f46524',
      secondaryColor: '#334960',
      logo: 'logo',
      favicon: '/favicon.ico',
      customCss: '',
      headerText: 'Legal Solutions Management System',
      footerText: '© 2024 Legal Solutions Ltd. All rights reserved.'
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'ri-settings-line' },
    { id: 'security', label: 'Security', icon: 'ri-shield-check-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
    { id: 'userManagement', label: 'User Management', icon: 'ri-user-settings-line' },
    { id: 'customization', label: 'Customization', icon: 'ri-palette-line' }
  ];

  const timezones = [
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'MM-DD-YYYY'
  ];

  const currencies = [
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const languages = [
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' }
  ];

  const availablePermissions = [
    'all_access',
    'user_management',
    'system_settings',
    'reports',
    'matter_management',
    'client_management',
    'matter_view',
    'client_view',
    'document_upload',
    'document_management',
    'workflow_management',
    'template_management'
  ];

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedSettings = (section: keyof SystemSettings, nestedField: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...prev[section][nestedField],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date().toLocaleString('en-GB'));
      setHasChanges(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setHasChanges(false);
    }
  };

  const handleExportSettings = () => {
    const exportData = {
      ...settings,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Current User'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setHasChanges(true);
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // User Management functions
  const handleAddUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: 'New User',
      email: 'new.user@legalsolutions.com',
      role: 'User',
      status: 'pending' as const,
      lastLogin: '',
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...settings.userManagement.users, newUser];
    updateSettings('userManagement', 'users', updatedUsers);
  };

  const handleUpdateUser = (userId: string, updates: any) => {
    const updatedUsers = settings.userManagement.users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );
    updateSettings('userManagement', 'users', updatedUsers);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = settings.userManagement.users.filter(user => user.id !== userId);
      updateSettings('userManagement', 'users', updatedUsers);
    }
  };

  const handleAddRole = () => {
    const newRole = {
      id: Date.now().toString(),
      name: 'New Role',
      description: 'Role description',
      permissions: ['matter_view', 'client_view']
    };
    
    const updatedRoles = [...settings.userManagement.roles, newRole];
    updateSettings('userManagement', 'roles', updatedRoles);
  };

  const handleUpdateRole = (roleId: string, updates: any) => {
    const updatedRoles = settings.userManagement.roles.map(role =>
      role.id === roleId ? { ...role, ...updates } : role
    );
    updateSettings('userManagement', 'roles', updatedRoles);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      const updatedRoles = settings.userManagement.roles.filter(role => role.id !== roleId);
      updateSettings('userManagement', 'roles', updatedRoles);
    }
  };

  const togglePermission = (roleId: string, permission: string) => {
    const role = settings.userManagement.roles.find(r => r.id === roleId);
    if (role) {
      const updatedPermissions = role.permissions.includes(permission)
        ? role.permissions.filter(p => p !== permission)
        : [...role.permissions, permission];
      
      handleUpdateRole(roleId, { permissions: updatedPermissions });
    }
  };

  const formatDateTime = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleString('en-GB') : 'Never';
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
                <p className="text-gray-600">Configure system preferences and administrative settings</p>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                  id="import-settings"
                />
                <label
                  htmlFor="import-settings"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-upload-line w-4 h-4 flex items-center justify-center"></i>
                  <span>Import</span>
                </label>
                <button
                  onClick={handleExportSettings}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                  <span>Export</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
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
            {lastSaved && (
              <p className="text-sm text-green-600 mt-2">
                Last saved: {lastSaved}
              </p>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'text-white border-b-2'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={activeTab === tab.id ? { borderBottomColor: '#f46524', color: '#f46524' } : {}}
                  >
                    <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={settings.general.companyName}
                        onChange={(e) => updateSettings('general', 'companyName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                      <input
                        type="email"
                        value={settings.general.companyEmail}
                        onChange={(e) => updateSettings('general', 'companyEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                      <input
                        type="tel"
                        value={settings.general.companyPhone}
                        onChange={(e) => updateSettings('general', 'companyPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        {timezones.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select
                        value={settings.general.dateFormat}
                        onChange={(e) => updateSettings('general', 'dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        {dateFormats.map(format => (
                          <option key={format} value={format}>{format}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => updateSettings('general', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSettings('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                    <textarea
                      value={settings.general.companyAddress}
                      onChange={(e) => updateSettings('general', 'companyAddress', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Password Policy</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
                        <input
                          type="number"
                          value={settings.security.passwordPolicy.minLength}
                          onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="4"
                          max="32"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiration (days)</label>
                        <input
                          type="number"
                          value={settings.security.passwordPolicy.expirationDays}
                          onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'expirationDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireUppercase}
                          onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require uppercase letters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireLowercase}
                          onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireLowercase', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require lowercase letters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireNumbers}
                          onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require numbers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.security.passwordPolicy.requireSymbols}
                          onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireSymbols', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require symbols</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Session & Authentication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                        <input
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          value={settings.security.lockoutDuration}
                          onChange={(e) => updateSettings('security', 'lockoutDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => updateSettings('security', 'twoFactorAuth', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Global Notification Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => updateSettings('notifications', 'emailNotifications', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Email Notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => updateSettings('notifications', 'smsNotifications', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">SMS Notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.browserNotifications}
                          onChange={(e) => updateSettings('notifications', 'browserNotifications', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Browser Notifications</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Digest Frequency</label>
                      <select
                        value={settings.notifications.digestFrequency}
                        onChange={(e) => updateSettings('notifications', 'digestFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Notification Types</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationTypes.newMatter}
                          onChange={(e) => updateNestedSettings('notifications', 'notificationTypes', 'newMatter', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">New Matter Created</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationTypes.statusChange}
                          onChange={(e) => updateNestedSettings('notifications', 'notificationTypes', 'statusChange', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Status Changes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationTypes.documentUpload}
                          onChange={(e) => updateNestedSettings('notifications', 'notificationTypes', 'documentUpload', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Document Uploads</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationTypes.taskAssignment}
                          onChange={(e) => updateNestedSettings('notifications', 'notificationTypes', 'taskAssignment', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Task Assignments</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationTypes.paymentReceived}
                          onChange={(e) => updateNestedSettings('notifications', 'notificationTypes', 'paymentReceived', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Payment Received</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.notificationTypes.systemAlerts}
                          onChange={(e) => updateNestedSettings('notifications', 'notificationTypes', 'systemAlerts', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">System Alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'userManagement' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  
                  {/* User Settings */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">User Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Role</label>
                        <select
                          value={settings.userManagement.defaultRole}
                          onChange={(e) => updateSettings('userManagement', 'defaultRole', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                        >
                          {settings.userManagement.roles.map(role => (
                            <option key={role.id} value={role.name.toLowerCase()}>{role.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Users</label>
                        <input
                          type="number"
                          value={settings.userManagement.maxUsers}
                          onChange={(e) => updateSettings('userManagement', 'maxUsers', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.userManagement.autoApproveUsers}
                          onChange={(e) => updateSettings('userManagement', 'autoApproveUsers', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Auto-approve new users</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.userManagement.requireEmailVerification}
                          onChange={(e) => updateSettings('userManagement', 'requireEmailVerification', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Require email verification</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.userManagement.allowSelfRegistration}
                          onChange={(e) => updateSettings('userManagement', 'allowSelfRegistration', e.target.checked)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Allow self-registration</span>
                      </label>
                    </div>
                  </div>

                  {/* User List */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Users ({settings.userManagement.users.length})</h4>
                      <button
                        onClick={handleAddUser}
                        className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-add-line w-4 h-4 mr-2 inline-flex items-center justify-center"></i>
                        Add User
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Last Login</th>
                            <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {settings.userManagement.users.map(user => (
                            <tr key={user.id}>
                              <td className="py-3 px-6">
                                <input
                                  type="text"
                                  value={user.name}
                                  onChange={(e) => handleUpdateUser(user.id, { name: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </td>
                              <td className="py-3 px-6">
                                <input
                                  type="email"
                                  value={user.email}
                                  onChange={(e) => handleUpdateUser(user.id, { email: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </td>
                              <td className="py-3 px-6">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                                >
                                  {settings.userManagement.roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3 px-6">
                                <select
                                  value={user.status}
                                  onChange={(e) => handleUpdateUser(user.id, { status: e.target.value })}
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                  <option value="pending">Pending</option>
                                </select>
                              </td>
                              <td className="py-3 px-6 text-sm text-gray-500">
                                {formatDateTime(user.lastLogin)}
                              </td>
                              <td className="py-3 px-6">
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                >
                                  <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Roles Management */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Roles & Permissions</h4>
                      <button
                        onClick={handleAddRole}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-add-line w-4 h-4 mr-2 inline-flex items-center justify-center"></i>
                        Add Role
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      {settings.userManagement.roles.map(role => (
                        <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input
                                  type="text"
                                  value={role.name}
                                  onChange={(e) => handleUpdateRole(role.id, { name: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                  type="text"
                                  value={role.description}
                                  onChange={(e) => handleUpdateRole(role.id, { description: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="ml-4 text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {availablePermissions.map(permission => (
                                <label key={permission} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={role.permissions.includes(permission)}
                                    onChange={() => togglePermission(role.id, permission)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                  />
                                  <span className="text-sm text-gray-700 capitalize">
                                    {permission.replace(/_/g, ' ')}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customization' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Customization Settings</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Brand Colors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={settings.customization.primaryColor}
                            onChange={(e) => updateSettings('customization', 'primaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.customization.primaryColor}
                            onChange={(e) => updateSettings('customization', 'primaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={settings.customization.secondaryColor}
                            onChange={(e) => updateSettings('customization', 'secondaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.customization.secondaryColor}
                            onChange={(e) => updateSettings('customization', 'secondaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Branding</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
                        <input
                          type="text"
                          value={settings.customization.logo}
                          onChange={(e) => updateSettings('customization', 'logo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
                        <input
                          type="text"
                          value={settings.customization.headerText}
                          onChange={(e) => updateSettings('customization', 'headerText', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                        <input
                          type="text"
                          value={settings.customization.footerText}
                          onChange={(e) => updateSettings('customization', 'footerText', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Custom CSS</h4>
                    <textarea
                      value={settings.customization.customCss}
                      onChange={(e) => updateSettings('customization', 'customCss', e.target.value)}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="/* Add your custom CSS here */"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Status */}
          {hasChanges && (
            <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <i className="ri-information-line w-5 h-5 text-yellow-600 flex items-center justify-center"></i>
                <span className="text-sm text-yellow-700">You have unsaved changes</span>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 cursor-pointer"
                >
                  Save Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
