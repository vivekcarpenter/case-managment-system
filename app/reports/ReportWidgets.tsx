'use client';

import { useState } from 'react';
import RefundsByMonthChart from './RefundsByMonthChart';
import ClientsByLenderChart from './ClientsByLenderChart';
import RefundsPaidVsOwedChart from './RefundsPaidVsOwedChart';
import MattersByStatusChart from './MattersByStatusChart';
import ClientRefundTable from './ClientRefundTable';

interface ReportWidgetsProps {
  filters: {
    dateRange: { start: string; end: string };
    lender: string;
    status: string;
    user: string;
  };
}

export default function ReportWidgets({ filters }: ReportWidgetsProps) {
  const [activeTab, setActiveTab] = useState('charts');

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('charts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-bar-chart-line w-4 h-4 inline mr-2"></i>
              Charts & Analytics
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeTab === 'table'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="ri-table-line w-4 h-4 inline mr-2"></i>
              Detailed Table
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'charts' && (
            <div className="space-y-8">
              {/* Top Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RefundsByMonthChart filters={filters} />
                <ClientsByLenderChart filters={filters} />
              </div>

              {/* Bottom Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RefundsPaidVsOwedChart filters={filters} />
                <MattersByStatusChart filters={filters} />
              </div>
            </div>
          )}

          {activeTab === 'table' && (
            <ClientRefundTable filters={filters} />
          )}
        </div>
      </div>
    </div>
  );
}