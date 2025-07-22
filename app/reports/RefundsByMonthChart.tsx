'use client';

interface RefundsByMonthChartProps {
  filters: any;
}

export default function RefundsByMonthChart({ filters }: RefundsByMonthChartProps) {
  // Mock data - in real implementation, this would be calculated based on filters
  const chartData = [
    { month: 'Jan', amount: 245000, count: 45 },
    { month: 'Feb', amount: 321000, count: 52 },
    { month: 'Mar', amount: 287000, count: 48 },
    { month: 'Apr', amount: 398000, count: 63 },
    { month: 'May', amount: 456000, count: 71 },
    { month: 'Jun', amount: 523000, count: 84 },
    { month: 'Jul', amount: 467000, count: 76 },
    { month: 'Aug', amount: 389000, count: 62 },
    { month: 'Sep', amount: 445000, count: 69 },
    { month: 'Oct', amount: 512000, count: 82 },
    { month: 'Nov', amount: 478000, count: 78 },
    { month: 'Dec', amount: 434000, count: 67 }
  ];

  const maxAmount = Math.max(...chartData.map(d => d.amount));

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Refunds by Month</h3>
          <p className="text-sm text-gray-600">Total refund amounts paid per month</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Refund Amount</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Chart Container */}
        <div className="flex items-end justify-between space-x-2 h-64">
          {chartData.map((data, index) => {
            const height = (data.amount / maxAmount) * 240;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-opacity">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                      <div className="font-medium">£{data.amount.toLocaleString()}</div>
                      <div className="text-gray-300">{data.count} refunds</div>
                    </div>
                  </div>
                  
                  {/* Bar */}
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${height}px` }}
                  ></div>
                </div>
                
                {/* Month Label */}
                <div className="mt-2 text-xs text-gray-600 font-medium">
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 -ml-12">
          <span>£{(maxAmount / 1000).toFixed(0)}k</span>
          <span>£{(maxAmount / 2000).toFixed(0)}k</span>
          <span>£0</span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Total refunds: £{chartData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
          <span>Average per month: £{Math.round(chartData.reduce((sum, d) => sum + d.amount, 0) / chartData.length).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}