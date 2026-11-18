import HostelPhoto from '../components/HostelPhoto';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeroImage from '../assets/HeroImage.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterHostel from '../components/RegisterHostel';
import AboutUs from '../components/AboutUs';
import { API_BASE_URL } from '../api';


const Home = () => {
  const navigate = useNavigate();
  const [featuredHostels, setFeaturedHostels] = useState([]);
  const [allHostels, setAllHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [loading, setLoading] = useState({
    featured: true,
    all: false,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    city: '',
    hostelType: '',
    roomType: '',
    priceRange: '',
  });

  useEffect(() => {
    const fetchFeaturedHostels = async () => {
      try {
        setLoading((prev) => ({ ...prev, featured: true }));
        const response = await axios.get(`${API_BASE_URL}/hostels?featured=true`);
        console.log('Featured hostels:', response.data);
        setFeaturedHostels(response.data);
        setFilteredHostels(response.data);
      } catch (error) {
        console.error('Error fetching featured hostels:', error);
        toast.error('Error fetching featured hostels');
      } finally {
        setLoading((prev) => ({ ...prev, featured: false }));
      }
    };

    fetchFeaturedHostels();
  }, []);

  useEffect(() => {
    const fetchAllHostels = async () => {
      try {
        setLoading((prev) => ({ ...prev, all: true }));
        const response = await axios.get(`${API_BASE_URL}/hostels`);
        console.log('All hostels:', response.data);
        setAllHostels(response.data);
        applyFilters(response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
        toast.error('Error fetching hostels');
      } finally {
        setLoading((prev) => ({ ...prev, all: false }));
      }
    };

    const hasFilters = Object.values(filters).some((value) => value !== '');
    if (hasFilters) {
      setIsSearching(true);
      fetchAllHostels();
    } else {
      setIsSearching(false);
      setFilteredHostels(featuredHostels);
    }
  }, [filters, featuredHostels]);

  const applyFilters = (hostelsToFilter) => {
    const filtered = hostelsToFilter.filter((hostel) => {
      const matchesName =
        !filters.name ||
        hostel.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesLocation =
        !filters.location ||
        hostel.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCity =
        !filters.city ||
        hostel.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesType =
        !filters.hostelType ||
        hostel.hostelType.toLowerCase() === filters.hostelType.toLowerCase();
      const matchesRoomType =
        !filters.roomType ||
        (hostel.rooms && hostel.rooms.some(room => 
          room.roomType && room.roomType.toLowerCase() === filters.roomType.toLowerCase()
        ));
      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        matchesPrice =
          hostel.priceRange.min <= max && hostel.priceRange.max >= min;
      }

      return matchesName && matchesLocation && matchesCity && matchesType && matchesRoomType && matchesPrice;
    });
    setFilteredHostels(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      name: '',
      location: '',
      city: '',
      hostelType: '',
      roomType: '',
      priceRange: '',
    });
    setIsSearching(false);
    setFilteredHostels(featuredHostels);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
            <div className="min-w-0 bg-gray-50 p-5 sm:p-8 xl:p-12 rounded-lg flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Find Your Perfect Hostel
              </h1>
              <p className="text-gray-600 mb-5 sm:mb-8 sm:text-lg">
                Discover the best hostels in Kathmandu and beyond with Hostel Hub.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => navigate('/hostel')}
                  className="bg-red-500 text-white px-4 sm:px-6 py-3 rounded-full text-sm sm:text-base font-medium hover:bg-red-600 transition-colors"
                >
                  Explore Hostels
                </button>
                <button
                  onClick={() => navigate('/map-search')}
                  className="bg-blue-500 text-white px-4 sm:px-6 py-3 rounded-full text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors"
                >
                  Map Search
                </button>
              </div>
            </div>
            <div className="min-w-0">
              <img
                src={HeroImage}
                alt="Hostel illustration"
                className="w-full h-52 sm:h-64 md:h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Search Hostels Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search Hostels</h2>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(6,minmax(0,1fr))_auto] gap-3 sm:gap-4 [&>*]:min-w-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Enter hostel name"
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="e.g., Kathmandu"
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Type</label>
              <select
                name="hostelType"
                value={filters.hostelType}
                onChange={handleFilterChange}
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Type</option>
                <option value="Boys Hostel">Boys Hostel</option>
                <option value="Girls Hostel">Girls Hostel</option>
                <option value="Co-ed">Co-ed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                name="roomType"
                value={filters.roomType}
                onChange={handleFilterChange}
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Room Type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Dorm">Dorm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Price Range</option>
                <option value="10000-12000">NPR 10000 - 12000</option>
                <option value="10000-15000">NPR 10000 - 15000</option>
                <option value="12000-15000">NPR 12000 - 15000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/*  Featured Hostels Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 font-poppins">
            {isSearching ? 'Search Results' : 'Featured Hostels'}
          </h2>
          {loading.featured || loading.all ? (
            <p className="font-poppins">Loading...</p>
          ) : filteredHostels.length === 0 ? (
            <p className="font-poppins">No hostels found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel) => (
                <div
                  key={hostel._id}
                  className="min-w-0 break-words border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-200"
                >
                  <div className="relative mb-4">
                    <HostelPhoto path={hostel.images?.[0]} alt={hostel.name} className="w-full h-40 object-cover rounded-lg" />
                    {!isSearching && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full font-poppins">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-poppins">{hostel.name}</h3>
                  <p className="text-gray-700 text-sm mb-1 font-poppins">{hostel.location}, {hostel.city}</p>
                  <p className="text-gray-700 text-sm mb-1 font-poppins">{hostel.hostelType}</p>
                  <p className="text-gray-700 text-sm mb-1 font-poppins">
                    Owner: {hostel.owner?.name || hostel.ownername || 'Unknown'}
                  </p>
                  <p className="text-gray-700 text-sm font-semibold mb-3 font-poppins">
                    NPR {hostel.priceRange?.min || 'N/A'} - NPR {hostel.priceRange?.max || 'N/A'}
                  </p>
                  <button
                    onClick={() => navigate(`/hostels/${hostel._id}`)}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-poppins"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <RegisterHostel />
      
        <AboutUs />
      </main>
      <Footer />
      

      
    </div>
  );
};

export default Home;