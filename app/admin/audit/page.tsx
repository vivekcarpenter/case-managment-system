
'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import AuditDashboard from './AuditDashboard';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
