import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useFrappeAuth } from 'frappe-react-sdk'


export default function Manu() {
    const navigate = useNavigate();
    const {
    currentUser,
    isValidating,
    isLoading,
    login,
    logout,
    error,
    updateCurrentUser,
    getUserCookie,

  } = useFrappeAuth()
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const handleNavigate = (path) => {
    navigate(path);
  };
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const getBackgroundColor = (path) => {
    switch (path) {
      case '/home':
        return 'bg-Fountain-Blue-300'; // สีพื้นหลังสำหรับ /home
      case '/search':
        return 'bg-Fountain-Blue-300'; // สีพื้นหลังสำหรับ /search
      case '/explore':
        return 'bg-Fountain-Blue-300'; // สีพื้นหลังสำหรับ /explore
      case '/profile':
        return 'bg-Fountain-Blue-300'; // สีพื้นหลังสำหรับ /profile
      default:
        return 'bg-gray-200'; // สีพื้นหลังเริ่มต้น
    }
  };
  
    return (
    <div className={`sticky bottom-0 left-0 w-full text-center p-4 bg-gray-200`}>
      <div className="flex justify-between z-10">
        {['/home', '/search', '/explore', '/profile'].map((path, index) => (
          <div
            key={index}
            className={`relative flex items-center px-5 py-2.5 font-prompt font-bold cursor-pointer ${
              currentPath === path ? 'text-blue-600' : 'text-gray-800'
            }`}
            onClick={() => handleNavigate(path)}
          >
            {currentPath === path && (
              <div className={`absolute -bottom-2 left-0 w-full h-4 rounded-t-full ${getBackgroundColor(path)}`}></div>
            )}
            {path === '/home' && <i className="fas fa-home mr-2.5 text-[1.7rem]"></i>}
            {path === '/search' && <i className="fa-solid fa-magnifying-glass mr-2.5 text-[1.7rem]"></i>}
            {path === '/explore' && <i className="fas fa-compass mr-2.5 text-[1.7rem]"></i>}
            {path === '/profile' && <i className="fa-regular fa-circle-user text-[1.7rem]"></i>}
          </div>
        ))}
     
      </div>
    </div>
  )
}
