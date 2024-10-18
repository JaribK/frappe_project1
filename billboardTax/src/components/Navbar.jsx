import React from 'react'
import { useFrappeAuth } from 'frappe-react-sdk'
import { useLocation, Link } from 'react-router-dom';

export default function Navbar({ toggleSidebar }) {
    const { currentUser } = useFrappeAuth();
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/home':
                return 'Home';
            case '/explore':
                return 'Explore';
            case '/search':
                return 'Search Survey Results';
            case '/help':
                return 'Help';
            case '/map':
                return 'Map';
            case '/profile':
                return 'Profile';
            default:
                return 'Dashboard';
        }
    };

    return (
      <nav className='sticky top-0 bg-curious-blue-500 flex items-center h-20 left-0 w-full z-50'>
        {/* <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-4 pt-3" onClick={toggleSidebar}></i> */}
        {/* <div className='flex items-center px-4 py-4  ml-auto bg-curious-blue-300 h-10 m-2 rounded-lg'> */}
        <p className='text-white text-[1.75rem] font-Roboto font-medium ml-6'>{getPageTitle()}</p>
        {/* <div className='flex items-center px-2 py-2  ml-auto bg-curious-blue-500 h-10 m-2 rounded-lg'>
          <i className   ="fa-regular fa-circle-user text-white text-3xl px-4"></i>
          <p className='ml-2 text-white pr-4'>{currentUser}</p>
        </div> */}
      </nav>
    );
  }
