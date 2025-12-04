import React, { useState, useEffect } from 'react';
import { Search, MapPin, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HostelMap from './HostelMap';
import Navbar from './Navbar';
import Footer from './Footer';

import axios from 'axios';

const MapSearch = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    hostelType: '',
    priceRange: '',
    city: ''
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      console.log('Fetching hostels from API...');
      const response = await axios.get('http://localhost:5000/api/hostels');
      console.log('API Response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid API response format:', response.data);
        setHostels([]);
        setFilteredHostels([]);
        setLoading(false);
        return;
      }

      // Debug: Check approval status of each hostel
      response.data.forEach((hostel, index) => {
        console.log(`Hostel ${index + 1}: ${hostel.name} - isApproved: ${hostel.isApproved}`);
      });
      
      const approvedHostels = response.data.filter(hostel => hostel.isApproved);
      console.log('Approved hostels:', approvedHostels);
      console.log('Total approved hostels count:', approvedHostels.length);
      
      setHostels(approvedHostels);
      setFilteredHostels(approvedHostels);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Add fallback sample data for testing
      const sampleHostels = [
        {
          _id: 'sample1',
          name: 'Sample Hostel 1',
          address: 'Thamel, Kathmandu',
          location: 'Thamel',
          city: 'Kathmandu',
          coordinates: { latitude: 27.7172, longitude: 85.3240 },
          priceRange: { min: 1000, max: 1500 },
          hostelType: 'Co-ed',
          isApproved: true,
          images: []
        },
        {
          _id: 'sample2',
          name: 'Sample Hostel 2',
          address: 'Patan, Lalitpur',
          location: 'Patan',
          city: 'Lalitpur',
          coordinates: { latitude: 27.6744, longitude: 85.3244 },
          priceRange: { min: 900, max: 1300 },
          hostelType: 'Girls Hostel',
          isApproved: true,
          images: []
        }
      ];
      
      console.log('Using sample data for testing');
      setHostels(sampleHostels);
      setFilteredHostels(sampleHostels);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, filters);
  };

  const applyFilters = (searchQuery = '', currentFilters = filters) => {
    let filtered = hostels;

    // Apply text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(hostel =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hostel.address && hostel.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (currentFilters.hostelType) {
      filtered = filtered.filter(hostel => hostel.hostelType === currentFilters.hostelType);
    }

    if (currentFilters.city) {
      filtered = filtered.filter(hostel => 
        hostel.city.toLowerCase().includes(currentFilters.city.toLowerCase())
      );
    }

    if (currentFilters.priceRange) {
      const [min, max] = currentFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(hostel =>
        hostel.priceRange.min <= max && hostel.priceRange.max >= min
      );
    }

    setFilteredHostels(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  const resetFilters = () => {
    setFilters({ hostelType: '', priceRange: '', city: '' });
    setSearchQuery('');
    setFilteredHostels(hostels);
  };

  const handleHostelSelect = (hostel) => {
    setSelectedHostel(hostel);
  };

  const navigateToHostelDetails = (hostel) => {
    navigate(`/hostels/${hostel._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600">Loading hostels...</p>
          <p className="text-sm text-gray-400 mt-2">If this takes too long, check if your backend server is running on port 5000</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Hostels Near You</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, location, or address..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>

            <select
              value={filters.hostelType}
              onChange={(e) => handleFilterChange('hostelType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Boys Hostel">Boys Hostel</option>
              <option value="Girls Hostel">Girls Hostel</option>
              <option value="Co-ed">Co-ed</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Prices</option>
              <option value="5000-10000">Rs. 5,000 - 10,000</option>
              <option value="10000-15000">Rs. 10,000 - 15,000</option>
              <option value="15000-20000">Rs. 15,000 - 20,000</option>
              <option value="20000-30000">Rs. 20,000+</option>
            </select>

            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                viewMode === 'map' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MapPin className="h-4 w-4" />
              Map View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
              List View
            </button>
          </div>

          {/* Results Count */}
          <p className="text-gray-600">
            {filteredHostels.length} hostel{filteredHostels.length !== 1 ? 's' : ''} found
          </p>
          
          {/* No hostels message */}
          {filteredHostels.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h3 className="font-medium text-yellow-800 mb-2">No hostels found</h3>
              <p className="text-yellow-700 text-sm">
                This could be because:
              </p>
              <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
                <li>Your backend server is not running (should be on http://localhost:5000)</li>
                <li>No hostels are approved in the database</li>
                <li>The database is empty - try running the seed script</li>
                <li>Your search filters are too restrictive</li>
              </ul>
            </div>
          )}
        </div>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <HostelMap 
              hostels={filteredHostels} 
              onHostelSelect={handleHostelSelect}
              selectedHostel={selectedHostel}
            />
          </div>
          
          {/* Hostel List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-lg mb-4">Hostels</h3>
              {filteredHostels.map((hostel) => (
                <div
                  key={hostel._id}
                  onClick={() => handleHostelSelect(hostel)}
                  className={`p-3 border rounded-lg mb-3 cursor-pointer hover:bg-gray-50 transition-all ${
                    selectedHostel?._id === hostel._id ? 'border-red-500 bg-red-50 shadow-md' : 'border-gray-200'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{hostel.name}</h4>
                  <p className="text-sm text-gray-600">{hostel.address || hostel.location}</p>
                  <p className="text-sm text-gray-600">{hostel.city}</p>
                  <p className="text-sm font-medium text-red-600 mt-1">
                    Rs. {hostel.priceRange.min} - Rs. {hostel.priceRange.max}
                  </p>
                  <button
                    onClick={() => navigateToHostelDetails(hostel)}
                    className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.map((hostel) => (
            <div key={hostel._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {hostel.images && hostel.images[0] && (
                <img
                  src={hostel.images[0]}
                  alt={hostel.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{hostel.name}</h3>
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hostel.address || hostel.location}, {hostel.city}
                </p>
                <p className="text-sm font-medium text-red-600 mb-3">
                  Rs. {hostel.priceRange.min} - Rs. {hostel.priceRange.max}
                </p>
                <button
                  onClick={() => navigateToHostelDetails(hostel)}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      <Footer />
      

    </div>
  );
};

export default MapSearch;