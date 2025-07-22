
// Original code with modifications
'use client';

import { useState } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  tasks: Task[];
  isCustom?: boolean;
}

interface Task {
  id: string;
  title: string;
  status: 'completed' | 'pending';
  assignedTo: string;
  dueDate: string;
  createdDate: string;
}

interface WorkflowTimelineProps {
  matterId: string;
}

export default function WorkflowTimeline({ matterId }: WorkflowTimelineProps) {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      title: 'Risk Assessment',
      description: 'Complete conflict checks and client eligibility verification',
      status: 'completed',
      assignedTo: 'John Smith',
      dueDate: '2024-01-16',
      completedDate: '2024-01-15',
      tasks: [
        {
          id: '1-1',
          title: 'Conflict Check',
          status: 'completed',
          assignedTo: 'John Smith',
          dueDate: '2024-01-16',
          createdDate: '2024-01-15'
        },
        {
          id: '1-2',
          title: 'Client Eligibility Review',
          status: 'completed',
          assignedTo: 'John Smith',
          dueDate: '2024-01-16',
          createdDate: '2024-01-15'
        }
      ]
    },
    {
      id: '2',
      title: 'Client Care Pack Sent',
      description: 'Send client care pack and await signed return',
      status: 'completed',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-01-18',
      completedDate: '2024-01-17',
      tasks: [
        {
          id: '2-1',
          title: 'Prepare Client Care Pack',
          status: 'completed',
          assignedTo: 'Sarah Johnson',
          dueDate: '2024-01-17',
          createdDate: '2024-01-15'
        },
        {
          id: '2-2',
          title: 'Send Care Pack to Client',
          status: 'completed',
          assignedTo: 'Sarah Johnson',
          dueDate: '2024-01-17',
          createdDate: '2024-01-15'
        }
      ]
    },
    {
      id: '3',
      title: 'Complaint Letter Preparation',
      description: 'Draft and send complaint letters to all identified lenders',
      status: 'in-progress',
      assignedTo: 'Michael Brown',
      dueDate: '2024-01-22',
      tasks: [
        {
          id: '3-1',
          title: 'Draft Barclays Complaint Letter',
          status: 'completed',
          assignedTo: 'Michael Brown',
          dueDate: '2024-01-20',
          createdDate: '2024-01-17'
        },
        {
          id: '3-2',
          title: 'Draft HSBC Complaint Letter',
          status: 'pending',
          assignedTo: 'Michael Brown',
          dueDate: '2024-01-21',
          createdDate: '2024-01-17'
        },
        {
          id: '3-3',
          title: 'Draft Lloyds Complaint Letter',
          status: 'pending',
          assignedTo: 'Michael Brown',
          dueDate: '2024-01-22',
          createdDate: '2024-01-17'
        }
      ]
    },
    {
      id: '4',
      title: 'Lender Response Review',
      description: 'Review and analyze responses from lenders',
      status: 'pending',
      assignedTo: 'Emma Davis',
      dueDate: '2024-02-05',
      tasks: []
    },
    {
      id: '5',
      title: 'Settlement Negotiation',
      description: 'Negotiate final settlement amounts with lenders',
      status: 'pending',
      assignedTo: 'John Smith',
      dueDate: '2024-02-15',
      tasks: []
    },
    {
      id: '6',
      title: 'Case Closure',
      description: 'Complete final documentation and close case',
      status: 'pending',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-02-20',
      tasks: []
    }
  ]);

  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    assignedTo: 'John Smith',
    dueDate: ''
  });

  const teamMembers = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emma Davis'
  ];

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'ri-check-line';
      case 'in-progress':
        return 'ri-play-line';
      case 'pending':
        return 'ri-time-line';
      default:
        return 'ri-circle-line';
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStepConnectorColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-300';
      case 'in-progress':
        return 'border-blue-300';
      default:
        return 'border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const handleUpdateStatus = (stepId: string, newStatus: WorkflowStep['status']) => {
    setWorkflowSteps(steps =>
      steps.map(step =>
        step.id === stepId
          ? { ...step, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined }
          : step
      )
    );
  };

  const handleAddCustomStep = () => {
    if (!newStep.title || !newStep.description || !newStep.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const customStep: WorkflowStep = {
      id: Date.now().toString(),
      title: newStep.title,
      description: newStep.description,
      status: 'pending',
      assignedTo: newStep.assignedTo,
      dueDate: newStep.dueDate,
      tasks: [],
      isCustom: true
    };

    setWorkflowSteps(prev => [...prev, customStep]);
    setIsAddingStep(false);
    setNewStep({
      title: '',
      description: '',
      assignedTo: 'John Smith',
      dueDate: ''
    });
  };

  const handleDeleteCustomStep = (stepId: string) => {
    if (confirm('Are you sure you want to delete this custom step?')) {
      setWorkflowSteps(prev => prev.filter(step => step.id !== stepId));
    }
  };

  const cancelAddStep = () => {
    setIsAddingStep(false);
    setNewStep({
      title: '',
      description: '',
      assignedTo: 'John Smith',
      dueDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Timeline</h3>
        <button
          onClick={() => setIsAddingStep(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
        >
          Add Custom Step
        </button>
      </div>

      {/* Add Custom Step Modal */}
      {isAddingStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Add Custom Workflow Step</h4>
              <button
                onClick={cancelAddStep}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step Title *
                </label>
                <input
                  type="text"
                  value={newStep.title}
                  onChange={(e) => setNewStep(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter step title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what needs to be done in this step"
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newStep.description.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To *
                </label>
                <select
                  value={newStep.assignedTo}
                  onChange={(e) => setNewStep(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  {teamMembers.map(member => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newStep.dueDate}
                  onChange={(e) => setNewStep(prev => ({ ...prev, dueDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelAddStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomStep}
                disabled={!newStep.title || !newStep.description || !newStep.dueDate}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Add Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-blue-900">Progress Overview</h4>
          <span className="text-sm text-blue-700">
            {workflowSteps.filter(step => step.status === 'completed').length} of {workflowSteps.length} steps completed
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(workflowSteps.filter(step => step.status === 'completed').length / workflowSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connector Line */}
            {index < workflowSteps.length - 1 && (
              <div className={`absolute left-6 top-16 w-0.5 h-16 border-l-2 border-dashed ${getStepConnectorColor(step.status)}`}></div>
            )}

            {/* Step Content */}
            <div className="flex space-x-4">
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                <i className={`${getStatusIcon(step.status)} w-5 h-5 flex items-center justify-center`}></i>
              </div>

              {/* Step Details */}
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                        {step.isCustom && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <select
                        value={step.status}
                        onChange={(e) => handleUpdateStatus(step.id, e.target.value as WorkflowStep['status'])}
                        className="px-3 py-1 border border-gray-300 rounded text-sm pr-8"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      {step.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomStep(step.id)}
                          className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <i className="ri-user-line w-4 h-4 text-gray-400 flex items-center justify-center"></i>
                      <span className="text-sm text-gray-600">
                        Assigned to: <span className="font-medium">{step.assignedTo}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-calendar-line w-4 h-4 text-gray-400 flex items-center justify-center"></i>
                      <span className="text-sm text-gray-600">
                        Due: <span className="font-medium">{formatDate(step.dueDate)}</span>
                      </span>
                    </div>
                    {step.completedDate && (
                      <div className="flex items-center space-x-2">
                        <i className="ri-check-line w-4 h-4 text-green-500 flex items-center justify-center"></i>
                        <span className="text-sm text-gray-600">
                          Completed: <span className="font-medium">{formatDate(step.completedDate)}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tasks */}
                  {step.tasks.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="font-medium text-gray-900 mb-3">Auto-Generated Tasks</h5>
                      <div className="space-y-2">
                        {step.tasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={() => {
                                  // Handle task completion
                                }}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <div>
                                <p
                                  className={`text-sm ${
                                    task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {task.assignedTo} • Due: {formatDate(task.dueDate)}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {task.status === 'completed' ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
