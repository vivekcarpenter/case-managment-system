
'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlobalSearch from './GlobalSearch';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New document uploaded', message: 'Sarah Williams uploaded consent form', time: '2 min ago', type: 'document' },
    { id: 2, title: 'Task completed', message: 'Risk assessment completed for MAT-2024-001', time: '15 min ago', type: 'task' },
    { id: 3, title: 'Payment received', message: 'Refund of £1,250 received from Barclays', time: '1 hour ago', type: 'payment' }
  ];

  const adminMenuItems = [
    { label: 'User Management', href: '/admin/users', icon: 'ri-user-settings-line' },
    { label: 'Audit Trail', href: '/admin/audit', icon: 'ri-history-line' },
    { label: 'Custom Fields', href: '/admin/custom-fields', icon: 'ri-settings-3-line' },
    { label: 'Workflow Templates', href: '/admin/workflows', icon: 'ri-flow-chart' },
    { label: 'System Settings', href: '/admin/settings', icon: 'ri-settings-line' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b-2" style={{ borderBottomColor: '#f46524' }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold" style={{ fontFamily: 'Pacifico, serif', color: '#f46524' }}>
            logo
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 font-medium hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
              Dashboard
            </Link>
            <Link href="/matters" className="text-gray-700 font-medium hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
              Matters
            </Link>
            <Link href="/clients" className="text-gray-700 font-medium hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
              Clients
            </Link>
            <Link href="/templates" className="text-gray-700 font-medium hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
              Templates
            </Link>
            <Link href="/reports" className="text-gray-700 font-medium hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg transition-all duration-200">
              Reports
            </Link>
            
            {/* Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 text-gray-700 font-medium hover:text-white hover:bg-orange-500 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <span>Admin</span>
                <i className="ri-arrow-down-s-line w-4 h-4"></i>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className={`${item.icon} w-4 h-4`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <GlobalSearch />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-white hover:bg-orange-500 rounded-lg relative transition-all duration-200"
              >
                <i className="ri-notification-line w-5 h-5"></i>
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#f46524' }}>
                  {notifications.length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-orange-50 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'document' ? 'bg-blue-500' :
                            notification.type === 'task' ? 'bg-green-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                            <p className="text-gray-600 text-sm">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm font-medium hover:opacity-80" style={{ color: '#f46524' }}>
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-orange-50 rounded-lg border-2 border-transparent hover:border-orange-200 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f46524' }}>
                  <span className="text-white font-medium text-sm">JS</span>
                </div>
                <span className="hidden md:block font-medium">John Smith</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-900">John Smith</p>
                    <p className="text-sm text-gray-600">Senior Partner</p>
                  </div>
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Profile Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Preferences
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Help & Support
                    </a>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <a href="#" className="block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                        Sign Out
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
