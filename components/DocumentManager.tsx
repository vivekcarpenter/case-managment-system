'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentExtraction from './DocumentExtraction';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedData?: any;
  linkedTo?: {
    clientId?: string;
    lenderId?: string;
    matterId?: string;
  };
}

interface DocumentManagerProps {
  matterId: string;
}

export default function DocumentManager({ matterId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showExtraction, setShowExtraction] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleDocumentLinked = (document: Document) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === document.id ? document : doc)
    );
  };

  const handleExtractionSave = (fields: any[]) => {
    if (selectedDocument) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, extractedData: fields, status: 'completed' as const }
            : doc
        )
      );
    }
    setShowExtraction(false);
    setSelectedDocument(null);
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const getStatusCount = (status: string) => {
    return documents.filter(doc => doc.status === status).length;
  };

  if (showExtraction && selectedDocument) {
    return (
      <DocumentExtraction
        documentId={selectedDocument.id}
        documentName={selectedDocument.name}
        onSave={handleExtractionSave}
        onCancel={() => {
          setShowExtraction(false);
          setSelectedDocument(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Document Management</h3>
          <p className="text-sm text-gray-600">Upload and manage case documents with OCR extraction</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All ({documents.length})</option>
              <option value="completed">Completed ({getStatusCount('completed')})</option>
              <option value="processing">Processing ({getStatusCount('processing')})</option>
              <option value="error">Errors ({getStatusCount('error')})</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 pr-8 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <DocumentUpload 
        matterId={matterId} 
        onDocumentLinked={handleDocumentLinked}
      />

      {documents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Document Library</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total: {documents.length}</span>
              <span>Processed: {getStatusCount('completed')}</span>
              <span>Pending: {getStatusCount('processing')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDocuments.map((document) => (
              <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-file-text-line w-5 h-5 text-blue-600 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">{document.name}</h5>
                      <p className="text-xs text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {document.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowExtraction(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                        title="View Extraction"
                      >
                        <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    )}
                    <button
                      className="p-1 text-gray-400 hover:text-green-600 cursor-pointer"
                      title="Download"
                    >
                      <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    document.status === 'completed' ? 'bg-green-100 text-green-800' :
                    document.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    document.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {document.status}
                  </div>

                  {document.extractedData && (
                    <div className="text-xs text-gray-600">
                      <p>Client: {document.extractedData.clientName}</p>
                      <p>Amount: {document.extractedData.refundAmount}</p>
                    </div>
                  )}

                  {document.linkedTo && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <i className="ri-link w-3 h-3 flex items-center justify-center"></i>
                      <span>Auto-linked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-folder-open-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h3>
          <p className="text-gray-600">Upload your first document to get started with OCR extraction</p>
        </div>
      )}
    </div>
  );
}