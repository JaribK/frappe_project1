import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fontsource/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PieChart from '../components/ChartSwitcher';
import Card from '../components/CardSurvey';
import axios from 'axios';
import { FrappeContext, useSWR } from 'frappe-react-sdk';
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'

// !dropdown ทำแก้ 
// *placeholder="Search..."
// !dropdown ใส่ map
// !ใส่พิกัดในแผนที่
// !แก้ปี

export default function Home() {
  const { call } = useContext(FrappeContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const [selectedCard, setSelectedCard] = useState(null); 

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  //useSWR()

 useEffect(() => {
  const cardData = () => {
    setLoading(true);
    call.get("maechan.api.get_all_billboard_documents")
    .then(response => {
      setBillboards(response.message);  
      console.log(response.message)
      setLoading(false);  
    })
    .catch(err => {
      setError('Error fetching billboard data'); 
      if (err.response && err.response.data && err.response.data.message) {
        console.log(err.response.data.message);
      } else {
        console.log(err);
      }
      setLoading(false);  
    });
  };
    cardData();
  }, [call]);


  const sortedYears = billboards ? Object.keys(billboards).sort((a, b) => b - a) : [];
  const displayedYears = showAllCards ? sortedYears : sortedYears.slice(0, 1);

  const handleToggleShowAll = () => {
    setShowAllCards(prev => !prev);
  };

  const handleCardClick = (card) => {
    navigate(`/card-detail/${card.id}`, { state: { card } });
  };

  // const handleCloseModal = () => {
  //   setSelectedCard(null);
  // };


  return (
    <div className='bg-sky-200'>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="relative m-6 flex justify-center items-center">
        <select
          value={selectedValue}
          onChange={handleSelectChange}
          className="w-11/12 h-10 border-none rounded-3xl text-gray-400 text-lg bg-white py-0 pl-3 pr-7 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="" disabled></option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-end pr-7 pointer-events-none">
          <i className="fas fa-chevron-down text-gray-400"></i>
        </div>
      </div>



      <PieChart />
      <div className='p-5 text-left text-sky-950'>
        <div
          className='underline text-xl font-prompt font-semibold text-sky-950'><p>ผลการสำรวจ</p></div>
        {displayedYears.map((year, index) => (
          <div key={year}>
            <h3 className='text-center font-semibold font-prompt'>ปี {year}</h3>
            <div>
              {cardData[year].slice(0, 3).map((card) => (
                <div key={card.id} onClick={() => handleCardClick(card)}>
                  <Card
                    landCode={card.landCode}
                    ownerName={card.owner_name}
                    signCount={card.signCount}
                  />
                </div>
              ))}
              {index < displayedYears.length - 1 && <hr className="divide-y border-gray-400 my-5" />}
            </div>
          </div>
        ))}
        {sortedYears.length > 2 && (
          <p onClick={handleToggleShowAll} className='underline text-center font-prompt font-semibold text-sky-950'>
            {showAllCards ? 'ปิด' : 'ดูเพิ่มเติม'}
          </p>
        )}
      </div>
    </div>
  )
}

function Navbar({ toggleSidebar }) {
  return (
    <nav className='sticky top-0 bg-sky-800 h-14 fixed top-0 left-0 w-full '>
      <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-4 " onClick={toggleSidebar}></i>
    </nav>
  );
}

function Sidebar({ isSidebarOpen, toggleSidebar }) {
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

  const dologout = async () => {
    try {
      if (!currentUser) {
        console.error('user not found');
        return;
      }
      await logout();
      console.log('logout succeed')
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={`fixed z-50 top-0 left-0 w-[250px] h-full bg-sky-800 text-white font-prompt font-bold overflow-hidden flex flex-col justify-between transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <nav className='bg-sky-800 h-14'>
          <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-4 " onClick={toggleSidebar}></i>
        </nav>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/home')}>
          <i className="fas fa-home mr-2.5" ></i>
          <p>หน้าแรก</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/explore')}>
          <i className="fas fa-compass mr-2.5" ></i>
          <p>สำรวจ</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-t-2 ' onClick={() => handleNavigate('/manual')}>
          <i className="fas fa-book-open mr-2.5" ></i>
          <p>คู่มือการใช้งาน</p>
        </div>
        <div className='flex items-center px-5 py-2.5 font-prompt font-bold border-y-2 ' onClick={() => handleNavigate('/help')}>
          <i className="fas fa-info-circle mr-2.5"></i>
          <p>ศูนย์ช่วยเหลือ</p>
        </div>
      </div>
      <div className='flex items-center border-t-2 inline-flex'>
        <i className="fas fa-sign-out-alt text-2xl m-2.5 px-5" onClick={dologout}></i>
        <p className='mt-1 text-xl items-center '>Logout</p>
      </div>
    </div>
  );
}