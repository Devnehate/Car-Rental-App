/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useState } from 'react'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

const Cars = () => {
  const [searchParam] = useSearchParams();
  const pickupLocation = searchParam.get('pickupLocation');
  const pickupDate = searchParam.get('pickupDate');
  const returnDate = searchParam.get('returnDate');

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);

  // Debug function to check data
  useEffect(() => {
    console.log("Context cars:", cars);
    console.log("Search params:", { pickupLocation, pickupDate, returnDate });
  }, [cars, pickupLocation, pickupDate, returnDate]);

  const applyFilter = async () => {
    if (input === '') {
      setFilteredCars(cars);
      return null;
    }

    const filtered = cars.slice().filter((car) => {
      return car.brand.toLowerCase().includes(input.toLowerCase())
        || car.model.toLowerCase().includes(input.toLowerCase())
        || car.category.toLowerCase().includes(input.toLowerCase())
      || car.transmission.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredCars(filtered);
  }

    const searchCarAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        // Format dates properly to ensure consistency
        console.log("Sending search request with:", {
          location: pickupLocation,
          pickupDate,
          returnDate
        });

        // Add timeout to ensure request completes
        const { data } = await axios.post('/api/bookings/check-availability', {
          location: pickupLocation,
          pickupDate,
          returnDate
        }, { timeout: 10000 });

        // More detailed logging
        console.log("Raw API response:", data);
        console.log("Available cars array:", data.availableCars);
        console.log("Available cars count:", data.availableCars ? data.availableCars.length : 0);

        if (data.success) {
          setAvailableCars(data.availableCars || []);
          setFilteredCars(data.availableCars || []);

          if (!data.availableCars || data.availableCars.length === 0) {
            toast('No cars available for selected criteria', {
              icon: 'ℹ️',
            });
          } else {
            toast.success(`Found ${data.availableCars.length} available cars`);
          }
        } else {
          setError(data.message || "Failed to get available cars");
          toast.error(data.message || "Failed to get available cars");
          setAvailableCars([]);
          setFilteredCars([]);
        }
      } catch (error) {
        console.error('Error fetching available cars:', error);
        setError(error.message || "Network error");
        toast.error(`Failed to fetch available cars: ${error.message}`);
        setAvailableCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      if (isSearchData) {
        console.log("Search data is available, executing search");
        searchCarAvailability();
      } else {
        console.log("No search data, showing all cars");
        setAvailableCars(cars || []);
        setFilteredCars(cars || []);
      }
    }, [isSearchData, cars, pickupLocation, pickupDate, returnDate]);

    // Filter cars based on search input
    useEffect(() => {
      if (input.trim() === '') {
        setFilteredCars(availableCars);
        return;
      }

      const searchTerm = input.toLowerCase();
      const filtered = availableCars.filter(car =>
        car.make?.toLowerCase().includes(searchTerm) ||
        car.model?.toLowerCase().includes(searchTerm) ||
        (car.features && Array.isArray(car.features) &&
          car.features.some(feature => feature.toLowerCase().includes(searchTerm)))
      );

      setFilteredCars(filtered);
    }, [input, availableCars]);

    useEffect(() => {
      cars.length > 0 && !isSearchData && applyFilter();
    }, [input, cars]);

    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='flex flex-col items-center py-20 bg-light max-md:px-4'>
          <Title title='Available Cars' subtitle='Browse our selection of premium vehicles available for your next adventure' />
          <motion.div
            innitial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
            <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />

            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model or features' className='w-full h-full outline-none text-gray-500' />

            <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
          <p className='text-gray-500 px-20 max-w-7xl mx-auto'>
            {loading ? 'Loading cars...' : `Showing ${filteredCars.length} Cars`}
          </p>

          {error && (
            <p className='text-red-500 text-center mt-4'>{error}</p>
          )}

          {!loading && filteredCars.length === 0 && !error && (
            <p className='text-center my-10'>No cars available matching your criteria. Please try different search parameters.</p>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
            {filteredCars.map((car, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={index}>
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  export default Cars