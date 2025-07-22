'use client';

import { useState } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  estimatedDuration: number;
  triggers: WorkflowTrigger[];
  tasks: WorkflowTask[];
}

interface WorkflowTrigger {
  id: string;
  condition: string;
  action: string;
  assignTo: string;
  taskTemplate: string;
}

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  estimatedDuration: number;
}

interface WorkflowTemplateBuilderProps {
  templateData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function WorkflowTemplateBuilder({ templateData, onSave, onCancel }: WorkflowTemplateBuilderProps) {
  const [formData, setFormData] = useState({
    name: templateData.name || '',
    description: templateData.description || '',
    matterType: templateData.matterType || 'PPI Claims',
    steps: templateData.steps || []
  });
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const matterTypes = [
    'PPI Claims',
    'Packaged Bank Accounts',
    'Mortgage Mis-selling',
    'Credit Card Claims',
    'Unaffordable Credit',
    'Motor Finance Claims'
  ];

  const availableUsers = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emma Davis',
    'David Wilson',
    'Lisa Anderson'
  ];

  const triggerConditions = [
    'When Risk Assessment is completed',
    'When Client Care Pack is signed',
    'When Complaint Letter is sent',
    'When Lender Response is received',
    'When Settlement is agreed',
    'When Payment is received'
  ];

  const taskTemplates = [
    'Send Client Care Pack',
    'Draft Complaint Letter',
    'Follow up with Lender',
    'Review Settlement Offer',
    'Prepare Final Documentation',
    'Schedule Client Meeting'
  ];

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      title: '',
      description: '',
      assignedTo: availableUsers[0],
      estimatedDuration: 3,
      triggers: [],
      tasks: []
    };
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    setActiveStep(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step: WorkflowStep) =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const removeStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((step: WorkflowStep) => step.id !== stepId)
    }));
    if (activeStep === stepId) {
      setActiveStep(null);
    }
  };

  const addTrigger = (stepId: string) => {
    const newTrigger: WorkflowTrigger = {
      id: Date.now().toString(),
      condition: triggerConditions[0],
      action: 'create_task',
      assignTo: availableUsers[0],
      taskTemplate: taskTemplates[0]
    };
    
    const step = formData.steps.find((s: WorkflowStep) => s.id === stepId);
    if (step) {
      updateStep(stepId, {
        triggers: [...step.triggers, newTrigger]
      });
    }
  };

  const updateTrigger = (stepId: string, triggerId: string, updates: Partial<WorkflowTrigger>) => {
    const step = formData.steps.find((s: WorkflowStep) => s.id === stepId);
    if (step) {
      updateStep(stepId, {
        triggers: step.triggers.map(trigger =>
          trigger.id === triggerId ? { ...trigger, ...updates } : trigger
        )
      });
    }
  };

  const removeTrigger = (stepId: string, triggerId: string) => {
    const step = formData.steps.find((s: WorkflowStep) => s.id === stepId);
    if (step) {
      updateStep(stepId, {
        triggers: step.triggers.filter(trigger => trigger.id !== triggerId)
      });
    }
  };

  const addTask = (stepId: string) => {
    const newTask: WorkflowTask = {
      id: Date.now().toString(),
      title: '',
      description: '',
      assignedTo: availableUsers[0],
      estimatedDuration: 1
    };
    
    const step = formData.steps.find((s: WorkflowStep) => s.id === stepId);
    if (step) {
      updateStep(stepId, {
        tasks: [...step.tasks, newTask]
      });
    }
  };

  const updateTask = (stepId: string, taskId: string, updates: Partial<WorkflowTask>) => {
    const step = formData.steps.find((s: WorkflowStep) => s.id === stepId);
    if (step) {
      updateStep(stepId, {
        tasks: step.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      });
    }
  };

  const removeTask = (stepId: string, taskId: string) => {
    const step = formData.steps.find((s: WorkflowStep) => s.id === stepId);
    if (step) {
      updateStep(stepId, {
        tasks: step.tasks.filter(task => task.id !== taskId)
      });
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (formData.steps.length === 0) {
      alert('Please add at least one workflow step');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Template Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matter Type *</label>
            <select
              value={formData.matterType}
              onChange={(e) => setFormData(prev => ({ ...prev, matterType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            >
              {matterTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe this workflow template..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Steps</h3>
          <button
            onClick={addStep}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Add Step
          </button>
        </div>

        {formData.steps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-roadmap-line w-12 h-12 mx-auto mb-3 flex items-center justify-center"></i>
            <p>No workflow steps added yet. Click "Add Step" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.steps.map((step: WorkflowStep, index: number) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {step.title || `Step ${index + 1}`}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className={`${activeStep === step.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} w-4 h-4 flex items-center justify-center`}></i>
                    </button>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>

                {activeStep === step.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    {/* Step Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Step Title *</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          placeholder="Enter step title..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                        <select
                          value={step.assignedTo}
                          onChange={(e) => updateStep(step.id, { assignedTo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                        >
                          {availableUsers.map(user => (
                            <option key={user} value={user}>{user}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, { description: e.target.value })}
                        placeholder="Describe what happens in this step..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (days)</label>
                      <input
                        type="number"
                        value={step.estimatedDuration}
                        onChange={(e) => updateStep(step.id, { estimatedDuration: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Triggers */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Automation Triggers</h5>
                        <button
                          onClick={() => addTrigger(step.id)}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors cursor-pointer"
                        >
                          Add Trigger
                        </button>
                      </div>
                      
                      {step.triggers.map((trigger: WorkflowTrigger) => (
                        <div key={trigger.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">Trigger Rule</span>
                            <button
                              onClick={() => removeTrigger(step.id, trigger.id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">When</label>
                              <select
                                value={trigger.condition}
                                onChange={(e) => updateTrigger(step.id, trigger.id, { condition: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm pr-8"
                              >
                                {triggerConditions.map(condition => (
                                  <option key={condition} value={condition}>{condition}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Assign to</label>
                              <select
                                value={trigger.assignTo}
                                onChange={(e) => updateTrigger(step.id, trigger.id, { assignTo: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm pr-8"
                              >
                                {availableUsers.map(user => (
                                  <option key={user} value={user}>{user}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <label className="block text-xs text-gray-600 mb-1">Task Template</label>
                            <select
                              value={trigger.taskTemplate}
                              onChange={(e) => updateTrigger(step.id, trigger.id, { taskTemplate: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm pr-8"
                            >
                              {taskTemplates.map(template => (
                                <option key={template} value={template}>{template}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Manual Tasks */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Manual Tasks</h5>
                        <button
                          onClick={() => addTask(step.id)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer"
                        >
                          Add Task
                        </button>
                      </div>
                      
                      {step.tasks.map((task: WorkflowTask) => (
                        <div key={task.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">Task</span>
                            <button
                              onClick={() => removeTask(step.id, task.id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                              <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Task Title</label>
                              <input
                                type="text"
                                value={task.title}
                                onChange={(e) => updateTask(step.id, task.id, { title: e.target.value })}
                                placeholder="Enter task title..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Assigned To</label>
                              <select
                                value={task.assignedTo}
                                onChange={(e) => updateTask(step.id, task.id, { assignedTo: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm pr-8"
                              >
                                {availableUsers.map(user => (
                                  <option key={user} value={user}>{user}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <label className="block text-xs text-gray-600 mb-1">Description</label>
                            <textarea
                              value={task.description}
                              onChange={(e) => updateTask(step.id, task.id, { description: e.target.value })}
                              placeholder="Describe the task..."
                              rows={2}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
        >
          Cancel
        </button>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
}