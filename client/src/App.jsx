/* eslint-disable no-unused-vars */
import { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import CarDetails from './Pages/CarDetails';
import Cars from './Pages/Cars';
import MyBookings from './Pages/MyBookings';
import Footer from './components/Footer';
import Layout from './Pages/owner/Layout';
import Dashboard from './Pages/owner/Dashboard';
import AddCar from './Pages/owner/AddCar';
import ManageCars from './Pages/owner/ManageCars';
import ManageBookings from './Pages/owner/ManageBookings';

const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner');

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/owner' element={<Layout />} >
          <Route index element={<Dashboard />} />
          <Route path="Add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />

        </Route>

      </Routes>

      {!isOwnerPath && <Footer />}

    </>
  )
}

export default App