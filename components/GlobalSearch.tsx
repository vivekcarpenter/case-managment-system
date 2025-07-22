
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  fileRef: string;
  clientName: string;
  phone: string;
  email: string;
  status: string;
  lastActivity: string;
}

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      fileRef: 'PPI-2024-001',
      clientName: 'Sarah Williams',
      phone: '07123 456789',
      email: 'sarah.williams@email.com',
      status: 'Active',
      lastActivity: '2024-01-15'
    },
    {
      id: '2',
      fileRef: 'PPI-2024-002',
      clientName: 'Michael Johnson',
      phone: '07987 654321',
      email: 'michael.j@email.com',
      status: 'Pending',
      lastActivity: '2024-01-14'
    },
    {
      id: '3',
      fileRef: 'PPI-2024-003',
      clientName: 'Emma Thompson',
      phone: '07555 123456',
      email: 'emma.thompson@email.com',
      status: 'Completed',
      lastActivity: '2024-01-13'
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.fileRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.phone.includes(searchQuery) ||
        result.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by File Ref, Client Name, Phone, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 whitespace-nowrap cursor-pointer"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">File Reference</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Client Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Activity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-900">{result.fileRef}</td>
                  <td className="py-3 px-4">{result.clientName}</td>
                  <td className="py-3 px-4">{result.phone}</td>
                  <td className="py-3 px-4">{result.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'Active' ? 'bg-green-100 text-green-800' :
                      result.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{result.lastActivity}</td>
                  <td className="py-3 px-4">
                    <Link 
                      href={`/matters/${result.id}`}
                      className="text-blue-900 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Open Matter
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8 text-gray-500">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
