'use client';

interface RefundsPaidVsOwedChartProps {
  filters: any;
}

export default function RefundsPaidVsOwedChart({ filters }: RefundsPaidVsOwedChartProps) {
  // Mock data - in real implementation, this would be calculated based on filters
  const data = {
    paid: 2847692.50,
    owed: 4125436.75,
    pending: 892344.25
  };

  const total = data.paid + data.owed + data.pending;
  const paidPercentage = (data.paid / total) * 100;
  const owedPercentage = (data.owed / total) * 100;
  const pendingPercentage = (data.pending / total) * 100;

  const segments = [
    { 
      label: 'Paid', 
      value: data.paid, 
      percentage: paidPercentage, 
      color: '#10B981',
      bgColor: 'bg-green-500'
    },
    { 
      label: 'Outstanding', 
      value: data.owed, 
      percentage: owedPercentage, 
      color: '#EF4444',
      bgColor: 'bg-red-500'
    },
    { 
      label: 'Pending', 
      value: data.pending, 
      percentage: pendingPercentage, 
      color: '#F59E0B',
      bgColor: 'bg-yellow-500'
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Refunds Paid vs Outstanding</h3>
          <p className="text-sm text-gray-600">Comparison of refund statuses</p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        {/* Donut Chart */}
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            
            {/* Paid segment */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#10B981"
              strokeWidth="3"
              strokeDasharray={`${paidPercentage} ${100 - paidPercentage}`}
              strokeDashoffset="0"
              className="transition-all duration-500"
            />
            
            {/* Outstanding segment */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#EF4444"
              strokeWidth="3"
              strokeDasharray={`${owedPercentage} ${100 - owedPercentage}`}
              strokeDashoffset={`${-paidPercentage}`}
              className="transition-all duration-500"
            />
            
            {/* Pending segment */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray={`${pendingPercentage} ${100 - pendingPercentage}`}
              strokeDashoffset={`${-(paidPercentage + owedPercentage)}`}
              className="transition-all duration-500"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">
              £{(total / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div key={segment.label} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 ${segment.bgColor} rounded`}></div>
              <span className="text-sm font-medium text-gray-900">
                {segment.label}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                £{segment.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Recovery Rate:</span>
            <span className="ml-2 font-semibold text-green-600">
              {((data.paid / (data.paid + data.owed)) * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Outstanding:</span>
            <span className="ml-2 font-semibold text-red-600">
              £{(data.owed / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}