import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fontsource/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Chart from '../components/Chart';
import Card from '../components/CardSurvey';
import axios from 'axios';
import { FrappeContext, useSWR } from 'frappe-react-sdk';
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'
import Select from 'react-select';

// !dropdown ทำแก้ 
// *placeholder="Search..."
// !dropdown ใส่ map
// !ใส่พิกัดในแผนที่
// !แก้ปี
// !นับจน.ป้ายเอง
// !totolpice ยังใช้ไม่ได้
// *get success

export default function Home() {
  const { call } = useContext(FrappeContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMoo, setSelectedMoo] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const [selectedCard, setSelectedCard] = useState(null); 

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
        setSelectedMoo(selectedOption.value); 
        console.log("Selected Value:", selectedMoo); 
    } else {
        console.error("Selected option is null/undefined");
    }
};

  //useSWR()

 useEffect(() => {
  const fetchData = () => {
    setLoading(true);
    call.get("maechan.api.get_all_billboard_documents")
    .then(response => {
      console.log(response.message)
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
    fetchData();
  }, [call]);


  const handleToggleShowAll = () => {
    setShowAllCards(prev => !prev);
  };

  const handleCardClick = (billboard) => {
    console.log(billboard)
    console.log(billboard.name)
    const encodedName = encodeURIComponent(billboard.name);
    navigate(`/card-detail/${encodedName}`, { state: { billboard } });
  };


  const sortedBillboards = billboards.sort((a, b) => {
      return new Date(a.created_date) - new Date(b.created_date);
  });
  const uniqueYears = [...new Set(billboards.map(billboard => new Date(billboard.created_date).getFullYear()))];
  const sortedYears = uniqueYears.sort((a, b) => a - b);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: 'none', 
      borderRadius: '1.5rem', 
      backgroundColor: 'white',
      paddingLeft: '12px',
      paddingRight: '2px', 
      boxShadow: state.isFocused ? '0 0 0 2px rgba(79, 70, 229, 0.5)' : 'none', 
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingRight: '8px', 
    }),
    indicatorSeparator: () => ({
      display: 'none', 
    }),
  };
  const options = billboards
  .map((billboard) => ({
    value: billboard.moo,
    label: billboard.moo,
  }))
  .filter(
    (option, index, self) =>
      index === self.findIndex((o) => o.value === option.value)
  );

  return (
    <div className='bg-sky-200 min-h-screen'>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="relative m-6 flex justify-center items-center">
        <Select
          value={selectedMoo}
          onChange={handleSelectChange}
          classNamePrefix="tailwind"
          className="w-11/12 h-10 text-base text-back"
          styles={customStyles}
          options={options}
          placeholder=''
        >
        </Select>
      </div>
      {selectedMoo ? (
        <>
        <Chart />

        <div className='p-5 text-left text-sky-950 '>
          <div
            className='underline text-xl font-prompt font-semibold text-sky-950'><p>ผลการสำรวจ</p></div>
            {sortedYears.map((year, index) => (
              <div key={year}>
                <h3 className='text-center font-semibold font-prompt'>ปี {year}</h3>
                <div className=''>
                  {sortedBillboards
                  .filter(billboard => new Date(billboard.created_date).getFullYear() === year && 
                  billboard.moo === selectedMoo)
                  .map(billboard => (
                      <div key={billboard.name} onClick={() => handleCardClick(billboard)}>
                      <Card
                          landCode={billboard.land_id}
                          ownerName={billboard.owner_name}
                          signCount={billboard.data_billboards.length}
                      />
                  </div>
                    ))}
                </div>
                {index < sortedYears.length - 1 && <hr className="divide-y border-gray-400 my-5" />}
            </div>
          ))}
          {sortedYears.length > 2 && (
            <p onClick={handleToggleShowAll} className='underline text-center font-prompt font-semibold text-sky-950'>
              {showAllCards ? 'ปิด' : 'ดูเพิ่มเติม'}
            </p>
          )}
        </div>
      </>
      ) : null}
    </div>
  )
}

function Navbar({ toggleSidebar }) {
  return (
    <nav className='sticky top-0 bg-sky-800 h-14 fixed top-0 left-0 w-full z-50'>
      <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-4 pt-3" onClick={toggleSidebar}></i>
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
    <div className={`fixed z-50 top-0 left-0 w-[250px] h-full bg-sky-800 text-white  font-prompt font-bold overflow-hidden flex flex-col justify-between transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <nav className='bg-sky-800 h-14'>
          <i className="fas fa-bars flex text-left w-7 text-white text-2xl px-6 py-3 " onClick={toggleSidebar}></i>
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