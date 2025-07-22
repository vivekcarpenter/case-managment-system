'use client';

interface ReportsSummaryProps {
  filters: {
    dateRange: { start: string; end: string };
    lender: string;
    status: string;
    user: string;
  };
}

export default function ReportsSummary({ filters }: ReportsSummaryProps) {
  // Mock data - in real implementation, this would be calculated based on filters
  const summaryData = {
    totalClients: 1247,
    totalRefundsPaid: 2847692.50,
    mostFrequentLender: 'Halifax',
    openMatters: 89,
    previousPeriod: {
      totalClients: 1198,
      totalRefundsPaid: 2654321.75,
      openMatters: 92
    }
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const clientsChange = calculateChange(summaryData.totalClients, summaryData.previousPeriod.totalClients);
  const refundsChange = calculateChange(summaryData.totalRefundsPaid, summaryData.previousPeriod.totalRefundsPaid);
  const mattersChange = calculateChange(summaryData.openMatters, summaryData.previousPeriod.openMatters);

  const summaryCards = [
    {
      title: 'Total Clients',
      value: summaryData.totalClients.toLocaleString(),
      change: clientsChange,
      icon: 'ri-user-line',
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Total Refunds Paid',
      value: `£${summaryData.totalRefundsPaid.toLocaleString()}`,
      change: refundsChange,
      icon: 'ri-money-pound-circle-line',
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Most Frequent Lender',
      value: summaryData.mostFrequentLender,
      subtitle: '34% of all cases',
      icon: 'ri-building-line',
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Open Matters',
      value: summaryData.openMatters.toString(),
      change: mattersChange,
      icon: 'ri-folder-open-line',
      color: 'bg-orange-50 text-orange-700',
      iconBg: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
              <i className={`${card.icon} w-6 h-6 ${card.color}`}></i>
            </div>
            {card.change && (
              <div className={`flex items-center space-x-1 text-sm ${
                card.change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <i className={`ri-arrow-${card.change.isPositive ? 'up' : 'down'}-line w-4 h-4`}></i>
                <span>{card.change.value}%</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            {card.subtitle && (
              <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}