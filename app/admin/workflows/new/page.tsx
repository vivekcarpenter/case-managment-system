'use client';

import { useState } from 'react';
import Header from '../../../../components/Header';
import WorkflowTemplateBuilder from '../../../../components/WorkflowTemplateBuilder';

export default function NewWorkflowTemplatePage() {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    matterType: 'PPI Claims',
    steps: [] as any[]
  });

  const handleSave = (data: any) => {
    console.log('Saving workflow template:', data);
    // Save logic here
  };

  return (
   <div className="min-h-screen bg-gray-50">
  <Header />

  <div className="pt-20 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Workflow Template</h1>
          <p className="text-gray-600 mt-2">
            Create a new workflow template for matter processing
          </p>
        </div>
      </div>

      <WorkflowTemplateBuilder
        templateData={templateData}
        onSave={handleSave}
        onCancel={() => window.history.back()}
      />
    </div>
  </div>
</div>

  );
}