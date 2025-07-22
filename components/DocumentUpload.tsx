'use client';

import { useState, useRef, useCallback } from 'react';

interface ExtractedData {
  clientName?: string;
  accountNumber?: string;
  refundAmount?: string;
  lenderName?: string;
  dateExtracted?: string;
  confidence?: number;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedData?: ExtractedData;
  previewUrl?: string;
  linkedTo?: {
    clientId?: string;
    lenderId?: string;
    matterId?: string;
  };
}

interface DocumentUploadProps {
  matterId: string;
  onDocumentLinked?: (document: UploadedDocument) => void;
}

export default function DocumentUpload({ matterId, onDocumentLinked }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockOCRExtraction = async (file: File): Promise<ExtractedData> => {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data based on file name patterns
    const fileName = file.name.toLowerCase();
    const extractedData: ExtractedData = {
      dateExtracted: new Date().toISOString(),
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };

    if (fileName.includes('barclays') || fileName.includes('bank')) {
      extractedData.lenderName = 'Barclays Bank PLC';
      extractedData.accountNumber = '12345678';
      extractedData.refundAmount = '£2,450.00';
      extractedData.clientName = 'Sarah Williams';
    } else if (fileName.includes('hsbc')) {
      extractedData.lenderName = 'HSBC UK Bank PLC';
      extractedData.accountNumber = '87654321';
      extractedData.refundAmount = '£1,200.00';
      extractedData.clientName = 'John Smith';
    } else if (fileName.includes('care') || fileName.includes('pack')) {
      extractedData.clientName = 'Sarah Williams';
      extractedData.lenderName = 'Multiple Lenders';
      extractedData.refundAmount = '£4,500.00';
    } else {
      // Default extraction for other documents
      extractedData.clientName = 'Sarah Williams';
      extractedData.accountNumber = '98765432';
      extractedData.refundAmount = '£875.00';
      extractedData.lenderName = 'Lloyds Banking Group';
    }

    return extractedData;
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    const newDocuments: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentId = `doc_${Date.now()}_${i}`;
      
      const document: UploadedDocument = {
        id: documentId,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        previewUrl: URL.createObjectURL(file)
      };

      newDocuments.push(document);
    }

    setDocuments(prev => [...prev, ...newDocuments]);

    // Process each document
    for (const document of newDocuments) {
      try {
        // Update status to processing
        setDocuments(prev => prev.map(doc => 
          doc.id === document.id ? { ...doc, status: 'processing' } : doc
        ));

        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Perform OCR extraction
        const extractedData = await mockOCRExtraction(new File([], document.name));

        // Update document with extracted data
        setDocuments(prev => prev.map(doc => 
          doc.id === document.id ? { 
            ...doc, 
            status: 'completed',
            extractedData,
            linkedTo: {
              matterId,
              clientId: 'client_1', // Auto-link based on extracted client name
              lenderId: 'lender_1'   // Auto-link based on extracted lender name
            }
          } : doc
        ));

        // Notify parent component
        const updatedDoc = {
          ...document,
          status: 'completed' as const,
          extractedData,
          linkedTo: {
            matterId,
            clientId: 'client_1',
            lenderId: 'lender_1'
          }
        };
        onDocumentLinked?.(updatedDoc);

      } catch (error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === document.id ? { ...doc, status: 'error' } : doc
        ));
      }
    }
  }, [matterId, onDocumentLinked]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'ri-file-pdf-line';
    if (type.includes('image')) return 'ri-image-line';
    if (type.includes('word')) return 'ri-file-word-line';
    return 'ri-file-text-line';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const reprocessDocument = async (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, status: 'processing' } : doc
    ));

    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) return;

      const extractedData = await mockOCRExtraction(new File([], document.name));
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { 
          ...doc, 
          status: 'completed',
          extractedData
        } : doc
      ));
    } catch (error) {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, status: 'error' } : doc
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-upload-cloud-line w-8 h-8 text-blue-600 flex items-center justify-center"></i>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
            <p className="text-gray-600 mt-1">
              Drag and drop files here, or{' '}
              <button
                onClick={openFileDialog}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                click to browse
              </button>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, images, and Word documents up to 10MB
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className={`${getFileIcon(document.type)} w-5 h-5 text-gray-600 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{document.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(document.size)} • {new Date(document.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                      {document.status === 'uploading' && 'Uploading...'}
                      {document.status === 'processing' && 'Processing...'}
                      {document.status === 'completed' && 'Ready'}
                      {document.status === 'error' && 'Error'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowPreview(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                        title="Preview"
                      >
                        <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      {document.status === 'error' && (
                        <button
                          onClick={() => reprocessDocument(document.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                          title="Reprocess"
                        >
                          <i className="ri-refresh-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      )}
                      <button
                        onClick={() => deleteDocument(document.id)}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Extracted Data */}
                {document.extractedData && document.status === 'completed' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-green-800">Extracted Information</h5>
                      <span className="text-xs text-green-600">
                        {Math.round((document.extractedData.confidence || 0) * 100)}% confidence
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {document.extractedData.clientName && (
                        <div>
                          <span className="text-gray-600">Client:</span>
                          <span className="ml-2 font-medium">{document.extractedData.clientName}</span>
                        </div>
                      )}
                      {document.extractedData.lenderName && (
                        <div>
                          <span className="text-gray-600">Lender:</span>
                          <span className="ml-2 font-medium">{document.extractedData.lenderName}</span>
                        </div>
                      )}
                      {document.extractedData.accountNumber && (
                        <div>
                          <span className="text-gray-600">Account:</span>
                          <span className="ml-2 font-medium">{document.extractedData.accountNumber}</span>
                        </div>
                      )}
                      {document.extractedData.refundAmount && (
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 font-medium text-green-600">{document.extractedData.refundAmount}</span>
                        </div>
                      )}
                    </div>
                    {document.linkedTo && (
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <div className="flex items-center space-x-2 text-xs text-green-700">
                          <i className="ri-link w-3 h-3 flex items-center justify-center"></i>
                          <span>Auto-linked to client and lender records</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Processing Status */}
                {document.status === 'processing' && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-yellow-800">Processing document with OCR...</span>
                    </div>
                  </div>
                )}

                {/* Error Status */}
                {document.status === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="ri-error-warning-line w-4 h-4 text-red-600 flex items-center justify-center"></i>
                        <span className="text-sm text-red-800">Failed to process document</span>
                      </div>
                      <button
                        onClick={() => reprocessDocument(document.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedDocument.name}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              {selectedDocument.previewUrl && selectedDocument.type.includes('image') ? (
                <img
                  src={selectedDocument.previewUrl}
                  alt={selectedDocument.name}
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="text-center py-12">
                  <i className="ri-file-text-line w-12 h-12 text-gray-400 mx-auto mb-4 flex items-center justify-center"></i>
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}