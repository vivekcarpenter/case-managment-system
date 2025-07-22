'use client';

interface MattersByStatusChartProps {
  filters: any;
}

export default function MattersByStatusChart({ filters }: MattersByStatusChartProps) {
  // Mock data - in real implementation, this would be calculated based on filters
  const chartData = [
    { status: 'Draft', count: 23, color: '#6B7280', percentage: 18.4 },
    { status: 'In Progress', count: 89, color: '#3B82F6', percentage: 71.2 },
    { status: 'Signed', count: 8, color: '#10B981', percentage: 6.4 },
    { status: 'Closed', count: 5, color: '#8B5CF6', percentage: 4.0 }
  ];

  const totalMatters = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Matters by Status</h3>
          <p className="text-sm text-gray-600">Current distribution of matter statuses</p>
        </div>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {chartData.map((data, index) => (
          <div key={data.status} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: data.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {data.status}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {data.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {data.count}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        {chartData.map((data, index) => {
          const width = (data.count / totalMatters) * 100;
          
          return (
            <div key={`bar-${data.status}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{data.status}</span>
                <span className="text-sm font-medium text-gray-900">{data.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: data.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Matters:</span>
            <span className="ml-2 font-semibold text-gray-900">{totalMatters}</span>
          </div>
          <div>
            <span className="text-gray-600">Active:</span>
            <span className="ml-2 font-semibold text-blue-600">
              {chartData.find(d => d.status === 'In Progress')?.count || 0}
            </span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {((chartData.find(d => d.status === 'In Progress')?.count || 0) / totalMatters * 100).toFixed(1)}% of matters are currently in progress
        </div>
      </div>
    </div>
  );
}