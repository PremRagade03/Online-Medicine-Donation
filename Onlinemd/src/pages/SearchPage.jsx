import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/medicine/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error('Failed to fetch search results');

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Search Results for "{searchQuery}"</h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && <p className="text-gray-400">No results found.</p>}

      <div className="grid gap-4">
        {results.map((item) => (
          <Card key={item.medicineId} className="p-4 bg-slate-800 border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{item.medicineName}</h3>
                <div className="text-sm text-gray-400">
                  <p>Quantity: {item.quantity}</p>
                  <p>Expiry: {new Date(item.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              <Badge variant="default">Available</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;