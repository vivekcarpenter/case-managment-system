
'use client';

import Header from '../components/Header';
import GlobalSearch from '../components/GlobalSearch';
import Link from 'next/link';

export default function Home() {
  const quickActions = [
    {
      title: 'New Matter',
      description: 'Create a new legal matter',
      href: '/matters/new',
      icon: 'ri-add-circle-line',
      color: 'bg-blue-900 hover:bg-blue-800'
    },
    {
      title: 'View All Matters',
      description: 'Browse existing matters',
      href: '/matters',
      icon: 'ri-folder-line',
      color: 'bg-green-700 hover:bg-green-800'
    },
    {
      title: 'Client Management',
      description: 'Manage client information',
      href: '/clients',
      icon: 'ri-user-line',
      color: 'bg-purple-700 hover:bg-purple-800'
    },
    {
      title: 'Templates',
      description: 'Manage letter templates',
      href: '/templates',
      icon: 'ri-file-text-line',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      title: 'Reports',
      description: 'View reports and analytics',
      href: '/reports',
      icon: 'ri-bar-chart-line',
      color: 'bg-teal-600 hover:bg-teal-700'
    },
    {
      title: 'User Management',
      description: 'Manage system users',
      href: '/users',
      icon: 'ri-team-line',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  const recentMatters = [
    {
      id: '1',
      fileRef: 'PPI-2024-001',
      client: 'Sarah Williams',
      status: 'Active',
      lastActivity: 'Today',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: '2',
      fileRef: 'PPI-2024-002',
      client: 'Michael Johnson',
      status: 'Pending Review',
      lastActivity: 'Yesterday',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: '3',
      fileRef: 'PPI-2024-003',
      client: 'Emma Thompson',
      status: 'Completed',
      lastActivity: '2 days ago',
      statusColor: 'bg-gray-100 text-gray-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Case Management System
            </h1>
            <p className="text-gray-600">
              Manage clients, matters, lenders, and generate letters efficiently
            </p>
          </div>

          <div className="mb-8">
            <GlobalSearch />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      className={`${action.color} text-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <i className={`${action.icon} w-6 h-6 text-white group-hover:scale-110 transition-transform flex items-center justify-center`}></i>
                        <h3 className="font-semibold whitespace-nowrap">{action.title}</h3>
                      </div>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Matters</h2>
                <div className="space-y-4">
                  {recentMatters.map((matter) => (
                    <Link
                      key={matter.id}
                      href={`/matters/${matter.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">{matter.fileRef}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${matter.statusColor}`}>
                          {matter.status}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{matter.client}</p>
                      <p className="text-sm text-gray-500">{matter.lastActivity}</p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/matters"
                  className="block mt-4 text-center py-2 text-blue-900 hover:text-blue-700 font-medium cursor-pointer"
                >
                  View All Matters →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
