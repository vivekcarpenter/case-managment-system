
'use client';

import { useState } from 'react';

interface RiskCheck {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

interface RiskAssessmentProps {
  onRiskChecksChange?: (checks: RiskCheck[]) => void;
}

export default function RiskAssessment({ onRiskChecksChange }: RiskAssessmentProps) {
  const [riskChecks, setRiskChecks] = useState<RiskCheck[]>([
    {
      id: 'conflict',
      label: 'Conflict Check',
      description: 'Verified no conflicts of interest exist with this matter',
      completed: false
    },
    {
      id: 'expertise',
      label: 'In-Firm Expertise',
      description: 'Confirmed we have the necessary expertise to handle this case',
      completed: false
    },
    {
      id: 'eligibility',
      label: 'Client Eligibility',
      description: 'Client meets all eligibility criteria for this type of claim',
      completed: false
    },
    {
      id: 'submission',
      label: 'Not Already Submitted',
      description: 'Verified this claim has not been previously submitted elsewhere',
      completed: false
    }
  ]);

  const updateRiskCheck = (id: string, completed: boolean) => {
    const updatedChecks = riskChecks.map(check =>
      check.id === id ? { ...check, completed } : check
    );
    setRiskChecks(updatedChecks);
    onRiskChecksChange?.(updatedChecks);
  };

  const allChecksCompleted = riskChecks.every(check => check.completed);
  const completedCount = riskChecks.filter(check => check.completed).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
          <p className="text-sm text-gray-600 mt-1">
            Complete all checks before proceeding with the matter
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            allChecksCompleted 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {completedCount}/{riskChecks.length} Completed
          </div>
          {allChecksCompleted && (
            <i className="ri-check-line w-5 h-5 text-green-600"></i>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {riskChecks.map((check) => (
          <div key={check.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0 mt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={check.completed}
                  onChange={(e) => updateRiskCheck(check.id, e.target.checked)}
                  className="w-5 h-5 text-blue-900 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className={`font-medium ${check.completed ? 'text-green-800' : 'text-gray-900'}`}>
                  {check.label}
                </h4>
                {check.completed && (
                  <i className="ri-check-line w-4 h-4 text-green-600"></i>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {check.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!allChecksCompleted && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <i className="ri-alert-line w-5 h-5 text-yellow-600"></i>
            <p className="text-sm text-yellow-800 font-medium">
              Please complete all risk assessment checks before proceeding
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
