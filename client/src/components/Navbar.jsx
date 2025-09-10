/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets.js'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { motion } from 'motion/react'

const Navbar = () => {

    const { setShowLogin, user, logout, isOwner, axios, setToken, fetchUser, setUser, setIsOwner } = useAppContext();

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Update the changeRole function with better error handling
    const changeRole = async () => {
        try {
            console.log("Starting role change...");

            const { data } = await axios.post('/api/owner/change-role');
            console.log("Role change response:", data);

            if (data.success) {
                // Store token and update user state directly
                localStorage.setItem('token', data.token);
                setToken(data.token);

                // If the server included user data in response, use it
                if (data.user) {
                    setUser(data.user);
                    setIsOwner(data.user.role === 'owner');
                    toast.success('Now you can list cars');
                    navigate('/owner');
                    return;
                }

                // Otherwise fetch updated user data
                const updatedUser = await fetchUser();
                console.log("Updated user data:", updatedUser);

                if (updatedUser && updatedUser.role === 'owner') {
                    navigate('/owner');
                    toast.success('Now you can list cars');
                } else {
                    console.error("Role update verification failed:", updatedUser);
                    toast.error(`Role update verification failed. ${updatedUser ? `Current role: ${updatedUser.role}` : 'User data missing'}`);
                }
            } else {
                toast.error(data.message || "Unknown error occurred");
            }
        } catch (error) {
            console.error('Role change error:', error);
            toast.error(error.response?.data?.message || error.message || "Failed to update role");
        }
    }

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-between md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>
            <Link to="/">
                <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className='h-8' />
            </Link>

            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path}>
                        {link.name}
                    </Link>
                ))}

                <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                    <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='search products' />
                    <img src={assets.search_icon} alt="search" />
                </div>

                <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
                    <button onClick={() => isOwner ? navigate("/owner") : changeRole()} className='cursor-pointer'>{isOwner ? "Dashboard" : "List cars"}</button>

                    <button onClick={() => { user ? logout() : setShowLogin(true) }} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'>{user ? "Logout" : "Login"}</button>
                </div>
            </div>

            <button className='sm:hidden cursor-pointer' aria-label='menu' onClick={() => setOpen(!open)}>
                <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>

        </motion.div>
    )
}

export default Navbar