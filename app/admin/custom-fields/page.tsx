'use client';

import Header from '../../../components/Header';
import CustomFieldManager from '../../../components/CustomFieldManager';

export default function CustomFieldsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <CustomFieldManager />
        </div>
      </div>
    </div>
  );
}
