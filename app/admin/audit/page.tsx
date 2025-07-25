'use client';

import Header from '../../../components/Header';
import AuditDashboard from './AuditDashboard';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Audit Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor user activity and system changes across all matters
            </p>
          </div>

          <AuditDashboard />
        </div>
      </div>
    </div>
  );
}
