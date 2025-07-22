'use client';

interface ClientsByLenderChartProps {
  filters: any;
}

export default function ClientsByLenderChart({ filters }: ClientsByLenderChartProps) {
  // Mock data - in real implementation, this would be calculated based on filters
  const chartData = [
    { lender: 'Halifax', clients: 324, color: '#3B82F6' },
    { lender: 'Lloyds', clients: 298, color: '#10B981' },
    { lender: 'Barclays', clients: 267, color: '#8B5CF6' },
    { lender: 'Santander', clients: 189, color: '#F59E0B' },
    { lender: 'RBS/NatWest', clients: 156, color: '#EF4444' },
    { lender: 'HSBC', clients: 134, color: '#6B7280' }
  ];

  const totalClients = chartData.reduce((sum, d) => sum + d.clients, 0);
  const maxClients = Math.max(...chartData.map(d => d.clients));

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Clients per Lender</h3>
          <p className="text-sm text-gray-600">Distribution of clients across lenders</p>
        </div>
      </div>

      <div className="space-y-4">
        {chartData.map((data, index) => {
          const percentage = ((data.clients / totalClients) * 100).toFixed(1);
          const barWidth = (data.clients / maxClients) * 100;
          
          return (
            <div key={data.lender} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: data.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    {data.lender}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {data.clients} clients
                  </span>
                  <span className="text-sm font-medium text-gray-900 min-w-12">
                    {percentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500 group-hover:opacity-80"
                  style={{ 
                    width: `${barWidth}%`,
                    backgroundColor: data.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Clients:</span>
          <span className="font-semibold text-gray-900">{totalClients.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}