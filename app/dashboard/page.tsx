
'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Link from 'next/link';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('30');

  const stats = [
    {
      title: 'Total Matters',
      value: '247',
      change: '+12',
      changeType: 'increase',
      icon: 'ri-briefcase-line',
      color: 'blue'
    },
    {
      title: 'Active Clients',
      value: '189',
      change: '+8',
      changeType: 'increase',
      icon: 'ri-user-line',
      color: 'green'
    },
    {
      title: 'Total Refunds',
      value: '£2.4M',
      change: '+£180K',
      changeType: 'increase',
      icon: 'ri-money-pound-circle-line',
      color: 'purple'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5',
      changeType: 'decrease',
      icon: 'ri-time-line',
      color: 'orange'
    }
  ];

  const recentMatters = [
    {
      id: '1',
      fileRef: 'PPI-2024-045',
      client: 'Sarah Mitchell',
      type: 'PPI Claims',
      status: 'Active',
      dateCreated: '2024-01-20',
      lastActivity: '2 hours ago',
      refundAmount: '£4,500'
    },
    {
      id: '2',
      fileRef: 'PACK-2024-012',
      client: 'David Thompson',
      type: 'Packaged Bank Accounts',
      status: 'Pending Review',
      dateCreated: '2024-01-19',
      lastActivity: '5 hours ago',
      refundAmount: '£2,100'
    },
    {
      id: '3',
      fileRef: 'PPI-2024-044',
      client: 'Emma Johnson',
      type: 'PPI Claims',
      status: 'Completed',
      dateCreated: '2024-01-18',
      lastActivity: '1 day ago',
      refundAmount: '£3,200'
    },
    {
      id: '4',
      fileRef: 'MORT-2024-003',
      client: 'Michael Brown',
      type: 'Mortgage Mis-selling',
      status: 'On Hold',
      dateCreated: '2024-01-17',
      lastActivity: '2 days ago',
      refundAmount: '£8,900'
    }
  ];

  const recentClients = [
    {
      id: '1',
      name: 'Jennifer Adams',
      email: 'j.adams@email.com',
      phone: '07123 456 789',
      matterRef: 'PPI-2024-046',
      status: 'Risk Assessment Pending',
      joinDate: '2024-01-20'
    },
    {
      id: '2',
      name: 'Robert Wilson',
      email: 'r.wilson@email.com',
      phone: '07987 654 321',
      matterRef: 'PPI-2024-047',
      status: 'Documents Required',
      joinDate: '2024-01-19'
    },
    {
      id: '3',
      name: 'Lisa Campbell',
      email: 'l.campbell@email.com',
      phone: '07555 123 456',
      matterRef: 'PACK-2024-013',
      status: 'Active',
      joinDate: '2024-01-18'
    }
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Follow up with Barclays regarding PPI-2024-041',
      client: 'Sarah Williams',
      dueDate: 'Today',
      priority: 'High',
      type: 'Lender Communication'
    },
    {
      id: '2',
      title: 'Complete risk assessment for new client',
      client: 'Michael Johnson',
      dueDate: 'Tomorrow',
      priority: 'Medium',
      type: 'Risk Assessment'
    },
    {
      id: '3',
      title: 'Review refund calculation for HSBC claim',
      client: 'Emma Thompson',
      dueDate: 'Jan 23',
      priority: 'Medium',
      type: 'Review'
    },
    {
      id: '4',
      title: 'Send client care pack to new joiners',
      client: 'Multiple Clients',
      dueDate: 'Jan 24',
      priority: 'Low',
      type: 'Communication'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      case 'Risk Assessment Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Documents Required':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-900';
      case 'green':
        return 'bg-green-100 text-green-900';
      case 'purple':
        return 'bg-purple-100 text-purple-900';
      case 'orange':
        return 'bg-orange-100 text-orange-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of your legal case management system</p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm pr-8"
                  style={{ 
                    '&:focus': { 
                      borderColor: '#f46524',
                      boxShadow: '0 0 0 2px rgba(244, 101, 36, 0.2)' 
                    }
                  }}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <Link
                  href="/matters/new"
                  className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: '#334960' }}
                >
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                  <span>New Matter</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">vs last period</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: stat.color === 'blue' ? '#334960' : stat.color === 'green' ? '#10B981' : stat.color === 'purple' ? '#f46524' : '#F59E0B', color: 'white' }}>
                    <i className={`${stat.icon} w-6 h-6 flex items-center justify-center`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Matters</h2>
                  <Link 
                    href="/matters"
                    className="text-sm font-medium cursor-pointer hover:opacity-80"
                    style={{ color: '#f46524' }}
                  >
                    View All
                  </Link>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentMatters.map((matter) => (
                      <div key={matter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Link
                              href={`/matters/${matter.id}`}
                              className="font-medium cursor-pointer hover:opacity-80"
                              style={{ color: '#334960' }}
                            >
                              {matter.fileRef}
                            </Link>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(matter.status)}`}>
                              {matter.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{matter.client} • {matter.type}</p>
                          <p className="text-xs text-gray-500">Last activity: {matter.lastActivity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-700">{matter.refundAmount}</p>
                          <p className="text-xs text-gray-500">{matter.dateCreated}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
                  <button className="text-sm font-medium cursor-pointer hover:opacity-80" style={{ color: '#f46524' }}>
                    View All
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{task.client}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{task.type}</span>
                          <span className="text-xs font-medium text-gray-900">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Clients</h2>
                  <Link 
                    href="/clients"
                    className="text-sm font-medium cursor-pointer hover:opacity-80"
                    style={{ color: '#f46524' }}
                  >
                    View All
                  </Link>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentClients.map((client) => (
                      <div key={client.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f46524' }}>
                          <span className="text-white font-medium text-sm">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                          <p className="text-xs text-gray-500 truncate">{client.email}</p>
                          <p className="text-xs" style={{ color: '#334960' }}>{client.matterRef}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/matters/new"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <i className="w-8 h-8 mb-2 flex items-center justify-center" style={{ color: '#334960' }}>
                    <i className="ri-briefcase-add-line"></i>
                  </i>
                  <span className="text-sm font-medium text-gray-900">New Matter</span>
                </Link>
                <Link
                  href="/clients/new"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <i className="w-8 h-8 mb-2 flex items-center justify-center" style={{ color: '#10B981' }}>
                    <i className="ri-user-add-line"></i>
                  </i>
                  <span className="text-sm font-medium text-gray-900">Add Client</span>
                </Link>
                <Link
                  href="/reports"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <i className="w-8 h-8 mb-2 flex items-center justify-center" style={{ color: '#f46524' }}>
                    <i className="ri-bar-chart-line"></i>
                  </i>
                  <span className="text-sm font-medium text-gray-900">View Reports</span>
                </Link>
                <Link
                  href="/templates"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <i className="w-8 h-8 mb-2 flex items-center justify-center" style={{ color: '#F59E0B' }}>
                    <i className="ri-file-text-line"></i>
                  </i>
                  <span className="text-sm font-medium text-gray-900">Templates</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
