import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllRecords = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/site-visits/all');
        console.log('✅ Records fetched from backend:', res.data); // Debug log
        setRecords(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch all records', err);
      } finally {
        setLoading(false);
      }
    };

    const role = localStorage.getItem('user_role');
    const loginId = localStorage.getItem('login_id');
    console.log('🔍 Role from localStorage:', role);
    console.log('🔍 Login ID from localStorage:', loginId);

    if (role === 'admin') {
      fetchAllRecords();
    } else {
      console.warn('⛔ Access denied: not an admin.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-blue-50 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Admin: All Site Visit Records</h2>
      {loading ? (
        <p className="text-center text-blue-600 font-medium">Loading records...</p>
      ) : records.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-center text-sm">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                {Object.keys(records[0]).map((key) =>
                  key !== 'id' ? (
                    <th key={key} className="px-4 py-2 border capitalize">{key.replace(/_/g, ' ')}</th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  {Object.entries(record).map(([key, value]) =>
                    key !== 'id' ? (
                      <td key={key} className="px-4 py-2 border text-gray-700">{value}</td>
                    ) : null
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No records available or access denied.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
