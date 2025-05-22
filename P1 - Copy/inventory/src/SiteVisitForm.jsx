import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SiteVisitForm = () => {
  const [formData, setFormData] = useState({
    date_of_visit: '',
    client_name: '',
    client_designation: '',
    contact_number: '',
    client_mail: '',
    site_name: '',
    site_type: '',
    location_address: '',
    description: ''
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [allRecords, setAllRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resultsRef = useRef(null);

  const userId = localStorage.getItem('user_id');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contact_number' && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchUserRecords = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/site-visits/${userId}`);
      setAllRecords(res.data);
    } catch (err) {
      toast.error('Failed to fetch past records');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserRecords();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User not logged in. Please log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = { ...formData, user_id: userId };
      await axios.post('http://localhost:5000/api/site-visit', dataToSend);
      toast.success('Site visit recorded successfully!');
      setSubmittedData(formData);
      fetchUserRecords();
      setFormData({
        date_of_visit: '',
        client_name: '',
        client_designation: '',
        contact_number: '',
        client_mail: '',
        site_name: '',
        site_type: '',
        location_address: '',
        description: ''
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      toast.error('Submission error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString('en-GB');
    } catch {
      return value;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-blue-50 shadow-lg rounded-2xl mt-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Site Visit Form</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries({
          date_of_visit: 'Date of Visit',
          client_name: 'Client Name',
          client_designation: 'Client Designation',
          contact_number: 'Contact Number',
          client_mail: 'Client Mail ID',
          site_name: 'Site Name',
          site_type: 'Site Type',
          location_address: 'Location Address',
          description: 'Description'
        }).map(([key, label]) => (
          key === 'site_type' ? (
            <div key={key}>
              <label className="block text-blue-800 font-medium mb-1">{label}</label>
              <select
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Type</option>
                <option value="Society">Society</option>
                <option value="Cooperate">Cooperate</option>
                <option value="Public Parking">Public Parking</option>
              </select>
            </div>
          ) : key === 'description' ? (
            <div key={key} className="md:col-span-2">
              <label className="block text-blue-800 font-medium mb-1">{label}</label>
              <textarea
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                rows="3"
                className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ) : (
            <div key={key}>
              <label className="block text-blue-800 font-medium mb-1">{label}</label>
              <input
                type={key === 'date_of_visit' ? 'date' : key === 'client_mail' ? 'email' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                maxLength={key === 'contact_number' ? 15 : undefined}
                className="w-full p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )
        ))}

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div ref={resultsRef}>
        {submittedData && (
          <div className="mt-10 overflow-x-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">Last Submitted Record</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-center">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  {Object.keys(submittedData).map((key) => (
                    <th key={key} className="px-4 py-2 border capitalize">{key.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.entries(submittedData).map(([key, value]) => (
                    <td key={key} className="px-4 py-2 border text-gray-700">
                      {key === 'date_of_visit' ? formatDate(value) : value}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {allRecords.length > 0 ? (
          <div className="mt-10 overflow-x-auto">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">All Your Past Records</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow text-center text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  {Object.keys(allRecords[0]).map((key) =>
                    key !== 'user_id' && key !== 'id' ? (
                      <th key={key} className="px-4 py-2 border capitalize">{key.replace(/_/g, ' ')}</th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody>
                {allRecords.map((record, index) => (
                  <tr key={index}>
                    {Object.entries(record).map(([key, value]) =>
                      key !== 'user_id' && key !== 'id' ? (
                        <td key={key} className="px-4 py-2 border text-gray-700">
                          {(key === 'date_of_visit' || key === 'created_at') ? formatDate(value) : value}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-8">No past records found.</p>
        )}
      </div>
    </div>
  );
};

export default SiteVisitForm;
