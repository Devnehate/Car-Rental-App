import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Hero = () => {

  const [pickupLocation, setPickupLocation] = useState('');

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

  const handleSearch = (e) => { 
    e.preventDefault();
    navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate);
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

      <h1 className='text-4xl md:text-5xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text'>Luxury Cars On Rent</h1>

      <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.1)]'>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-8 min-md:ml-8'>
          <div className='flex flex-col items-start gap-2'> 
            <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className='w-full md:w-62 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value="">Pickup Location</option>
              {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <p className='px-1 text-sm text-gray-500'>{ pickupLocation ? pickupLocation : 'Please select a location'}</p>
          </div>

          <div className='flex flex-col items-start gap-2'>
            <label htmlFor='pickup-date'>Pick-up Date</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" id="pickup-date" min={new Date().toISOString().split("T")[0]}
              className='text-sm text-gray-500' required
            />
          </div>

           <div className='flex flex-col items-start gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} type="date" id="return-date"
              className='text-sm text-gray-500' required
            />
          </div>
          
        </div>

          <button className='flex items-center justify-center gap-1 px-7 py-3 max-sm:mt-4 mr-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full cursor-pointer'>
            <img src={assets.search_icon} alt="search" className='brightness-300' />
            Search</button>

      </form>

      <img src={assets.main_car} alt="car" className='max-h-74 drop-shadow-[0_10px_10px_rgba(0,70,255,0.15)]' />

    </div>
  )
}

export default Hero