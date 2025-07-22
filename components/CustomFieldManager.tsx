
'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'dropdown' | 'textarea' | 'checkbox';
  section: 'client' | 'lender' | 'matter';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  mergeFieldSyntax: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CustomFieldManagerProps {
  onFieldsChange?: (fields: CustomField[]) => void;
}

function SortableItem({ field, onEdit, onDelete }: { field: CustomField; onEdit: (field: CustomField) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeIcon = (type: CustomField['type']) => {
    switch (type) {
      case 'text': return 'ri-text';
      case 'date': return 'ri-calendar-line';
      case 'number': return 'ri-hashtag';
      case 'dropdown': return 'ri-arrow-down-s-line';
      case 'textarea': return 'ri-file-text-line';
      case 'checkbox': return 'ri-checkbox-line';
      default: return 'ri-text';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-gray-400 cursor-move"
      >
        <i className="ri-drag-move-line w-5 h-5 flex items-center justify-center"></i>
      </div>
      <div className="flex items-center space-x-3 flex-1">
        <i className={`${getTypeIcon(field.type)} w-4 h-4 text-gray-400 flex items-center justify-center`}></i>
        <div>
          <h4 className="font-medium text-gray-900">{field.label}</h4>
          <p className="text-sm text-gray-500">{field.type} • {field.mergeFieldSyntax}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {field.required && (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Required
          </span>
        )}
        <button
          onClick={() => onEdit(field)}
          className="p-2 text-gray-400 hover:text-blue-600 cursor-pointer"
        >
          <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
        </button>
        <button
          onClick={() => onDelete(field.id)}
          className="p-2 text-gray-400 hover:text-red-600 cursor-pointer"
        >
          <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
        </button>
      </div>
    </div>
  );
}

export default function CustomFieldManager({ onFieldsChange }: CustomFieldManagerProps) {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: '1',
      name: 'preferredContact',
      label: 'Preferred Contact Method',
      type: 'dropdown',
      section: 'client',
      required: false,
      options: ['Email', 'Phone', 'SMS', 'Letter'],
      mergeFieldSyntax: '{{client.preferredContact}}',
      order: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'loanStartDate',
      label: 'Loan Start Date',
      type: 'date',
      section: 'lender',
      required: true,
      mergeFieldSyntax: '{{lender.loanStartDate}}',
      order: 2,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      name: 'urgencyLevel',
      label: 'Urgency Level',
      type: 'dropdown',
      section: 'matter',
      required: false,
      options: ['Low', 'Medium', 'High', 'Critical'],
      mergeFieldSyntax: '{{matter.urgencyLevel}}',
      order: 3,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ]);

  const [isAddingField, setIsAddingField] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [selectedSection, setSelectedSection] = useState<'client' | 'lender' | 'matter' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text' as CustomField['type'],
    section: 'client' as CustomField['section'],
    required: false,
    placeholder: '',
    options: [''],
    defaultValue: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateMergeFieldSyntax = (section: string, name: string) => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `{{${section}.${cleanName}}}`;
  };

  const handleAddField = () => {
    if (!newField.name || !newField.label) {
      alert('Please fill in required fields');
      return;
    }

    const field: CustomField = {
      id: Date.now().toString(),
      name: newField.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
      label: newField.label,
      type: newField.type,
      section: newField.section,
      required: newField.required,
      placeholder: newField.placeholder,
      options: newField.type === 'dropdown' ? newField.options.filter(opt => opt.trim()) : undefined,
      defaultValue: newField.defaultValue,
      mergeFieldSyntax: generateMergeFieldSyntax(newField.section, newField.name),
      order: fields.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedFields = [...fields, field];
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
    resetForm();
  };

  const handleEditField = (field: CustomField) => {
    setEditingField(field);
    setNewField({
      name: field.name,
      label: field.label,
      type: field.type,
      section: field.section,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options || [''],
      defaultValue: field.defaultValue || ''
    });
    setIsAddingField(true);
  };

  const handleUpdateField = () => {
    if (!editingField) return;

    const updatedField: CustomField = {
      ...editingField,
      name: newField.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
      label: newField.label,
      type: newField.type,
      section: newField.section,
      required: newField.required,
      placeholder: newField.placeholder,
      options: newField.type === 'dropdown' ? newField.options.filter(opt => opt.trim()) : undefined,
      defaultValue: newField.defaultValue,
      mergeFieldSyntax: generateMergeFieldSyntax(newField.section, newField.name),
      updatedAt: new Date().toISOString()
    };

    const updatedFields = fields.map(f => f.id === editingField.id ? updatedField : f);
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
    resetForm();
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this custom field?')) {
      const updatedFields = fields.filter(f => f.id !== fieldId);
      setFields(updatedFields);
      onFieldsChange?.(updatedFields);
    }
  };

  const resetForm = () => {
    setIsAddingField(false);
    setEditingField(null);
    setNewField({
      name: '',
      label: '',
      type: 'text',
      section: 'client',
      required: false,
      placeholder: '',
      options: [''],
      defaultValue: ''
    });
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        const updatedFields = reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));

        onFieldsChange?.(updatedFields);
        return updatedFields;
      });
    }
  }

  const addDropdownOption = () => {
    setNewField(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeDropdownOption = (index: number) => {
    if (newField.options.length > 1) {
      setNewField(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateDropdownOption = (index: number, value: string) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const filteredFields = fields.filter(field => {
    const matchesSection = selectedSection === 'all' || field.section === selectedSection;
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const getFieldsBySection = (section: CustomField['section']) => {
    return fields.filter(field => field.section === section).sort((a, b) => a.order - b.order);
  };

  const getSectionLabel = (section: CustomField['section']) => {
    switch (section) {
      case 'client': return 'Client Fields';
      case 'lender': return 'Lender Fields';
      case 'matter': return 'Matter Fields';
      default: return section;
    }
  };

  const getTypeIcon = (type: CustomField['type']) => {
    switch (type) {
      case 'text': return 'ri-text';
      case 'date': return 'ri-calendar-line';
      case 'number': return 'ri-hashtag';
      case 'dropdown': return 'ri-arrow-down-s-line';
      case 'textarea': return 'ri-file-text-line';
      case 'checkbox': return 'ri-checkbox-line';
      default: return 'ri-text';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Field Manager</h2>
          <p className="text-gray-600">Create and manage custom fields for clients, lenders, and matters</p>
        </div>
        <button
          onClick={() => setIsAddingField(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line w-4 h-4 mr-2 inline-flex items-center justify-center"></i>
          Add Custom Field
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
        >
          <option value="all">All Sections</option>
          <option value="client">Client Fields</option>
          <option value="lender">Lender Fields</option>
          <option value="matter">Matter Fields</option>
        </select>
      </div>

      {/* Add/Edit Field Form */}
      {isAddingField && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingField ? 'Edit Custom Field' : 'Add New Custom Field'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name *
              </label>
              <input
                type="text"
                value={newField.name}
                onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., preferredContact"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Will be converted to: {generateMergeFieldSyntax(newField.section, newField.name)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Label *
              </label>
              <input
                type="text"
                value={newField.label}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Preferred Contact Method"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type *
              </label>
              <select
                value={newField.type}
                onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as CustomField['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="dropdown">Dropdown</option>
                <option value="checkbox">Checkbox</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section *
              </label>
              <select
                value={newField.section}
                onChange={(e) => setNewField(prev => ({ ...prev, section: e.target.value as CustomField['section'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="client">Client</option>
                <option value="lender">Lender</option>
                <option value="matter">Matter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder Text
              </label>
              <input
                type="text"
                value={newField.placeholder}
                onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="Enter placeholder text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Value
              </label>
              <input
                type="text"
                value={newField.defaultValue}
                onChange={(e) => setNewField(prev => ({ ...prev, defaultValue: e.target.value }))}
                placeholder="Enter default value..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Required Field</span>
              </label>
            </div>

            {newField.type === 'dropdown' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropdown Options
                </label>
                <div className="space-y-2">
                  {newField.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateDropdownOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => removeDropdownOption(index)}
                        disabled={newField.options.length === 1}
                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addDropdownOption}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Add Option</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={editingField ? handleUpdateField : handleAddField}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 cursor-pointer"
            >
              {editingField ? 'Update Field' : 'Add Field'}
            </button>
          </div>
        </div>
      )}

      {/* Field List */}
      <div className="space-y-4">
        {selectedSection === 'all' ? (
          // Show fields grouped by section
          ['client', 'lender', 'matter'].map(section => {
            const sectionFields = getFieldsBySection(section as CustomField['section']);
            if (sectionFields.length === 0) return null;

            return (
              <div key={section} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {getSectionLabel(section as CustomField['section'])} ({sectionFields.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionFields.map((field) => (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <i className={`${getTypeIcon(field.type)} w-4 h-4 text-gray-400 flex items-center justify-center`}></i>
                            <div>
                              <h4 className="font-medium text-gray-900">{field.label}</h4>
                              <p className="text-sm text-gray-500">{field.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditField(field)}
                              className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                            >
                              <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteField(field.id)}
                              className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-600">
                            {field.mergeFieldSyntax}
                          </div>
                          {field.required && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Show draggable list for single section
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {getSectionLabel(selectedSection)} ({filteredFields.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">Drag to reorder fields</p>
            </div>
            <div className="p-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={filteredFields} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {filteredFields.map((field) => (
                      <SortableItem
                        key={field.id}
                        field={field}
                        onEdit={handleEditField}
                        onDelete={handleDeleteField}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredFields.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <i className="ri-settings-3-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Fields Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No fields match your search criteria.' : 'Create your first custom field to get started.'}
          </p>
          <button
            onClick={() => setIsAddingField(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Add Custom Field
          </button>
        </div>
      )}
    </div>
  );
}
